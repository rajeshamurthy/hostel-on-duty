function renderBooking(id, data) {
  const div = document.createElement("div");
  div.innerHTML = `
    <strong>Name:</strong> ${data.name}<br>
    <strong>Reg. No.:</strong> ${data.regNo}<br>
    <strong>Parent:</strong> ${data.parentName}<br>
    <strong>Reason:</strong> ${data.reason}<br>
    <strong>From:</strong> ${data.fromDate}<br>
    <strong>To:</strong> ${data.toDate}<br>
    <strong>Acknowledgment Number:</strong> ${data.acknowledgmentNumber}<br>
    <strong>Status:</strong> ${data.status}<br>
    <button onclick="updateStatus('${id}', 'Approved')">Approve</button>
    <button onclick="updateStatus('${id}', 'Rejected')">Reject</button>
    <hr />
  `;
  document.getElementById("applicationList").appendChild(div);
}

function updateStatus(id, status) {
  db.collection("od_applications").doc(id).update({ status })
    .then(() => {
      alert(`Status updated to ${status}`);
      location.reload();
    });
}

console.log("faculty.js loaded");

db.collection("od_applications")
  .onSnapshot(snapshot => {
    console.log("Snapshot received", snapshot.size);
    const list = document.getElementById("applicationList");
    list.innerHTML = "";
    const pendingApps = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === "Pending") {
        pendingApps.push({ id: doc.id, data, submittedAt: data.submittedAt ? data.submittedAt.toDate() : new Date(0) });
      }
    });
    // Sort by submittedAt descending
    pendingApps.sort((a, b) => b.submittedAt - a.submittedAt);
    if (pendingApps.length === 0) {
      list.innerText = "No applications available.";
    } else {
      pendingApps.forEach(app => {
        renderBooking(app.id, app.data);
      });
    }
  });
