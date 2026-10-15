const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ["coffee", "tea", "dessert", "snack", "main-course", "beverage"]
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    available: {
        type: Boolean,
        default: true
    },
    prepTime: {
        type: Number,
        default: 10,
        min: 1
    },
    ingredients: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
