import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute ({children}) {
    const { isAuthenticated } = useContext(AuthContext);

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;