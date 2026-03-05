// faculty.js

function renderBooking(doc) {
  const data = doc.data(); // ✅ Get data from Firestore document
  const bookingList = document.getElementById("bookingList");

  const div = document.createElement("div");
  div.innerHTML = `
    <strong>Name:</strong> ${data.name}<br>
    <strong>Reg. No.:</strong> ${data.regNo}<br>
    <strong>Mentor:</strong> ${data.mentor}<br>
    <strong>Reason:</strong> ${data.reason}<br>
    <strong>Lab:</strong> ${data.lab}<br>
    <strong>Date:</strong> ${data.date}<br>
    <strong>Time:</strong> ${data.time}<br>
    <strong>Status:</strong> ${data.status}<br>
    <button onclick="updateStatus('${doc.id}', 'approved')">Approve</button>
    <button onclick="updateStatus('${doc.id}', 'rejected')">Reject</button>
    <hr />
  `;
  bookingList.appendChild(div);
}


function updateStatus(id, newStatus) {
  db.collection("bookings").doc(id).update({
    status: newStatus
  }).then(() => {
    alert("Status updated to " + newStatus);
    location.reload();
  });
}

db.collection("bookings").orderBy("date").onSnapshot(snapshot => {
  snapshot.forEach(doc => {
    renderBooking(doc);
  });
});
