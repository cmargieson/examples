# Google Cloud Billing

**Google Cloud Billing** is a Firebase Function that disconnects a Billing Account from a Firebase Project once a particular spend amount is met. This is useful for projects that have the potential for unlimited billing.

Setup in Google Cloud Platform UI following [this guide](https://cloud.google.com/billing/docs/how-to/notify#cap_disable_billing_to_stop_usage
).

### PubSub

- Messaging from GCP to client Cloud Function.