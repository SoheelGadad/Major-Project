const express = require("express");
const router = express.Router();
const AdminUser = require("../models/AdminUser"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, userType } = req.body;
    
    // 1. Check if user already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Generate a unique ID for the employee/admin
    const generatedUserId = "EMP-" + Date.now(); 

    // 4. Create the new user with 'pending' status
    const newUser = new AdminUser({ 
        userId: generatedUserId,
        username: username, 
        password: hashedPassword, 
        email: email, 
        role: userType,
        status: 'pending' 
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      message: "Registration successful. Please wait for an Admin to approve your account." 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed due to server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find the user
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 2. Block login if the account is pending or rejected
    if (user.status === 'pending') {
      return res.status(403).json({ error: "Your account is pending admin approval." });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ error: "Your account request was declined." });
    }

    // 3. Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // 4. Generate Token
    const token = jwt.sign(
      { userId: user.userId, userType: user.role, userEmail: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "8h" }
    );

    res.cookie("Authtoken", token);
    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      userType: user.role 
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed due to server error" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("Authtoken");
  res.status(200).send("Logout successful");
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// // ✨ FIX 1: Import the AdminUser model, since that's where the Admin creates accounts!
// const AdminUser = require("../models/AdminUser"); 
// const User = require("../models/User"); // Keeping this just in case your register route needs it

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // User registration (Leaving this as is per your logic)
// router.post("/register", async (req, res) => {
//   try {
//     const userDetails = req.body;
//     const username = userDetails.userName;
//     const password = userDetails.password;
//     const email = userDetails.email;
//     const userType = userDetails.userType;
    
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword, email, userType });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.log("err", error);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // User login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     console.log("Login attempt for:", email);
    
//     // ✨ FIX 2: Search the AdminUser database where the new employee was saved
//     const user = await AdminUser.findOne({ email });
    
//     if (!user) {
//       return res
//         .status(401)
//         .json({ error: "Authentication failed- User doesn't exists" });
//     }

//     // Check password
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res
//         .status(401)
//         .json({ error: "Authentication failed- password doesn't match" });
//     }
    
//     // ✨ FIX 3: Make sure we map 'user.role' from AdminUser into the token
//     const token = jwt.sign(
//       { userId: user._id, userType: user.role, userEmail: user.email },
//       "your-secret-key",
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.cookie("Authtoken", token);
//     res.json({
//       status: true,
//       message: "login success",
//       token,
//       userType: user.role // Send back the 'role' as 'userType' for your frontend
//     });
    
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// // Logout
// router.get("/logout", (req, res) => {
//   res.clearCookie("Authtoken");
//   res.status(200).send("Logout successful");
// });


// // router.get('/api/users/me', authenticateUser, async (req, res) => {
// //     try {
// //         const user = await User.findById(req.user._id); // Assuming user ID is in req.user
// //         res.json(user);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // });

// // // routes/auth.js
// // router.get("/me", verifyToken, (req, res) => {
// //   res.json(req.user);
// // });

// module.exports = router;

