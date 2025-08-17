const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require('./database/eventDb');
const crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");

// 🔹 User-defined UUID v4 function
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
  );
}

// Test
// console.log(generateUUID());

const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;


// 🔧 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, // localhost pe false
    sameSite: "lax"
  }
}));

function requireLogin(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.user_id) {
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({ error: "Please login to book" });
    }
    return res.redirect("/register"); 
  }
  next();
}

// 🛣️ View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; 
  next();
});

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

  const user_id = generateUUID();

  db.query(
    'INSERT INTO users (user_id, user_name, email, contact, password) VALUES (?, ?, ?, ?, ?)',
    [user_id, username, email, contact, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
    }
  );
  console.log(user_id, username, email, contact, hashedPassword);
  const user = { user_id, username, email, contact };
  req.session.user = user;
  res.redirect("/");
});

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

    req.session.user = { 
      user_id: user.user_id,
      username: user.user_name 
    };

    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("⚠️ Server error");
  }
});

// Profile Page
app.get("/profile", async (req, res) => {
  console.log("Profile User:", req.session.user);
  if (!req.session.user) {
    return res.redirect("/register");
  }

  const user_id = req.session.user.user_id;

  try {
    // Booking ke saath event details bhi
    const [bookings] = await db.query(
      `SELECT b.booking_id, b.participants_count, 
              e.title, e.tagline, e.image, e.duration, e.difficulty, 
              e.age_group, e.altitude, e.price, e.description, e.event_date
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       WHERE b.user_id = ?`,
      [user_id]
    );

    // Har booking ke participants bhi nikal lo
    for (let booking of bookings) {
      const [participants] = await db.query(
        "SELECT first_name, last_name, gender, birthdate, phone FROM booking_participants WHERE booking_id = ?",
        [booking.booking_id]
      );
      booking.participants = participants;
    }

    res.render("profile", { user: req.session.user, bookings });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).send("Database error: " + err.message);
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
    console.log(results[0]);
    res.render('eventDetails', { event: results[0] });
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});

// Events Bookings
app.post("/book-event", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Please login to book an event.");
  }

   const { event_id, firstName, lastName, phone, birthdate, gender } = req.body;


  const participants = [];
  if (firstName && Array.isArray(firstName)) {
    for (let i = 0; i < firstName.length; i++) {
      participants.push({
        first_name: firstName[i],
        last_name: lastName[i],
        phone: phone[i],
        birthdate: birthdate[i],
        gender: gender[i],
      });
    }
  }
   if (!participants || participants.length === 0) {
    return res.status(400).send("At least one participant is required.");
  }

  const participants_count = participants.length;
  const user_id = req.session.user.user_id;

  console.log("✅ User Booking Details:");
  console.log("User ID:", user_id);
  console.log("Event ID:", event_id);
  console.log("Participants Count:", participants_count);

  // Saare participants print karo
  participants.forEach((p, i) => {
    console.log(`👤 Participant ${i + 1}:`);
    console.log("  First Name:", p.first_name);
    console.log("  Last Name:", p.last_name);
    console.log("  Phone:", p.phone);
    console.log("  Birthdate:", p.birthdate);
    console.log("  Gender:", p.gender);
  });

  try {
    // STEP 1: Bookings table me insert
    const [result] = await db.query(
      "INSERT INTO bookings (user_id, event_id, participants_count) VALUES (?, ?, ?)",
      [user_id, event_id, participants_count]
    );

    const booking_id = result.insertId; // yeh naya booking id milega

    // STEP 2: Participants table me insert
    if (participants && Array.isArray(participants)) {
      for (const p of participants) {
        await db.query(
          `INSERT INTO booking_participants 
          (booking_id, first_name, last_name, phone, birthdate, gender) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            booking_id,
            p.first_name,
            p.last_name,
            p.phone,
            p.birthdate, 
            p.gender,    
          ]
        );
      }
    }
    
    res.redirect("/profile");
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).send("Database error: " + err.message);
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
