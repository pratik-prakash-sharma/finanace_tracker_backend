const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const app = express();
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password, 
    database: process.env.database
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'finance_secret_key', // Secret key for session
    resave: false,
    saveUninitialized: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Register a new user
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).send('User registration failed');
        } else {
            res.send('User registered successfully');
        }
    });
});

// User login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('User not found');
        }
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            req.session.userId = user.id;  // Set the session with userId
            res.send('Login successful');
        } else {
            res.status(401).send('Incorrect password');
        }
    });
});

// Add a transaction
app.post('/transaction', (req, res) => {
    const { type, amount, category, date, notes } = req.body;
    const userId = req.session.userId;  // Ensure user is logged in

    if (!userId) {
        return res.status(401).send('Please log in first');  // Send 401 Unauthorized if not logged in
    }

    db.query('INSERT INTO transactions (user_id, type, amount, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)', 
        [userId, type, amount, category, date, notes], (err, result) => {
            if (err) {
                res.status(500).send('Transaction failed');
            } else {
                res.send('Transaction added successfully');
            }
        });
});


// Get all transactions for the logged-in user
app.get('/transactions', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(403).send('Please log in first');
    }
    db.query('SELECT * FROM transactions WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            res.status(500).send('Failed to retrieve transactions');
        } else {
            res.json(results);
        }
    });
});

// Get the currently logged-in user
app.get('/getUser', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json(null); // User is not logged in
    }

    db.query('SELECT name FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).send('Failed to retrieve user');
        }
        res.json(results[0]); // Send user details to frontend
    });
});

// Logout the user
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.send('Logout successful');
    });
});


// more fetures


// more features end


// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server running on http://localhost:3000');
});
