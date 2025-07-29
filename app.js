const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 3000;

// 🔧 Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "mySecretKey123",
  resave: false,
  saveUninitialized: false
}));

// 🛣️ View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 📁 Static Files (if any)
app.use(express.static("public"));

// 🧑 Temporary user storage
let users = [];

// 🏠 Home Route
app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

// 📝 Signup Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// 🔐 Signup Form Submit
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect("/login");
});

// 🔑 Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

// 🔓 Login Form Submit
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.send("Invalid username or password");
  }
});

// 👤 Profile Page (Only if logged in)
app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.render("profile", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

// 🗺️ About Page
app.get("/about", (req, res) => {
  res.render("about");
});

// 🚪 Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// 🟢 Server Start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
