import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThemeProvider } from "@/components/theme-provider";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import BinsPage from "@/pages/BinsPage";
import MapViewPage from "@/pages/MapViewPage";
import DevicesPage from "@/pages/DevicesPage";
import AlertsPage from "@/pages/AlertsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AdminPage from "@/pages/AdminPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Toaster />
      <Sonner position="top-right" richColors />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/bins" element={
              <ProtectedRoute><DashboardLayout><BinsPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute><DashboardLayout><MapViewPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/devices" element={
              <ProtectedRoute><DashboardLayout><DevicesPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/alerts" element={
              <ProtectedRoute><DashboardLayout><AlertsPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><DashboardLayout><AnalyticsPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute><DashboardLayout><AboutPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin><DashboardLayout><AdminPage /></DashboardLayout></ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
