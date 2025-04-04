
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
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

const queryClient = new QueryClient();

// Replace with your own publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_replace-with-your-key";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider defaultTheme="dark" storageKey="movieflix-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={
                <SignedOut>
                  <AuthLayout>
                    <AuthPage />
                  </AuthLayout>
                </SignedOut>
              } />
              <Route element={<RootLayout />}>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/actor/:id" element={<ActorDetails />} />
                <Route path="/search" element={<SearchResults />} />
                
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
    </ClerkProvider>
  </QueryClientProvider>
);

export default App;
