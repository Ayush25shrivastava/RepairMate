import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { IssueProvider } from "./context/IssueContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import CommanderDashboard from "./pages/CommanderDashboard";
import RangerDashboard from "./pages/RangerDashboard";
import OpsDashboard from "./pages/OpsDashboard";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import ProtectedRoute from "./components/ProtectedRoute";

// Helper to route users to their correct dashboard
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (user.role === 'admin') return <Navigate to="/commander" replace />;
  if (user.role === 'engineer') return <Navigate to="/ops" replace />;
  return <Navigate to="/ranger" replace />;
};

function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Secured Ops Hub Routes */}
            <Route element={<MainLayout />}>
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleBasedRedirect />
                  </ProtectedRoute>
                } 
              />
              <Route 
                 path="/commander" 
                 element={<ProtectedRoute role="admin"><CommanderDashboard /></ProtectedRoute>} 
              />
              <Route 
                 path="/ranger" 
                 element={<ProtectedRoute role="user"><RangerDashboard /></ProtectedRoute>} 
              />
              <Route 
                 path="/ops" 
                 element={<ProtectedRoute role="engineer"><OpsDashboard /></ProtectedRoute>} 
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <ToastContainer position="bottom-right" theme="dark" toastClassName="bg-space-800 text-white border border-space-700" />
          <LoginModal />
          <RegisterModal />
        </Router>
      </IssueProvider>
    </AuthProvider>
  );
}

export default App;
