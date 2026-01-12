const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/v1", require("./src/router"));

app.get("/", (req, res) => {
    res.send("Welcome to Backend!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Internal Server Error Occurred",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

module.exports = app;
