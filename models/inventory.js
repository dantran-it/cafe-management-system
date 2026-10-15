const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        default: "pcs"
    },
    reorderLevel: {
        type: Number,
        default: 10,
        min: 0
    },
    supplier: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Inventory", inventorySchema);
