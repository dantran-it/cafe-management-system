const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    subject: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Grade', gradeSchema);