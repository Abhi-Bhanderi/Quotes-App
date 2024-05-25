const admin = require("firebase-admin");

const serviceAccount = require("../utils/credantials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
