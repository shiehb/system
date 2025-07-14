import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthProvider";

import { PrivateRoute, PasswordResetRoute } from "@/routes/PrivateRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { AuthenticatedLayout } from "@/components/authenticated-layout";

// Pages
import LoginPage from "@/pages/LoginPage";
import { ChangePasswordPage } from "@/pages/ChangePassword";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import UserManagementPage from "@/pages/UserManagementPage";
import ProfilePage from "@/pages/ProfilePage";
import MapPage from "@/pages/MapPage";
import EstablishmentPage from "@/pages/EstablishmentPage";
import NatureOfBusinessPage from "@/pages/NatureOfBusinessPage";
import InspectionPage from "@/pages/InspectionPage";
import CreateInspectionPage from "@/pages/CreateInspection";
import ReportPage from "@/pages/ReportPage";
// import ReportsPage from "@/pages/ReportsPage" // Uncommented ReportsPage

import NotFound from "@/components/NotFound";

function AppRoutes() {
  return (
    <Router>
      <TooltipProvider>
        <AuthProvider>
          <Toaster position="top-center" richColors />

          <Routes>
            <Route path="*" element={<NotFound />} />

            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Forgot password flow */}
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PasswordResetRoute>
                  <ResetPasswordPage />
                </PasswordResetRoute>
              }
            />

            {/* All protected routes using the common AuthenticatedLayout */}
            <Route
              path="/change-password"
              element={
                <PrivateRoute>
                  <ChangePasswordPage />
                </PrivateRoute>
              }
            />
            <Route
              element={
                <PrivateRoute>
                  <AuthenticatedLayout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/maps" element={<MapPage />} />
              {/* Nested routes for establishments */}
              <Route path="/establishments">
                <Route index element={<EstablishmentPage />} />
                <Route path="add" element={<EstablishmentPage />} />
                <Route path="edit/:id" element={<EstablishmentPage />} />
                <Route path="archived" element={<EstablishmentPage />} />
              </Route>
              <Route
                path="/nature-of-business"
                element={<NatureOfBusinessPage />}
              />
              <Route path="/inspection" element={<InspectionPage />} />
              <Route
                path="/d/inspection/add"
                element={<CreateInspectionPage />}
              />
              {/* <Route path="/reports" element={<ReportsPage />} /> Using ReportsPage */}
              <Route path="/report" element={<ReportPage />} />{" "}
              {/* If ReportPage is distinct */}
              <Route path="/user-management" element={<UserManagementPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </Router>
  );
}

export default AppRoutes;
