// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyAryJzJGE30yJvDp_uc8KnrECz_2sdwUAA",
  authDomain: "hostel-on-duty.firebaseapp.com",
  projectId: "hostel-on-duty",
  storageBucket: "hostel-on-duty.firebasestorage.app",
  messagingSenderId: "985978177553",
  appId: "1:985978177553:web:e942568fb35e7ce03e49b0",
  measurementId: "G-EYNQ87SFJ6"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
