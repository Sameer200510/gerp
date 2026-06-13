import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/pages/Login";
import ChangePassword from "./auth/pages/ChangePassword";
import ProtectedRoute from "./shared/routes/ProtectedRoute";

import StudentLayout from "./student-portal/layout/StudentLayout";

import DashboardPage from "./student-portal/dashboard/pages/DashboardPage";
import ProfilePage from "./student-portal/profile/pages/ProfilePage";
import DocumentsPage from "./student-portal/documents/pages/DocumentsPage";

import { useAuthStore } from "./shared/store/auth.store";

function App() {
  return (
    <div className="App font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Change Password */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Student Portal */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="academic" element={<div>Academic</div>} />

          <Route path="fees" element={<div>Fees</div>} />

          <Route path="documents" element={<DocumentsPage />} />

          <Route path="exam" element={<div>Exam</div>} />

          <Route path="circulars" element={<div>Circulars</div>} />

          <Route path="placement" element={<div>Placement</div>} />

          <Route path="hostel" element={<div>Hostel</div>} />

          <Route path="grievance" element={<div>Grievance</div>} />

          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admission Portal */}
        <Route
          path="/admission/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMISSION_OFFICER"]}>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Admission Dashboard</h1>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Portal */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="p-8 text-center text-red-500 text-xl font-bold">
              Unauthorized Access
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
