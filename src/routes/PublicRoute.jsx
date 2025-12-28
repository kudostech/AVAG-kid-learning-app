// components/PublicRoute.js
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const role = getUserRole();

    // You can map roles to their respective home routes
    const roleHomeRoutes = {
      admin: "/admin/dashboard",
      teacher: "/teacher/dashboard",
      student: "/student/dashboard",
    };

    return <Navigate to={roleHomeRoutes[role]} />;
  }

  return children;
};

export default PublicRoute;
