// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyAGkdQK1kXJ6_KGKSmiBLAKd887XfhMqds",
  authDomain: "sim-lab-32229.firebaseapp.com",
  projectId: "sim-lab-32229",
  storageBucket: "sim-lab-32229.firebasestorage.app",
  messagingSenderId: "598968427635",
  appId: "1:598968427635:web:fd315c47554eb4731a7606"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
