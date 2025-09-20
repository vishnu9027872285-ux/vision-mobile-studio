import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import ReportNew from "./pages/ReportNew";
import ReportConfirmation from "./pages/ReportConfirmation";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
