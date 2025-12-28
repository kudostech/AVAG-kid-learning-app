import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ErrorPage from "../ErrorPage";
import HomePage from "../HomePage";
import Forgotpassword from "../pages/auth/ForgotPassword";
import Generate from "../pages/teacher/Generate";
import Knowledge from "../pages/teacher/Knowledge";
import MainLayout from "../pages/mainLayout";


import THome from "../pages/teacher/THome";
import Setting from "../pages/Setting";
import Student from "../pages/Student";
import Otp from "../pages/auth/Otp";
import ResetPassword from "../pages/auth/ResetPassword";
import Ranking from "../pages/teacher/Ranking";
import StudentRanking from "../pages/student/Ranking";
import Game from "../pages/teacher/Game";
import GameDetails from "../pages/GameDetails";
// import GameCreate from "../pages/teacher/GameCreate";
import AdminHome from "../pages/admin/AdminHome";
import TeacherManagement from "../pages/admin/TeacherManagement";
// import AdminKnowledge from "../pages/admin/AdminKnowledge";
// import AdminRanking from "../pages/admin/AdminRanking";
import SHome from "../pages/student/SHome";
import ClassOverViewDetails from "../pages/ClassOverViewDetails";
import StudentKnowledge from "../pages/student/StudentKnowledge";
import Activity from "../pages/student/Activity";
import StudentProfile from "../pages/student/StudentProfile";
// import StudentGame from "../pages/student/StudentGame";
import ClassDetails from "../pages/student/ClassDetails";
import SignIn from "../pages/auth/sign_in";
import Signup from "../pages/auth/sign_up";
import RoleRoute from "./RoleRoute";
import PublicRoute from "./PublicRoute";

export default function RouterComponent() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/sign_in" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="/auth/sign_up" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/auth/forgot-password" element={<PublicRoute><Forgotpassword /></PublicRoute>} />
        <Route path="/auth/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/auth/verify-otp" element={<PublicRoute><Otp /></PublicRoute>} />
        {/* Home */}
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <RoleRoute
              allowedRoles={["student"]}
              redirectTo="/auth/sign_in?role=student"
            >
              <MainLayout />
            </RoleRoute>
          }
        >
          <Route index element={<SHome />} />
          <Route path="class-overview/:id" element={<ClassDetails />} />
          <Route path="knowledge" element={<StudentKnowledge />} />
          <Route path="knowledge/knowledge-details/:id" element={<ClassOverViewDetails />} />
          <Route path="activty" element={<Activity />} />
          <Route path="student-profile" element={<StudentProfile />} />
          <Route path="student-game" element={<Game />} />
          <Route path="student-game/:gameType" element={<GameDetails />} />
          <Route path="setting" element={<Setting />} />
          <Route path="ranking" element={<StudentRanking />} />

        </Route>

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute
              allowedRoles={["admin"]}
              redirectTo="/auth/sign_in?role=admin"
            >
              <MainLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="register-teacher" element={<TeacherManagement />} />
          <Route path="students" element={<Student />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="knowledge/knowledge-details/:id" element={<ClassOverViewDetails />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="game" element={<Game />} />
          <Route path="game/:gameType" element={<GameDetails />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <RoleRoute
              allowedRoles={["teacher"]}
              redirectTo="/auth/sign_in?role=teacher"
            >
              <MainLayout />
            </RoleRoute>
          }
        >
          <Route index element={<THome />} />
          <Route path="students" element={<Student />} />
          <Route path="generate" element={<Generate />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="game" element={<Game />} />
          <Route path="game/:gameType" element={<GameDetails />} />
          <Route path="setting" element={<Setting />} />
          <Route path="knowledge/knowledge-details/:id" element={<ClassOverViewDetails />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
