// signup.js - Handle user signup with institutional email

function showMessage(message, isError = false) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.classList.remove("error", "success");
  messageDiv.classList.add(isError ? "error" : "success");
}

function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const year = document.getElementById("year").value;
  const department = document.getElementById("department").value;
  const section = document.getElementById("section").value.trim();
  const parentRelation = document.getElementById("parentRelation").value;
  const parentName = document.getElementById("parentName").value.trim();
  const parentPhone = document.getElementById("parentPhone").value.trim();

  // Validation
  if (!name || !username || !email || !phone || !password || !year || !department || !section || !parentRelation || !parentName || !parentPhone) {
    showMessage("Please fill in all fields.", true);
    return;
  }

  // Validate phone number (10-20 digits)
  const phoneRegex = /^[0-9]{10,20}$/;
  if (!phoneRegex.test(phone.replace(/[^\d]/g, ""))) {
    showMessage("Please enter a valid phone number (10-20 digits).", true);
    return;
  }

  // Validate parent phone number
  if (!phoneRegex.test(parentPhone.replace(/[^\d]/g, ""))) {
    showMessage("Please enter a valid parent phone number (10-20 digits).", true);
    return;
  }

  // Validate username format (should not already contain @sece.ac.in)
  if (username.includes("@")) {
    showMessage("Username should not contain '@'. The @sece.ac.in will be added automatically.", true);
    return;
  }

  // Validate username (alphanumeric, dots, and underscores only)
  const usernameRegex = /^[a-zA-Z0-9._]+$/;
  if (!usernameRegex.test(username)) {
    showMessage("Username can only contain letters, numbers, dots, and underscores.", true);
    return;
  }

  // Create institutional email
  const institutionalEmail = username + "@sece.ac.in";

  // Validate password length
  if (password.length < 6) {
    showMessage("Password must be at least 6 characters long.", true);
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address.", true);
    return;
  }

  console.log("📝 Starting signup process...");

  // Create user account with institutional email
  auth.createUserWithEmailAndPassword(institutionalEmail, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("✅ User created:", user.email);

      // Store user profile in Firestore
      db.collection("users").doc(user.uid).set({
        name: name,
        username: username,
        institutionalEmail: institutionalEmail,
        personalEmail: email,
        phone: phone,
        year: year,
        department: department,
        section: section,
        parentRelation: parentRelation,
        parentName: parentName,
        parentPhone: parentPhone,
        createdAt: new Date(),
        status: "active"
      })
      .then(() => {
        console.log("📚 User profile saved to Firestore");
        showMessage("Account created successfully! Redirecting to login...", false);
        
        // Sign out the user so they can login with their credentials
        auth.signOut()
          .then(() => {
            // Redirect to login page after 2 seconds
            setTimeout(() => {
              window.location.href = "login.html";
            }, 2000);
          })
          .catch(error => {
            console.error("Error signing out:", error);
            window.location.href = "login.html";
          });
      })
      .catch(error => {
        console.error("🚨 Error saving user profile:", error);
        showMessage("Error saving user information. Please try again.", true);
      });
    })
    .catch(error => {
      console.error("🚨 Signup error:", error.message);
      let errorMessage = "Signup failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This username is already registered. Please use a different username or login.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }
      
      showMessage(errorMessage, true);
    });
}

// Check if user is already logged in
window.addEventListener("load", function() {
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in, redirect to index.html
      console.log("✅ User already logged in, redirecting...");
      window.location.href = "index.html";
    }
  });
});
