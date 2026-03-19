// routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

// ✨ FIX: Imported middleware
const { verifyAdmin } = require("../middleware/authMiddleware");

// CREATE ASSIGNMENT - Admin only
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { userId, assetId, assignmentDate } = req.body;
    if (!userId || !assetId || !assignmentDate) {
      return res.status(400).json({ message: "userId, assetId and assignmentDate are required" });
    }

    const existingAssignment = await Assignment.findOne({ assetId });
    if (existingAssignment) {
      return res.status(400).json({ message: "This asset is already assigned" });
    }

    const newAssignment = new Assignment({ userId, assetId, assignmentDate });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL ASSIGNMENTS - Admin only
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE ASSIGNMENT - Admin only
router.get("/:id", verifyAdmin, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ASSIGNMENT - Admin only
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { userId, assetId, assignmentDate } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (userId) assignment.userId = userId;
    if (assetId) assignment.assetId = assetId;
    if (assignmentDate) assignment.assignmentDate = assignmentDate;

    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE ASSIGNMENT - Admin only
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;