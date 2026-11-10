const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

app.use((error, req, res, next) => {
    if (error.name === "ZodError") return res.status(400).json({ success: false, message: "Validation failed", errors: error.issues });
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A record with the same unique value already exists" });
    return res.status(error.status || 500).json({ success: false, message: error.status ? error.message : "Internal server error" });
});

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "IT Helpdesk API is running"
    });
});

module.exports = app;
