import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
// import { Outlet } from "react-router";
import { AuthContext } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
function GuestRoute ({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  return !isAuthenticated ? children : <Navigate to="/dashboard/spendings" />;
}

export default GuestRoute;
