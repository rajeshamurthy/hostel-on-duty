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
  
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showMessage("Please enter both email and password.", true);
    return;
  }

  console.log("🔐 Attempting login with:", email);

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log("✅ User logged in:", userCredential.user.email);
      showMessage("Login successful! Redirecting...", false);
      
      // Redirect to index.html after 1.5 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    })
    .catch(error => {
      console.error("🚨 Login error:", error.message);
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please check your username/email or sign up.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid credentials. Please check your username and password.";
      }
      
      showMessage(errorMessage, true);
    });
}

// Check if user is already logged in
window.addEventListener("load", function() {
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in, redirect to index.html
      console.log("✅ User already logged in:", user.email);
      window.location.href = "index.html";
    }
  });
});
