import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import AuthPage from './pages/AuthPage/AuthPage';
import MyHousePage from './pages/MyHousePage/MyHousePage';
import MyJobsPage from './pages/MyJobsPage/MyJobsPage';
import Wallet from './pages/Wallet/Wallet';
import ChatLayout from './pages/ChatLayout/ChatLayout';
import MainLayout from './components/MainLayout/MainLayout';
import { WalletProvider, useWalletContext } from './context/WalletContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const { account, jwt } = useWalletContext();
  return account && jwt ? children : <Navigate to="/auth" />;
};

const MainLayoutWrapper = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
      <NotificationProvider>
      <WalletProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes with MainLayout */}
          <Route path="/myhouse" element={<MainLayoutWrapper><MyHousePage /></MainLayoutWrapper>} />
          <Route path="/myjobs" element={<MainLayoutWrapper><MyJobsPage /></MainLayoutWrapper>} />
          <Route path="/wallet" element={<MainLayoutWrapper><Wallet/></MainLayoutWrapper>} />
          <Route path="/chat" element={<ChatProvider><MainLayoutWrapper><ChatLayout /></MainLayoutWrapper></ChatProvider>}/>
          {/* Other routes */}
        </Routes>
      </WalletProvider>
      </NotificationProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;