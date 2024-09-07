import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Routes from './routes/routes';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes />
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
