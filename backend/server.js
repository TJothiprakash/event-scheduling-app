// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const connectDB = require('./config/db'); // Import the MongoDB config
const adminAvailabilityRoutes = require('./routes/adminAvailabilityRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const { swaggerUi, swaggerDocs } = require("./swaggerConfig");




dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());  // This should come before the routes

// Middleware for user routes (login,register,logout 3 API's)
app.use('/api/users', userRoutes);

// Middleware for availability routes ( /, getuseravailability,updateavailability,deleteavailability 4 API's)
app.use('/api/availability', availabilityRoutes);

// Other middleware and routes
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Middleware for session routes(/schedule,/mysessions,/schedulemultiparticipantsession 3 API's)
app.use('/api/sessions', sessionRoutes);


// Middleware for admin availability routes (admin to view all users availability 1 API)
app.use('/api/admin/availability', adminAvailabilityRoutes);

// Connect to MongoDB
connectDB();

// Sample route
app.get('/', (req, res) => {
   res.send('Event Scheduler Backend API');
});

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
