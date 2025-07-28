const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// 👥 Temporary user storage (later DB me hoga)
let users = [];

// 🏠 Home Page
router.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

// 📝 Signup Page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// 🔐 Signup form submit
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect("/login");
});

// 🔑 Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// 🔓 Login form submit
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.send("Invalid username or password");
  }
});

// 🚪 Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// 👤 Profile Page
router.get("/profile", (req, res) => {
  if (req.session.user) {
    res.render("profile", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
