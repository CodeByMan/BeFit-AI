import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('roleId'); // we'll store roleId on login

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && Number(role) !== Number(userRole)) {
    // Logged in but wrong role
    return <Navigate to="/login" replace />;
  }

  return children;
}
