
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import HealthHub from './components/HealthHub';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import OfflineSimulator from './components/OfflineSimulator';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import SymptomChecker from './components/SymptomChecker';
import VerifyAccount from './components/VerifyAccount';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ChatInterface />} />
            <Route path="/hub" element={<HealthHub />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/offline" element={<OfflineSimulator />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify/:email" element={<VerifyAccount />} />
            <Route path="/symptoms" element={<SymptomChecker />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
