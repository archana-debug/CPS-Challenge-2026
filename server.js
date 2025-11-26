const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Handle Registration Submission
app.post('/api/register', (req, res) => {
    const registrationData = req.body;
    registrationData.timestamp = new Date().toISOString();

    // Read existing registrations
    const filePath = path.join(__dirname, 'registrations.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let registrations = [];
        if (!err && data) {
            try {
                registrations = JSON.parse(data);
            } catch (e) {
                console.error("Error parsing JSON:", e);
            }
        }

        registrations.push(registrationData);

        // Save back to file
        fs.writeFile(filePath, JSON.stringify(registrations, null, 2), (err) => {
            if (err) {
                console.error("Error saving registration:", err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            res.json({ success: true, message: 'Registration successful!' });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
