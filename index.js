// const ServerlessHttp = require("serverless-http");
// const express = require("express");
// const dotenv = require("dotenv");
// dotenv.config(); // Load environment variables
// const cors = require("cors");
// const morgan = require("morgan");

// const app = express();
// const port = process.env.PORT || 3000;

// // morgan middleware
// app.use(morgan("dev"));

// // Middleware
// app.use(cors());

// app.use("/api/v1", require("./src/router"));

// // Routes
// app.get("/", (req, res) => {
//   res.send("Welcome to Backend!");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ message: "Internal Server Error Occured", err });
// });

// // Comment out the local server listener for serverless deployment
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports.handler = ServerlessHttp(app);


const ServerlessHttp = require("serverless-http");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const pool = require("./src/config/dbConfig");
const port = process.env.PORT || 3000;


if (process.env.IS_OFFLINE === 'true') {
    app.listen(port, () => {
        console.log(`Server is running locally on port ${port}`);
    });
}

pool.getConnection((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

module.exports.handler = ServerlessHttp(app, {
    binary: ['application/octet-stream'],
});
