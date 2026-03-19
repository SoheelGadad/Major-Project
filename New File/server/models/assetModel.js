const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    assetId: { type: String, unique: true, required: true },
    assetName: { type: String, required: true },
    assetType: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
    purchaseDate: { type: Date, required: true },
    warranty: { type: String, required: true },
    location: { type: String, required: true },
    // ✨ NEW: Added field to store the Employee ID
    assignedUser: { type: String, default: 'Unassigned' }, 
}, {
    timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;