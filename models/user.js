const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'customer', 'cashier', 'barista', 'deliveryStaff'],
        default: 'customer'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);