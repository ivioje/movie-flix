
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

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
import Index from "./pages/Index";

// Layout components
import RootLayout from "./components/layouts/RootLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Movies from "./pages/Movies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="movieflix-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/auth" element={
              <AuthLayout>
                <AuthPage />
              </AuthLayout>
            } />
            
            <Route element={<RootLayout />}>
              {/* Public routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/actor/:id" element={<ActorDetails />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/movies" element={<Movies />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <SignedIn>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </SignedIn>
              } />
              <Route path="/bookmarks" element={
                <SignedIn>
                  <DashboardLayout>
                    <Bookmarks />
                  </DashboardLayout>
                </SignedIn>
              } />
              <Route path="/history" element={
                <SignedIn>
                  <DashboardLayout>
                    <WatchHistory />
                  </DashboardLayout>
                </SignedIn>
              } />
              <Route path="/settings" element={
                <SignedIn>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </SignedIn>
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
