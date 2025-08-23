import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ allowed, children }) => {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    // not logged in → go to login
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }

  if (!allowed.includes(user.role)) {
    // logged in but wrong role → go home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
