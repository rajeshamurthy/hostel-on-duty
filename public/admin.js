const list = document.getElementById("adminApplicationList");

console.log("admin.js loaded");

// order by submittedAt descending to show latest first
db.collection("od_applications").get()
  .then(snapshot => {
    console.log("Admin snapshot received", snapshot.size);
    const apps = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      apps.push({ data, submittedAt: data.submittedAt ? data.submittedAt.toDate() : new Date(0) });
    });
    // Sort descending
    apps.sort((a, b) => b.submittedAt - a.submittedAt);
    apps.forEach(app => {
      const data = app.data;
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Name:</strong> ${data.name}<br>
        <strong>Reg. No.:</strong> ${data.regNo}<br>
        <strong>Parent:</strong> ${data.parentName}<br>
        <strong>Reason:</strong> ${data.reason}<br>
        <strong>From:</strong> ${data.fromDate}<br>
        <strong>To:</strong> ${data.toDate}<br>
        <strong>Acknowledgment Number:</strong> ${data.acknowledgmentNumber}<br>
        <strong>Status:</strong> ${data.status}
        <hr />
      `;
      list.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Error loading applications:", error);
  });
