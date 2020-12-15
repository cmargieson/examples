const functions = require("firebase-functions");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

// https://cloud.google.com/billing/docs/how-to/notify#cap_disable_billing_to_stop_usage

const PROJECT_ID = "city-walks-6f62c";
const PROJECT_NAME = `projects/${PROJECT_ID}`;
const billing = google.cloudbilling("v1").projects;

exports.stopBilling = functions.pubsub
  .topic("stop-billing")
  .onPublish(async (pubsubEvent) => {
    const pubsubData = JSON.parse(
      Buffer.from(pubsubEvent.data, "base64").toString()
    );

    functions.logger.info("Message received.", { structuredData: pubsubData });

    if (pubsubData.costAmount <= pubsubData.budgetAmount) {
      functions.logger.info(
        `No action necessary. (Current cost: ${pubsubData.costAmount})`
      );
      return `No action necessary. (Current cost: ${pubsubData.costAmount})`;
    }

    _setAuthCredential();

    const billingEnabled = await _isBillingEnabled(PROJECT_NAME);

    if (billingEnabled) {
      return _disableBillingForProject(PROJECT_NAME);
    } else {
      functions.logger.info("Billing already disabled");
      return "Billing already disabled";
    }
  });

/**
 * @return {Promise} Credentials set globally
 */
const _setAuthCredential = () => {
  const client = new GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/cloud-billing",
      "https://www.googleapis.com/auth/cloud-platform",
    ],
  });

  // Set credential globally for all requests
  google.options({
    auth: client,
  });
};

/**
 * Determine whether billing is enabled for a project
 * @param {string} projectName Name of project to check if billing is enabled
 * @return {bool} Whether project has billing enabled or not
 */
const _isBillingEnabled = async (projectName) => {
  try {
    const res = await billing.getBillingInfo({ name: projectName });
    return res.data.billingEnabled;
  } catch (e) {
    functions.logger.info(
      "Unable to determine if billing is enabled on specified project, assuming billing is enabled"
    );
    return true;
  }
};

/**
 * Disable billing for a project by removing its billing account
 * @param {string} projectName Name of project disable billing on
 * @return {string} Text containing response from disabling billing
 */
const _disableBillingForProject = async (projectName) => {
  const res = await billing.updateBillingInfo({
    name: projectName,
    resource: { billingAccountName: "" }, // Disable billing
  });
  functions.logger.info(`Billing disabled: ${JSON.stringify(res.data)}`);
  return `Billing disabled: ${JSON.stringify(res.data)}`;
};
