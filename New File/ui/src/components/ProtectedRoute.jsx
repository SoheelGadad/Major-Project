import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // 1. Get the token or user info from your storage
    // This matches the logic you used in your LoginPage earlier
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const token = getCookie('Authtoken');
    
    // 2. If no token exists, send them to the login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. (Optional) If you want to check if they are an 'Admin' specifically:
    // You would need to decode the token here (using jwt-decode) 
    // and check if the role matches allowedRoles.

    return <Outlet />;
};

export default ProtectedRoute;