import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';

import Schedule from '../components/Schedule'; // Import Schedule component
import MySessions from '../components/MySessions'; // Import MySessions component



const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  console.log('Admin Route Role:', role); // Log the role
  if (role !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

const UserRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  console.log('User Route Role:', role); // Log the role
  if (role !== 'user') {
    return <Navigate to="/" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/adminview"
        element={
          <AdminRoute>
            <AdminView />
          </AdminRoute>
        }
      />
      <Route
        path="/userview"
        element={
          <UserRoute>
            <UserView />
          </UserRoute>
        }
      />
      {/* You can uncomment the following if you need these routes */}
      {/* <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
      {/* Admin View */}
      <Route path="/adminview" element={<AdminView />} />

      {/* Schedule and My Sessions routes */}
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/mysessions" element={<MySessions />} />
    </Routes>
  );
};

export default AppRoutes;
