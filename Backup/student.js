// student.js

function bookLab() {
  const name = document.getElementById("name").value;
  const regNo = document.getElementById("regNo").value;
  const mentor = document.getElementById("mentor").value;
  const lab = document.getElementById("lab").value;
  const reason = document.getElementById("reason").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!name || !regNo || !mentor || !lab || !reason || !date || !time) {
    document.getElementById("message").innerText = "All fields required.";
    return;
  }

  db.collection("bookings").add({
    name: name,
    regNo: regNo,
    mentor: mentor,
    lab: lab,
    reason: reason,
    date: date,
    time: time,
    status: "pending"  // faculty/admin can approve later
  }).then(() => {
    document.getElementById("message").innerText = "Booking submitted Successfully!";
  }).catch((error) => {
    console.error("Error booking:", error);
    document.getElementById("message").innerText = "Error Submitting booking.";
  });
}
