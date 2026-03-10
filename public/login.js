// login.js - Authentication handling for login page

function showMessage(message, isError = false) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.classList.remove("error", "success");
  messageDiv.classList.add(isError ? "error" : "success");
}

function clearMessages() {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = "";
  messageDiv.classList.remove("error", "success");
}

function handleLogin(event) {
  event.preventDefault();
  clearMessages();
 
  const rawInput = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const roleInput = document.querySelector("input[name='role']:checked");
  const role = roleInput ? roleInput.value : "student";

  // Allow login with username (without @) or full email
  let email = rawInput;
  if (!email || !password) {
    showMessage("Please enter both email/username and password.", true);
    return;
  }
  if (rawInput && !rawInput.includes("@")) {
    email = rawInput + "@sece.ac.in";
  }

  console.log("🔐 Attempting login with:", email);

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log("✅ User authenticated:", userCredential.user.email);
      const uid = userCredential.user.uid;

      // Verify profile and role
      return db.collection("users").doc(uid).get().then(doc => {
        if (!doc.exists) {
            auth.signOut();
            throw new Error("Profile not found. Please sign up first.");
        }
        
        const userData = doc.data();
        const dbRole = (userData.role || "student").toLowerCase();
        const selectedRole = role.toLowerCase();
        
        // Admin user can't login as faculty, etc. Validate matching roles.
        // Exception: sometimes "student" role is omitted in old accounts, so allow it as fallback
        if (dbRole !== selectedRole && !(selectedRole === "student" && dbRole === "")) {
            auth.signOut();
            throw new Error(`Role mismatch. You cannot log in as ${selectedRole}.`);
        }
        
        showMessage("Login successful! Redirecting...", false);

        // Persist selected role for later redirects
        try {
          localStorage.setItem("userRole", role);
        } catch (e) {
          console.warn("Unable to persist userRole in localStorage", e);
        }
        
        // Redirect based on role after 1.5 seconds
        setTimeout(() => {
          if (role === "faculty") {
            window.location.href = "faculty.html";
          } else if (role === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "index.html";
          }
        }, 1500);
      });
    })
    .catch(error => {
      console.error("🚨 Login error:", error.code, error.message);
      let errorMessage = `Login failed: ${error.code} - ${error.message}`;
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please check your username/email or sign up.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid credentials. Please check your username and password.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/Password sign-in is not enabled. Please enable it in Firebase Console.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === "auth/invalid-login-credentials") {
        errorMessage = "Invalid login credentials. Please check your username and password.";
      }
      
      showMessage(errorMessage, true);
    });
}
