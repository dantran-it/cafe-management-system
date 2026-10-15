require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes/index");

const app = express();
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
    res.json({
        name: "Cafe Management System API",
        message: "CMS backend is running successfully"
    });
});

app.use("/api", routes);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
