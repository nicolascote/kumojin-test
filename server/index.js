const express = require('express');
const mysql = require('mysql');
const app = express();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "myrootuser",
  database: "db1"
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
  }
    console.log('Connected to the database as ID ' + connection.threadId);
});

// Define a GET route
app.get('/api/events', (req, res) => {
  
    // Fetch events from the database
  connection.query('SELECT * FROM event', (error, results) => {
      if (error) {
          console.error('Error fetching events from the database: ' + error.stack);
          return res.status(500).json({ error: 'Failed to fetch events' });
    }

    // Send the fetched data as a response
     res.json(results);
  });
});

// Middleware to parse JSON in the request body
app.use(express.json());

// Define a POST route to add a new event
app.post('/api/events', (req, res) => {
    const { name, description, startDate, endDate } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (name.length > 32) {
      return  res.status(400).json({ error: 'Name is too long' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (description.length > 255) {
      return  res.status(400).json({ error: 'Description is too long' });
    }
    if (!startDate) {
      return res.status(400).json({ error: 'Start date is required' });
    }
    if (!endDate) {
      return res.status(400).json({ error: 'End date is required' });
    }

    // Insert the new event into the database
    connection.query('INSERT INTO event (name, description, start_date_UTC, end_date_UTC) VALUES (?, ?, ?, ?)', [name, description, startDate, endDate], (error, results) => {
        if (error) {
            console.error('Error inserting event into the database: ' + error.stack);
            return res.status(500).json({ error: 'Failed to insert event' });
        }

        // Send a success response
        res.json({ 
            newId: results.insertId,
            message: 'Event inserted successfully',
        });
    });
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});