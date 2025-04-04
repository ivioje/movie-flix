
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import HomePage from "./pages/HomePage";
import MovieDetails from "./pages/MovieDetails";
import ActorDetails from "./pages/ActorDetails";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import Bookmarks from "./pages/Bookmarks";
import WatchHistory from "./pages/WatchHistory";
import Settings from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Layout components
import RootLayout from "./components/layouts/RootLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="movieflix-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={
              <AuthLayout>
                <AuthPage />
              </AuthLayout>
            } />
            <Route element={<RootLayout />}>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/actor/:id" element={<ActorDetails />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* Protected routes - removing SignedIn wrapper for now */}
              <Route path="/dashboard" element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              } />
              <Route path="/bookmarks" element={
                <DashboardLayout>
                  <Bookmarks />
                </DashboardLayout>
              } />
              <Route path="/history" element={
                <DashboardLayout>
                  <WatchHistory />
                </DashboardLayout>
              } />
              <Route path="/settings" element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
