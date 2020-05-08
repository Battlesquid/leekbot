const firebase = require("firebase-admin");
firebase.initializeApp({
  credential: firebase.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
  storageBucket: `${process.env.STORAGE_BUCKET}.appspot.com`,
  databaseURL: process.env.DBURL
});

module.exports = {
  database: firebase.database(),
  storage: firebase.storage().bucket(process.env.STORAGE_BUCKET),
  ref(location) {
    return firebase.database().ref(location);
  },
  readDatabaseAt(ref, event) {
    return firebase.database().ref(ref).once(event).then(res => res).catch(e => console.log(e));
  }
} 
