const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtOrder: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        default: ""
    }
}, { _id: true });

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ["pending", "confirmed", "preparing", "ready", "on_the_way", "delivered", "cancelled"],
        default: "pending"
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "refunded", "failed"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "wallet", "bank-transfer"],
        default: "cash"
    },
    deliveryAddress: {
        type: String,
        default: ""
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
