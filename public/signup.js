// signup.js - Handle user signup with institutional email

function showMessage(message, isError = false) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.classList.remove("error", "success");
  messageDiv.classList.add(isError ? "error" : "success");
}

function handleSignup(event) {
  event.preventDefault();

  console.log("🔍 Reading form data...");
  const name = document.getElementById("name").value.trim();
  const rollNumber = document.getElementById("rollNumber").value.trim();
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

  console.log("📝 Raw form values:");
  console.log("- name element:", document.getElementById("name"));
  console.log("- name value:", document.getElementById("name").value);
  console.log("- rollNumber element:", document.getElementById("rollNumber"));
  console.log("- rollNumber value:", document.getElementById("rollNumber").value);
  console.log("- year element:", document.getElementById("year"));
  console.log("- year value:", document.getElementById("year").value);

  // Validation
  if (!name || !rollNumber || !username || !email || !phone || !password || !year || !department || !section || !parentRelation || !parentName || !parentPhone) {
    console.log("Validation failed. Missing fields:");
    console.log("- name:", !!name);
    console.log("- rollNumber:", !!rollNumber, rollNumber);
    console.log("- username:", !!username, username);
    console.log("- email:", !!email, email);
    console.log("- phone:", !!phone, phone);
    console.log("- password:", !!password);
    console.log("- year:", !!year, year);
    console.log("- department:", !!department, department);
    console.log("- section:", !!section, section);
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
  console.log("Form data collected:");
  console.log("- Name:", name);
  console.log("- Roll Number:", rollNumber);
  console.log("- Username:", username);
  console.log("- Year:", year);
  console.log("- Department:", department);
  console.log("- Section:", section);

  // Create user account with institutional email
  auth.createUserWithEmailAndPassword(institutionalEmail, password)
    .then(userCredential => {
      const user = userCredential.user;
      console.log("✅ User created:", user.email);

      // Prepare user profile data
      const userProfile = {
        name: name,
        rollNumber: rollNumber,
        regNo: rollNumber,
        username: username,
        institutionalEmail: institutionalEmail,
        personalEmail: email,
        phone: phone,
        year: year,
        semester: (() => {
          const yearMap = { 'I': '1st Year', 'II': '2nd Year', 'III': '3rd Year', 'IV': '4th Year' };
          const calculatedSemester = yearMap[year] || year + ' Year';
          console.log("Calculated semester:", calculatedSemester, "from year:", year);
          return calculatedSemester;
        })(),
        department: department,
        section: section,
        parentRelation: parentRelation,
        parentName: parentName,
        parentPhone: parentPhone,
        createdAt: new Date(),
        status: "active"
      };

      // Validate that critical fields are not empty
      console.log("🔍 Validating userProfile fields:");
      console.log("- name:", userProfile.name, "length:", userProfile.name?.length);
      console.log("- rollNumber:", userProfile.rollNumber, "length:", userProfile.rollNumber?.length);
      console.log("- year:", userProfile.year, "length:", userProfile.year?.length);
      console.log("- semester:", userProfile.semester, "length:", userProfile.semester?.length);

      if (!userProfile.rollNumber || userProfile.rollNumber.trim() === '') {
        console.error("❌ rollNumber is empty or undefined!");
        showMessage("Roll number is required. Please fill in all fields.", true);
        return;
      }

      console.log("📋 User profile data to save:", userProfile);
      console.log("📋 userProfile.rollNumber:", userProfile.rollNumber);
      console.log("📋 userProfile.semester:", userProfile.semester);
      console.log("📋 userProfile.year:", userProfile.year);

      // Store user profile in Firestore
      console.log("🔄 Calling Firestore set operation...");
      
      // First save basic fields
      const basicProfile = {
        name: userProfile.name,
        username: userProfile.username,
        institutionalEmail: userProfile.institutionalEmail,
        personalEmail: userProfile.personalEmail,
        createdAt: userProfile.createdAt,
        status: userProfile.status
      };
      
      return db.collection("users").doc(user.uid).set(basicProfile)
        .then(() => {
          console.log("📚 Basic profile saved, now saving extended fields...");
          
          // Then update with extended fields
          const extendedFields = {
            rollNumber: userProfile.rollNumber,
            regNo: userProfile.regNo,
            phone: userProfile.phone,
            year: userProfile.year,
            semester: userProfile.semester,
            department: userProfile.department,
            section: userProfile.section,
            parentRelation: userProfile.parentRelation,
            parentName: userProfile.parentName,
            parentPhone: userProfile.parentPhone
          };
          
          console.log("📋 Extended fields to save:", extendedFields);
          
          return db.collection("users").doc(user.uid).update(extendedFields)
            .then(() => {
              console.log("📚 Extended fields saved successfully");
            })
            .catch(updateError => {
              console.error("❌ Failed to save extended fields:", updateError);
              console.error("Update error code:", updateError.code);
              console.error("Update error message:", updateError.message);
              // Continue anyway - basic profile is saved
            });
        })
        .then(() => {
          console.log("📚 User profile saved to Firestore successfully");
          
          // Verify the data was saved by reading it back
          return db.collection("users").doc(user.uid).get()
            .then(doc => {
              if (doc.exists) {
                const savedData = doc.data();
                console.log("✅ Verification: Data saved successfully:", savedData);
                console.log("Roll Number saved:", savedData.rollNumber);
                console.log("Semester saved:", savedData.semester);
                console.log("Year saved:", savedData.year);
                
                // Check if critical fields are missing
                if (!savedData.rollNumber) {
                  console.error("❌ CRITICAL: rollNumber not saved!");
                }
                if (!savedData.semester) {
                  console.error("❌ CRITICAL: semester not saved!");
                }
              } else {
                console.error("❌ Verification failed: Document not found after save");
              }
              return user;
            });
        })
    })
    .then(user => {
      console.log("✅ Complete signup successful for user:", user.email);
      showMessage("Account created successfully! Redirecting to login...", false);
      
      // Sign out the user so they can login with their credentials
      return auth.signOut();
    })
    .then(() => {
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    })
    .catch(error => {
      console.error("🚨 Signup error:", error);
      let errorMessage = "Signup failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This username is already registered. Please use a different username or login.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "permission-denied") {
        errorMessage = "Permission denied. Please check Firestore security rules.";
      }
      
      showMessage(errorMessage, true);
    });
}


