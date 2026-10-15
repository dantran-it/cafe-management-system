const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const createToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const register = async (req, res) => {
    const { username, password, role, fullName, email, phone } = req.body || {};

    if (
        typeof username !== "string" ||
        !username.trim() ||
        typeof password !== "string" ||
        password.length < 6 ||
        typeof fullName !== "string" ||
        !fullName.trim() ||
        typeof role !== "string" ||
        !role.trim()
    ) {
        return res.status(400).json({
            message: "username, password, fullName and role are required"
        });
    }

    try {
        const existingUser = await User.findOne({ username: username.trim().toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "Username is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username.trim().toLowerCase(),
            password: hashedPassword,
            fullName: fullName.trim(),
            email: email ? email.trim().toLowerCase() : undefined,
            phone: phone ? phone.trim() : undefined,
            role: role.trim().toLowerCase()
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Username is already in use" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        console.error("User registration failed:", error);
        return res.status(500).json({ message: "Unable to register user" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body || {};

    if (
        typeof username !== "string" ||
        !username.trim() ||
        typeof password !== "string" ||
        !password
    ) {
        return res.status(400).json({
            message: "username and password are required"
        });
    }

    try {
        const user = await User.findOne({ username: username.trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = createToken(user);
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        console.error("User login failed:", error);
        return res.status(500).json({ message: "Unable to log in" });
    }
};

module.exports = { register, login };