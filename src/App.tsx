import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ReportNew from "./pages/ReportNew";
import ReportConfirmation from "./pages/ReportConfirmation";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Offline from "./pages/Offline";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import AdminMap from "./pages/admin/AdminMap";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/offline" element={<Layout><Offline /></Layout>} />
          
          {/* Protected Citizen Routes */}
          <Route path="/report/new" element={
            <ProtectedRoute>
              <Layout><ReportNew /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/report/confirmation" element={
            <ProtectedRoute>
              <Layout><ReportConfirmation /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/report/:id" element={
            <ProtectedRoute>
              <Layout><ReportDetail /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute>
              <Layout><Map /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'department_staff']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin', 'department_staff']}>
              <AdminLayout><AdminReports /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/map" element={
            <ProtectedRoute allowedRoles={['admin', 'department_staff']}>
              <AdminLayout><AdminMap /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin', 'department_staff']}>
              <AdminLayout><AdminAnalytics /></AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
