import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";

import Login from './pages/Login';
import Register from './pages/Register';
import Markets from './pages/Markets';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/" element={<Navigate to="/markets" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
