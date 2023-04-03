const express = require("express")
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const logger = require('morgan')
const { adminAuth, userAuth } = require("./middleware/auth.js");


const app = express()
const PORT = process.env.PORT || 5000;

app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser());//for parsing token sent to the cookie

app.use("/api/auth", require("./Auth/route"))
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

//Connecting the Database 
connectDB();

// Handling Error
const server = app.listen(PORT, () =>
  console.log(`Server listening in port ${PORT}`)
)
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
  })

