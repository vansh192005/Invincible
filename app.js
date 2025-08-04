const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require('./database/eventDb');


const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;


// 🔧 Middlewares
app.use(express.json());
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

// Add Event
app.post('/events', (req, res) => {
  const { title, image, description, price, duration } = req.body;
  db.query(
    'INSERT INTO events_summary (title, image, description, price, duration) VALUES (?, ?, ?, ?, ?)',
    [title, image, description, price, duration],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Get All Events
app.get('/events', (req, res) => {
  db.query('SELECT * FROM events_summary', (err, results) => {
    if (err) {
      return res.status(500).send('Database error: ' + err.message);
    }
    // Render events.ejs ko, aur usko events data pass kar do
    res.render('events', { events: results });
  });
});


// Event Details Page
app.get('/events/:title', (req, res) => {
    const eventTitle = req.params.title;
    // Jo encodeURIComponent se aya vo decode karo (optional)
    const decodedTitle = decodeURIComponent(eventTitle);

    db.query('SELECT * FROM events WHERE title = ?', [decodedTitle], (err, results) => {
        if (err) return res.status(500).send('Database error: ' + err.message);
        if (results.length === 0) return res.status(404).send('Event not found');

        res.render('eventDetails', { event: results[0] });
    });
});



// 🚪 Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// 🟢 Server Start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;
