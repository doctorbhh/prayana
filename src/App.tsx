import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/profile";
import NotFound from "./pages/NotFound";
import { motion } from "framer-motion"; // For animations
import logo from "/public/logo.jpg"; // Adjust path to your logo/image

const queryClient = new QueryClient();

// Loader Component with Image and Animation
const Loader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.img
          src={logo} // Replace with your logo or loading icon
          alt="Loading"
          className="h-16 w-16"
          animate={{
            scale: [1, 1.1, 1], // Pulse effect (slight scaling)
            opacity: [1, 0.7, 1], // Fade effect (subtle opacity change)
          }}
          transition={{
            repeat: Infinity, // Repeat indefinitely
            duration: 2, // Slow pulse (2 seconds per cycle)
            ease: "easeInOut", // Smooth easing
          }}
        />
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    </motion.div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginRoute />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/Profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Protect routes for authenticated users only
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading: loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirect authenticated users away from login page
const LoginRoute: React.FC = () => {
  const { currentUser, isLoading: loading } = useAuth();

  console.log("LoginRoute - Current User:", currentUser ? currentUser.email : null, "Loading:", loading);

  if (loading) {
    return <Loader />;
  }

  return !currentUser ? <Login /> : <Navigate to="/" replace />;
};

export default App;