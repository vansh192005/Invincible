const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();

const port = 3000;

// Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: true
}));

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
