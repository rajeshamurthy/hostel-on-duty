# How to Create an Admin Account

## Option 1: Use the Create Admin Page (Recommended)

1. Open **create-admin.html** in your browser (e.g. `http://localhost:5000/create-admin.html` or your deployed URL).
2. Fill in:
   - **Full Name** – e.g. "Admin User"
   - **Username** – e.g. "admin" (will become admin@sece.ac.in)
   - **Password** – at least 6 characters
3. Click **Create Admin Account**.
4. You will be signed out. Go to **login.html**, enter your credentials (username or admin@sece.ac.in + password), select **Admin** as role, and sign in.

## Option 2: Manual Setup via Firebase Console

1. **Create the user in Firebase Authentication:**
   - Go to [Firebase Console](https://console.firebase.google.com) → Your project → Authentication → Users.
   - Click **Add user**.
   - Email: e.g. `admin@sece.ac.in`
   - Password: set a secure password.

2. **Add admin role in Firestore:**
   - Go to Firestore Database → `users` collection.
   - Create a document with ID = the new user's UID (from Authentication).
   - Add fields: `name`, `role: "admin"`, `institutionalEmail`, etc.

3. Log in at **login.html** with that email and password, and select **Admin** as role.

## Option 3: Convert an Existing User to Admin

1. Go to Firestore → `users` collection.
2. Find the document for the user (by their UID from Authentication).
3. Add or update the field: `role: "admin"`.
4. That user can now log in with role **Admin**.

---

**Note:** The login page uses the selected role (Student/Faculty/Admin) to decide where to redirect. For admin access, you must select **Admin** when logging in.
