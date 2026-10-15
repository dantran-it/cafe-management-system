const mongoose = require("mongoose");
const User = require("../models/user");
const Grade = require("../models/grade");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleGradeError = (res, error, action) => {
    if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({ message: error.message });
    }

    console.error(`Unable to ${action}:`, error);
    return res.status(500).json({ message: `Unable to ${action}` });
};

const findStudent = async (studentId) => {
    if (typeof studentId !== "string" || !isValidObjectId(studentId)) {
        return null;
    }

    return User.findOne({ _id: studentId, role: "student" });
};

const createGrade = async (req, res) => {
    const { studentId, score, subject } = req.body || {};

    if (
        typeof studentId !== "string" ||
        !isValidObjectId(studentId) ||
        typeof score !== "number" ||
        !Number.isFinite(score) ||
        typeof subject !== "string" ||
        !subject.trim()
    ) {
        return res.status(400).json({
            message: "A valid studentId, numeric score and subject are required"
        });
    }

    try {
        const student = await findStudent(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const grade = await Grade.create({
            studentId,
            score,
            subject: subject.trim()
        });

        await grade.populate({ path: "studentId", select: "username role" });
        return res.status(201).json(grade);
    } catch (error) {
        return handleGradeError(res, error, "create grade");
    }
};

const getAllGrades = async (req, res) => {
    try {
        const query = req.user.role === "student"
            ? { studentId: req.user.userId }
            : {};
        const grades = await Grade.find(query)
            .populate({ path: "studentId", select: "username role" })
            .sort({ _id: -1 });

        return res.status(200).json(grades);
    } catch (error) {
        return handleGradeError(res, error, "get grades");
    }
};

const getGradeById = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid grade id" });
    }

    try {
        const query = req.user.role === "student"
            ? { _id: id, studentId: req.user.userId }
            : { _id: id };
        const grade = await Grade.findOne(query)
            .populate({ path: "studentId", select: "username role" });

        if (!grade) {
            return res.status(404).json({ message: "Grade not found" });
        }

        return res.status(200).json(grade);
    } catch (error) {
        return handleGradeError(res, error, "get grade");
    }
};

const updateGrade = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid grade id" });
    }

    const body = req.body || {};
    const { studentId, score, subject } = body;
    const updates = {};

    if (Object.prototype.hasOwnProperty.call(body, "studentId")) {
        if (typeof studentId !== "string" || !isValidObjectId(studentId)) {
            return res.status(400).json({ message: "A valid studentId is required" });
        }
        updates.studentId = studentId;
    }

    if (Object.prototype.hasOwnProperty.call(body, "score")) {
        if (typeof score !== "number" || !Number.isFinite(score)) {
            return res.status(400).json({ message: "score must be a number" });
        }
        updates.score = score;
    }

    if (Object.prototype.hasOwnProperty.call(body, "subject")) {
        if (typeof subject !== "string" || !subject.trim()) {
            return res.status(400).json({ message: "subject must be a non-empty string" });
        }
        updates.subject = subject.trim();
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            message: "Provide at least one of studentId, score or subject"
        });
    }

    try {
        if (updates.studentId) {
            const student = await findStudent(updates.studentId);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
        }

        const grade = await Grade.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        }).populate({ path: "studentId", select: "username role" });

        if (!grade) {
            return res.status(404).json({ message: "Grade not found" });
        }

        return res.status(200).json(grade);
    } catch (error) {
        return handleGradeError(res, error, "update grade");
    }
};

const deleteGrade = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid grade id" });
    }

    try {
        const grade = await Grade.findByIdAndDelete(id);
        if (!grade) {
            return res.status(404).json({ message: "Grade not found" });
        }

        return res.status(200).json({ message: "Grade deleted successfully" });
    } catch (error) {
        return handleGradeError(res, error, "delete grade");
    }
};

module.exports = {
    createGrade,
    getAllGrades,
    getGradeById,
    updateGrade,
    deleteGrade
};
