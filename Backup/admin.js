// Import required Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAGkdQK1kXJ6_KGKSmiBLAKd887XfhMqds",
  authDomain: "sim-lab-32229.firebaseapp.com",
  projectId: "sim-lab-32229"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// UI target
const adminBookingList = document.getElementById("adminBookingList");

// Fetch and display bookings
async function loadBookings() {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Name:</strong> ${data.name}<br>
        <strong>Reg. No.:</strong> ${data.regNo}<br>
        <strong>Mentor:</strong> ${data.mentor}<br>
        <strong>Reason:</strong> ${data.reason}<br>
        <strong>Lab:</strong> ${data.lab}<br>
        <strong>Date:</strong> ${data.date}<br>
        <strong>Status:</strong> ${data.status}
        <hr>
      `;
      adminBookingList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
  }
}

loadBookings();
