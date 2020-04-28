const firebase = require("firebase");
firebase.initializeApp({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DBURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MSGID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREID
});

module.exports = firebase.database();