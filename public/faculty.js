let allApplications = [];

function renderApplications(apps) {
  const listDiv = document.getElementById("applicationList");

  if (!listDiv) return;

  if (!apps.length) {
    listDiv.innerHTML = `<div class="no-applications"><p>No applications found</p></div>`;
    return;
  }

  listDiv.innerHTML = apps
    .map(app => {
      const data = app.data;
      const status = (data.status || "Pending").toLowerCase();
      const department = data.department || "-";
      const semester = data.semester || "-";
      const reason = data.reason || "-";
      const fromDate = data.fromDate || "-";
      const toDate = data.toDate || "-";

      return `
        <div class="app-card">
          <div class="app-header">
            <h3>${data.name || "Unknown"}</h3>
            <span class="status-badge ${status}">${status.toUpperCase()}</span>
          </div>
          <div class="app-details">
            <p><strong>Roll No:</strong> ${data.regNo || "-"}</p>
            <p><strong>Department:</strong> ${department} | <strong>Semester:</strong> ${semester}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Duration:</strong> ${fromDate} to ${toDate}</p>
          </div>
          <div class="action-buttons">
            <button class="approve-btn" onclick="updateStatus('${app.id}', 'Approved')">✓ Approve</button>
            <button class="reject-btn" onclick="updateStatus('${app.id}', 'Rejected')">✕ Reject</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateFacultyStats(apps) {
  const pending = apps.filter(a => a.data.status === "Pending").length;
  const approved = apps.filter(a => a.data.status === "Approved").length;
  const rejected = apps.filter(a => a.data.status === "Rejected").length;

  const pendingEl = document.getElementById("pendingCount");
  const approvedEl = document.getElementById("approvedCount");
  const rejectedEl = document.getElementById("rejectedCount");
  const totalEl = document.getElementById("totalCount");

  if (pendingEl) pendingEl.textContent = pending;
  if (approvedEl) approvedEl.textContent = approved;
  if (rejectedEl) rejectedEl.textContent = rejected;
  if (totalEl) totalEl.textContent = apps.length;
}

function filterApplications() {
  const statusFilter = document.getElementById("statusFilter")?.value || "";
  const deptFilter = document.getElementById("deptFilter")?.value || "";
  const semFilter = document.getElementById("semFilter")?.value || "";

  let filtered = [...allApplications];

  if (statusFilter) {
    const targetStatus = statusFilter.toLowerCase();
    filtered = filtered.filter(a => (a.data.status || "").toLowerCase() === targetStatus);
  }

  if (deptFilter) {
    filtered = filtered.filter(a => {
      const dept = (a.data.department || "").toString().trim();
      return dept === deptFilter || dept.toLowerCase() === deptFilter.toLowerCase();
    });
  }

  if (semFilter) {
    filtered = filtered.filter(a => {
      const year = (a.data.year || "").toString().trim();
      const sem = (a.data.semester || "").toString().trim();
      return year === semFilter || sem === semFilter || sem === semFilter + " Year";
    });
  }

  renderApplications(filtered);
}

function updateStatus(id, status) {
  const updateData = { status };
  if (auth && auth.currentUser) {
    updateData.approvedBy = auth.currentUser.email || "Faculty";
  }
  db.collection("od_applications").doc(id).update(updateData)
    .then(() => {
      alert(`Status updated to ${status}`);
      location.reload();
    });
}

console.log("faculty.js loaded");

db.collection("od_applications")
  .onSnapshot(snapshot => {
    console.log("Snapshot received", snapshot.size);
    allApplications = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      allApplications.push({
        id: doc.id,
        data,
        submittedAt: data.submittedAt ? data.submittedAt.toDate() : new Date(0)
      });
    });

    // Sort by latest submitted first
    allApplications.sort((a, b) => b.submittedAt - a.submittedAt);

    updateFacultyStats(allApplications);
    filterApplications();
  });
