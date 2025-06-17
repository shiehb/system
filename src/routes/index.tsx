import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthProvider";

import { PrivateRoute } from "@/routes/PrivateRoute";
import { PublicRoute } from "@/routes/PublicRoute";

import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import UserManagementPage from "@/pages/UserManagementPage";
import ProfilePage from "@/pages/ProfilePage";
import MapPage from "@/pages/MapPage";
import InspectionPage from "@/pages/InspectionPage";
import ReportPage from "@/pages/ReportPage";

function AppRoutes() {
  return (
    <Router>
      <TooltipProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors />

          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* All protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <DashboardPage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <DashboardPage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />

            <Route
              path="*"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <DashboardPage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />

            <Route
              path="/maps"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <MapPage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />

            <Route
              path="/inspection"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <InspectionPage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <ReportPage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />

            <Route
              path="/user-management"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <UserManagementPage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <SidebarProvider className="flex flex-col [--header-height:calc(theme(spacing.14))]">
                    <SiteHeader />
                    <ProfilePage />
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </Router>
  );
}

export default AppRoutes;
