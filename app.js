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
app.get("/register", (req, res) => {
  res.render("register", { user: req.session.user });
});

// 🔐 Signup Form Submit
app.post("/signup", async (req, res) => {
  const { username, email, contact, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (user_name, email, contact, password) VALUES (?, ?, ?, ?)',
    [username, email, contact, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
    }
  );
  console.log(username, email, contact, hashedPassword);
  const user = { user_name: username, email, contact };
    req.session.user = user;
  res.redirect("/");
});

// 🔑 Login Page
// app.get("/login", (req, res) => {
//   res.render("register");
// });

// 🔓 Login Form Submit
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_name = ?', [username]);

    if (rows.length === 0) {
      return res.send("❌ User not found");
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("❌ Invalid password");
    }

    req.session.user = { username: user.user_name };

    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("⚠️ Server error");
  }
});


// 👤 Profile Page (Only if logged in)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

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
// Insert Event
app.post('/events', async (req, res) => {
  const { title, image, description, price, duration } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO events_summary (title, image, description, price, duration) VALUES (?, ?, ?, ?, ?)',
      [title, image, description, price, duration]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Events
app.get('/events', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM events_summary');
    res.render('events', { events: results });
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});

// Event Details Page
app.get('/events/:title', async (req, res) => {
  const eventTitle = req.params.title;
  const decodedTitle = decodeURIComponent(eventTitle);

  try {
    const [results] = await db.query(
      'SELECT * FROM events WHERE title = ?',
      [decodedTitle]
    );

    if (results.length === 0) {
      return res.status(404).send('Event not found');
    }

    res.render('eventDetails', { event: results[0] });
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});


// 🚪 Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.send("❌ Error logging out");
    }
    // res.send("✅ Logged out successfully");
    res.redirect("/");
  });
});

// 🟢 Server Start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;
