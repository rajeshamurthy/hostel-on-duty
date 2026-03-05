// student.js
console.log("student.js loaded");
console.log("Firebase initialized, db:", db, "auth:", auth);

document.getElementById("applicationForm").addEventListener("submit", function(e) {
  e.preventDefault();
  console.log("Form submit triggered");

  if (!auth.currentUser) {
    alert("You must be logged in to submit an application.");
    document.getElementById("message").innerText = "Please log in first.";
    return;
  }

  const name = document.getElementById("name").value.trim();
  const regNo = document.getElementById("regNo").value.trim();
  const parentName = document.getElementById("parentName").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  console.log("Validation check");
  if (!name || !regNo || !parentName || !reason || !fromDate || !toDate) {
    document.getElementById("message").innerText = "All fields are required!";
    return;
  }

  console.log("Validation passed");

  // Generate random 5-digit acknowledgment number
  const acknowledgmentNumber = Math.floor(10000 + Math.random() * 90000);
  console.log("Acknowledgment generated:", acknowledgmentNumber);

  db.collection("od_applications").add({
    name,
    regNo,
    parentName,
    reason,
    fromDate,
    toDate,
    acknowledgmentNumber,
    userId: auth.currentUser.uid,
    status: "Pending",
    submittedAt: new Date()
  })
  .then(() => {
    console.log("Application added to Firestore");
    alert(`Application submitted successfully! Your acknowledgment number is: ${acknowledgmentNumber}`);
    document.getElementById("message").innerText = `Application submitted successfully! Acknowledgment Number: ${acknowledgmentNumber}`;
    document.getElementById("applicationForm").reset();
    loadHistory(); // Refresh history after submission
    console.log("📄 Application added to Firestore with acknowledgment:", acknowledgmentNumber);
  })
  .catch(error => {
    console.error("Error submitting application:", error);
    document.getElementById("message").innerText = "Error submitting application!";
  });
});

// Load user's OD history
function loadHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "Loading...";

  db.collection("od_applications")
    .where("userId", "==", auth.currentUser.uid)
    .get()
    .then(snapshot => {
      const apps = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        apps.push({ data, submittedAt: data.submittedAt ? data.submittedAt.toDate() : new Date(0) });
      });
      // Sort descending
      apps.sort((a, b) => b.submittedAt - a.submittedAt);
      historyList.innerHTML = "";
      if (apps.length === 0) {
        historyList.innerText = "No OD applications found.";
      } else {
        apps.forEach(app => {
          const data = app.data;
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>Acknowledgment:</strong> ${data.acknowledgmentNumber}<br>
            <strong>Reason:</strong> ${data.reason}<br>
            <strong>From:</strong> ${data.fromDate}<br>
            <strong>To:</strong> ${data.toDate}<br>
            <strong>Status:</strong> ${data.status}<br>
            <hr />
          `;
          historyList.appendChild(li);
        });
      }
    })
    .catch(error => {
      console.error("Error loading history:", error);
      historyList.innerText = "Error loading history.";
    });
}

// Load history on page load
auth.onAuthStateChanged(user => {
  if (user) {
    loadHistory();
  }
});

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
  document.getElementById(tab + '-tab').classList.add('active');
  event.target.classList.add('active');
}
