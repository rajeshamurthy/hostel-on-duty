// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKNq9EN36hd_eKp3zQm4ERe4uCXu43dxU",
  authDomain: "hostel-on-duty-6f2af.firebaseapp.com",
  projectId: "hostel-on-duty-6f2af",
  storageBucket: "hostel-on-duty-6f2af.firebasestorage.app",
  messagingSenderId: "557682564404",
  appId: "1:557682564404:web:c302d19f9765873f98d961",
  measurementId: "G-W70NMPZNVB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();