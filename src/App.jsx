import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CountryHeatmap from "./pages/CountryHeatmap";
import Navbar from "./components/Navbar";
import News from "./pages/News";
import ProtectedRoute from "./components/ProtectedRoute";
import HealthGuidelines from "./pages/HealthGuidelines";
import EmergencyContacts from "./pages/EmergencyContacts";
import Profile from "./pages/Profile";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import OnboardingPage from "./pages/OnboardingPage";

const LayoutWrapper = ({
  children,
  isSidebarOpen,
  toggleSidebar,
}) => {
  return (
    <div className="App">
      <Navbar
        toggleSidebar={toggleSidebar}
      />
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <LayoutWrapper
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={
                        <Dashboard
                          isSidebarOpen={isSidebarOpen}
                          toggleSidebar={toggleSidebar}
                        />
                      }
                    />
                    <Route path="/news" element={<News />} />
                    <Route path="/heatmap" element={<CountryHeatmap />} />
                    <Route path="/health-guidelines" element={<HealthGuidelines />} />
                    <Route path="/emergency-contacts" element={<EmergencyContacts />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/analyze-symptoms" element={<SymptomAnalyzer />} />
                    <Route
                      path="/*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
