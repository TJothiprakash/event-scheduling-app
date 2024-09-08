Session Schedule Management System
Overview
The Session Schedule Management System is a web-based application that helps users and administrators to schedule and manage sessions effectively. It provides user authentication, session scheduling, and admin features for better session management.

Technologies Used
Frontend:
React.js
Bootstrap
Backend:
Node.js
Express.js
Database:
MongoDB
Features
User authentication with JWT (JSON Web Token).
Users can set their availability and schedule one-on-one or group sessions.
Admins can manage sessions, view all scheduled sessions, and handle conflicts.
Responsive UI using Bootstrap.
Setup Instructions
Prerequisites
Make sure you have the following installed:

Node.js
MongoDB
Git
Installation Steps
Clone the repository:

bash
Copy code
git clone https://github.com/TJothiprakash/event-scheduling-app.git
cd event-scheduling-app
Set up the backend:

Navigate to the backend folder:
bash
Copy code
cd backend
Install backend dependencies:
bash
Copy code
npm install
Create a .env file and add your MongoDB connection string:
makefile
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run the backend server:
bash
Copy code
npm start
Set up the frontend:

Navigate to the frontend folder:
bash
Copy code
cd ../frontend
Install frontend dependencies:
bash
Copy code
npm install
Run the frontend:
bash
Copy code
npm start
Access the application at http://localhost:3000.

Key Features
Authentication: Users can sign up and log in.
Session Scheduling: Users can set available times and schedule sessions.
Admin Panel: Admins can manage and view all sessions.
