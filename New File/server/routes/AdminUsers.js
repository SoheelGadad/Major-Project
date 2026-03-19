const express = require("express");
const router = express.Router();
const Asset = require("../models/AdminUser");

// ✨ FIX: Import verifyAdmin from your updated middleware file
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const User = require("../models/User");
const AdminUser = require("../models/AdminUser");

// ✨ SECURED: Changed verifyToken to verifyAdmin
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const details = await AdminUser.find({});
    res.json(details);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// ✨ SECURED: Added verifyAdmin
router.get("/users/:id", verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const details = await AdminUser.findOne({ userId: userId });
    if (!details) {
      return res.status(404).send("User not found");
    }
    res.json(details);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// ✨ SECURED: Added verifyAdmin
router.put("/users/:id", verifyAdmin, async (req, res) => {
  const data = req.body;
  const userId = req.params.id;
  
  try {
    // ✨ ADD THIS: If a new password was provided, hash it before updating!
    if (data.password) {
      const bcrypt = require("bcrypt");
      data.password = await bcrypt.hash(data.password, 10);
    }

    const result = await AdminUser.findOneAndUpdate(
      { userId: userId },
      data,
      { new: true, runValidators: true }
    );
    
    if (!result) {
      return res.status(404).send("user not found");
    }
    res.json(result); 
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// ✨ SECURED: Added verifyAdmin (Note: This is your duplicate route, kept exactly as requested)
router.put("/users/:id", verifyAdmin, async (req, res) => {
  const data = req.body;
  const userId = req.params.id;
  console.log(userId);
  console.log(data);
  try {
    const result = await AdminUser.findOneAndUpdate(
      { userId: userId },
      data,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).send("user not found");
    }
    res.json(result); // Return the updated asset
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// ✨ SECURED: Changed verifyToken to verifyAdmin
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await AdminUser.findOneAndDelete({ userId: userId });
    if (!result) {
      return res.status(404).send("Asset not found");
    }
    res.send("user deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// // 🚨 TEMPORARY ROUTE: Remove this after you successfully log in!
// router.get("/create-master-admin", async (req, res) => {
//   try {
//     // 1. Hash a default password
//     const hashedPassword = await bcrypt.hash("admin123", 10);
    
//     // 2. Create the master admin object
//     const masterAdmin = new AdminUser({
//       userId: "ADMIN-001",
//       username: "System Admin",
//       email: "admin@gmail.com", 
//       password: hashedPassword,
//       role: "admin",
//       status: "approved" // Pre-approved so they can log in immediately
//     });

//     // 3. Save to the database
//     await masterAdmin.save();
//     res.send("Master admin created! You can now log in with Email: admin@wipro.com | Password: admin123");
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error creating admin: " + error.message);
//   }
// });

module.exports = router;

// router.post('/assets/maintenance', async (req, res) => {
//     const { assetId, assetName, location, warranty, status } = req.body;
//     try {
//         const newAsset = new Asset({
//             assetId,
//             assetName,
//             location,
//             warranty,
//             status: status || 'Repair', // Default status to 'Repair'
//         });
//         await newAsset.save();
//         res.status(201).send('Asset added for maintenance successfully');
//     } catch (error) {
//         res.status(500).send('Server error');
//     }
// });