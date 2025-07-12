import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthProvider";

import { PrivateRoute, PasswordResetRoute } from "@/routes/PrivateRoute";
import { PublicRoute } from "@/routes/PublicRoute";

import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
// import ReportsPage from "@/pages/ReportsPage";

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

            {/* All protected routes */}
            <Route
              path="/change-password"
              element={
                <PrivateRoute>
                  <ChangePasswordPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <DashboardPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <DashboardPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/maps"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <MapPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/establishments"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <EstablishmentPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/establishments/add"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <EstablishmentPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/establishments/edit/:id"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <EstablishmentPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/establishments/archived"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <EstablishmentPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/nature-of-business"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <NatureOfBusinessPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/inspection"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <InspectionPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/d/inspection/add"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <CreateInspectionPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <ReportPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <ReportsPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/user-management"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <UserManagementPage />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
                        <SiteHeader />
                      </header>
                      <Separator />
                      <ProfilePage />
                    </SidebarInset>
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
