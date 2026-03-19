// models/Assignment.js

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
{
    userId: {
        type: String,
        required: true
    },

    assetId: {
        type: String,
        required: true
    },

    assignmentDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Assigned", "Returned"],
        default: "Assigned"
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Assignment", assignmentSchema);