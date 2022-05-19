// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  push,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjbohe2QWkWav8H4pSoGF1h0ZWykZI8YQ",
  authDomain: "spy-peerjs.firebaseapp.com",
  databaseURL:
    "https://spy-peerjs-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spy-peerjs",
  storageBucket: "spy-peerjs.appspot.com",
  messagingSenderId: "409968577009",
  appId: "1:409968577009:web:36fc848f525dba93949c50",
  measurementId: "G-DCQTBCZF9Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Working with realtime database: https://firebase.google.com/docs/database/web/read-and-write#web-version-9
const database = getDatabase(app);
const spyTargetsRef = ref(database, "spy-targets");

export function onSpyTargetsPeerIDChanged(callback) {}

export function addTargetPeerID(peerid, name = "Name") {
  updateTargetPeerID(peerid, name);
}

export function deleteTargetPeerID(peerid) {
  updateTargetPeerID(peerid, null, true);
}

function updateTargetPeerID(peerid, name, isDelete = false) {
  update(spyTargetsRef, {
    [peerid]: isDelete
      ? null
      : {
          name: name,
          joinedAt: new Date().toLocaleString(),
        },
  });
}

// onValue(spyTargetsRef, (snapshot) => {
//   const data = snapshot.val();
// });

export { onValue, spyTargetsRef };
