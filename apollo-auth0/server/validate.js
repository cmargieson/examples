const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "https://dev-jht7abl4.au.auth0.com/.well-known/jwks.json",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const options = {
  audience: "wu068LKYSTC9oLLEAehid5Die6E72ZSa", // ClientID
  issuer: "https://dev-jht7abl4.au.auth0.com/",
  algorithms: ["RS256"],
};

const getUser = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (error, decoded) => {
      if (error) {
        reject(error);
      }
      resolve(decoded);
    });
  });
};

module.exports = getUser;
