import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import Index from "./pages/Index";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/report/new" element={<Layout><ReportNew /></Layout>} />
          <Route path="/report/confirmation" element={<Layout><ReportConfirmation /></Layout>} />
          <Route path="/report/:id" element={<Layout><ReportDetail /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/map" element={<Layout><Map /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/offline" element={<Layout><Offline /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
          <Route path="/admin/map" element={<AdminLayout><AdminMap /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
);

export default App;
