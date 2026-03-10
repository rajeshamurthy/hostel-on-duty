const adminList = document.getElementById("adminApplicationList");

console.log("admin.js loaded");

// Redirect to login if not authenticated or not admin
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    // Verify admin role
    db.collection("users").doc(user.uid).get().then(doc => {
      if (!doc.exists || (doc.data().role || "").toLowerCase() !== "admin") {
        console.warn("Access denied. Admin role required.");
        auth.signOut().then(() => {
          window.location.href = "login.html";
        });
      }
    }).catch(err => {
      console.error("Auth check error:", err);
      window.location.href = "login.html";
    });
  }
});

let adminApplications = [];

function renderAdminApplications(apps) {
  if (!adminList) return;

  document.getElementById("appCount").textContent = `(${apps.length})`;

  if (!apps.length) {
    adminList.innerHTML = `<div style="text-align: center; padding: 40px; color: #888899;">
      <p>No applications found</p>
    </div>`;
    return;
  }

  adminList.innerHTML = apps
    .map(app => {
      const data = app.data;
      const status = (data.status || "Pending").toLowerCase();
      const department = data.department || "-";
      const semester = data.semester || "-";
      const reason = data.reason || "-";
      const fromDate = data.fromDate || "-";
      const toDate = data.toDate || "-";
      const approvedBy = data.approvedBy || "-";
      const dateSubmitted = data.dateSubmitted || (data.submittedAt ? data.submittedAt.toDate().toLocaleDateString() : "-");

      const statusColor = status === "approved" ? "#44ff44" : status === "rejected" ? "#ff6666" : "#ffaa00";

      return `
        <div class="admin-app-card">
          <div class="admin-app-header">
            <h4>${data.name || "Unknown"} (${data.regNo || "-"})</h4>
            <span class="status-badge ${status}">${status.toUpperCase()}</span>
          </div>
          <div class="admin-app-info">
            <div class="info-block">
              <label>Dept / Semester</label>
              <value>${department} | ${semester}</value>
            </div>
            <div class="info-block">
              <label>Duration</label>
              <value>${fromDate} to ${toDate}</value>
            </div>
            <div class="info-block">
              <label>Reason</label>
              <value>${reason}</value>
            </div>
            <div class="info-block">
              <label>Approved By</label>
              <value>${approvedBy}</value>
            </div>
            <div class="info-block">
              <label>Submitted</label>
              <value>${dateSubmitted}</value>
            </div>
            <div class="info-block">
              <label>Status</label>
              <value style="color: ${statusColor}">${status}</value>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateAdminStats(apps, studentCount, facultyCount) {
  const totalStudentsEl = document.getElementById("totalStudents");
  const totalApplicationsEl = document.getElementById("totalApplications");
  const totalFacultyEl = document.getElementById("totalFaculty");
  const approvalRateEl = document.getElementById("approvalRate");

  const totalApps = apps.length;
  const approved = apps.filter(a => (a.data.status || "").toLowerCase() === "approved").length;

  if (totalStudentsEl) totalStudentsEl.textContent = studentCount !== undefined ? studentCount : "-";
  if (totalApplicationsEl) totalApplicationsEl.textContent = totalApps;
  if (totalFacultyEl) totalFacultyEl.textContent = facultyCount !== undefined ? facultyCount : "-";

  const rate = totalApps > 0 ? Math.round((approved / totalApps) * 100) : 0;
  if (approvalRateEl) approvalRateEl.textContent = `${rate}%`;
}

function adminLogout() {
  if (confirm("Are you sure you want to logout?")) {
    auth.signOut()
      .then(() => {
        try { localStorage.removeItem("userRole"); } catch (e) {}
        window.location.href = "login.html";
      })
      .catch(err => { console.error(err); alert("Logout failed."); });
  }
}

function exportReport() { alert("Export report feature - integrate with your reporting system."); }
function generateStats() { location.reload(); }
function sendNotification() { alert("Send notification - integrate with FCM or email service."); }
function backupDatabase() { alert("Backup database - use Firebase export or Cloud Functions."); }

let studentUserCount = 0;
let facultyUserCount = 0;

// Listen to realtime updates for user counts
db.collection("users").onSnapshot(snap => {
  let sCount = 0;
  let fCount = 0;
  snap.forEach(doc => {
    const d = doc.data();
    const role = d.role ? d.role.toLowerCase().trim() : "";
    if (role === "faculty") {
      fCount++;
    } else if (role === "student" || role === "") {
      sCount++;
    }
  });
  studentUserCount = sCount;
  facultyUserCount = fCount;
  updateAdminStats(adminApplications, studentUserCount, facultyUserCount);
}, error => {
  console.error("Error fetching users:", error);
});

// Live updates ordered by submittedAt (latest first)
db.collection("od_applications")
  .onSnapshot(snapshot => {
    console.log("Admin snapshot received", snapshot.size);
    adminApplications = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      adminApplications.push({
        id: doc.id,
        data,
        submittedAt: data.submittedAt ? data.submittedAt.toDate() : new Date(0)
      });
    });

    adminApplications.sort((a, b) => b.submittedAt - a.submittedAt);
    updateAdminStats(adminApplications, studentUserCount, facultyUserCount);
    renderAdminApplications(adminApplications);
  }, error => {
    console.error("Error loading applications:", error);
  });
