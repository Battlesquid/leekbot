const admin = require('firebase-admin');
const serviceAccount = require('../firebase/renderbot_service.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://renderbot-95c17.firebaseio.com"
  });
module.exports = admin.database();