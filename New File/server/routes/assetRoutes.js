const express = require("express");
const router = express.Router();
const Asset = require("../models/assetModel");

// ✨ FIX: Destructured the middleware import to prevent the [object Object] error
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Anyone logged in (Admin or Employee) can view assets
router.get("/assets", verifyToken, async (req, res) => {
  try {
    const details = await Asset.find({});
    res.json(details);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/assets/:id", verifyToken, async (req, res) => {
  const assetId = req.params.id;
  try {
    const details = await Asset.findOne({ assetId: assetId });
    if (!details) {
      return res.status(404).send("Asset not found");
    }
    res.json(details);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// ✨ SECURED: Only Admins can create new assets
router.post("/assets", verifyAdmin, async (req, res) => {
  try {
    const data = req.body;
    const result = await Asset.create(data);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
});

// ✨ SECURED: Only Admins can update assets
router.put("/assets/:id", verifyAdmin, async (req, res) => {
  const data = req.body;
  const assetId = req.params.id;
  console.log(assetId);
  console.log(data);
  try {
    const result = await Asset.findOneAndUpdate(
      { assetId: assetId },
      data,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).send("Asset not found");
    }
    res.json(result); 
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// ✨ SECURED: Changed verifyToken to verifyAdmin (Only Admins delete)
router.delete("/assets/:id", verifyAdmin, async (req, res) => {
  const assetId = req.params.id;
  try {
    const result = await Asset.findOneAndDelete({ assetId: assetId });
    if (!result) {
      return res.status(404).send("Asset not found");
    }
    res.send("Asset deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;