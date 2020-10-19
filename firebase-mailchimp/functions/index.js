const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();

// Automatically allow cross-origin requests.
app.use(cors({ origin: true }));

// Parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true }));

// To set environment variable use:
// firebase functions:config:set mailchimp.apikey=[key]

// To get environment variable use:
// functions.config().mailchimp.apikey

const apiKey = functions.config().mailchimp.apikey;

// Mailchimp API root.
const baseUrl = `https://${apiKey.split("-")[1]}.api.mailchimp.com/3.0`;

// Add or update a list member.
app.put("/lists/:list_id/members/:subscriber_hash", (req, res) => {
  axios
    .request({
      // Server URL that will be used for the request.
      url: `/lists/${req.params.list_id}/members/${req.params.subscriber_hash}/`,
      // Request method to be used when making the request.
      method: "put",
      // Prepended to `url` unless `url` is absolute.
      baseURL: baseUrl,
      // Data to be sent as the request body.
      data: JSON.stringify({
        email_address: req.body.email_address,
        status_if_new: req.body.status_if_new,
        status: req.body.status,
      }),
      // HTTP Basic auth should be used, and supplies credentials.
      auth: {
        username: "username",
        password: apiKey,
      },
    })
    .then((results) => {
      // 200 OK
      console.log(results.data);
      // res.status(200).send(results);
      res.status(200).send(results.data);
    })
    .catch((error) => {
      if (error.response) {
        // The request was made. Response outside 2xx.
        // 400 Bad Request.
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        res.status(400).send(error.response.data);
      }
      if (error.request) {
        // The request was made. No response.
        // 408 Request Timeout.
        console.log(error.request);
        res.status(408);
      }
      // 500 Internal Server Error.
      console.log(error.config);
      res.status(500);
    });
});

// Expose Express API as a single Cloud Function:
exports.mailchimp = functions.https.onRequest(app);
