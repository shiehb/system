import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthProvider";
import { Toaster } from "sonner";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import ProfilePage from "./pages/ProfilePage";
import MapPage from "./pages/MapPage";
import SchedulePage from "./pages/SchedulePage";

function App() {
  return (
    <Router>
      <TooltipProvider>
        <AuthProvider>
          <Toaster position="bottom-right" richColors />

          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/maps"
              element={
                <PrivateRoute>
                  <MapPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute>
                  <SchedulePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <PrivateRoute>
                  <UserManagementPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </Router>
  );
}

export default App;
