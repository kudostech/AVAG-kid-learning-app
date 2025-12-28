// components/RoleRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const RoleRoute = ({ allowedRoles, children, redirectTo = "/" }) => {
    if (!isAuthenticated()) return <Navigate to={redirectTo} />;
  
  const role = getUserRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default RoleRoute;
