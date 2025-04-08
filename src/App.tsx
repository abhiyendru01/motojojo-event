
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { CityProvider } from "@/contexts/CityContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import EventDetail from "@/pages/EventDetail";
import UserProfile from "@/pages/UserProfile";
import Bookings from "@/pages/Bookings";
import ArtistPublicProfile from "@/pages/ArtistPublicProfile";
import Premium from "@/pages/Premium";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminTicketSummary from "@/pages/admin/AdminTicketSummary";
import AdminExperiences from "@/pages/admin/AdminExperiences";
import AdminBanners from "@/pages/admin/AdminBanners";
import AdminPremiumMembers from "@/pages/admin/AdminPremiumMembers";

// Artist Pages
import ArtistLogin from "@/pages/artist/ArtistLogin";
import ArtistProfile from "@/pages/artist/ArtistProfile";
import ArtistDashboard from "@/pages/artist/ArtistDashboard";
import ArtistEvents from "@/pages/artist/ArtistEvents";
import ArtistBookings from "@/pages/artist/ArtistBookings";
import ArtistCreateEvent from "@/pages/artist/ArtistCreateEvent";

// Define a valid publishable key for Clerk
// In a production environment, you would use an environment variable
const CLERK_PUBLISHABLE_KEY = "pk_test_ZGVmaW5pdGUtcmluZ3RhaWwtODEuY2xlcmsuYWNjb3VudHMuZGV2JA";

function App() {
  // Check if we have a key
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
  }
  
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AdminAuthProvider>
        <CityProvider>
          <ThemeProvider defaultTheme="light">
            <Toaster richColors />
            <Router>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/event/:id" element={<EventDetail />} />
                <Route path="/artist/:name" element={<ArtistPublicProfile />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/user/bookings" element={<Bookings />} />
                <Route path="/premium" element={<Premium />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/events" element={
                  <AdminProtectedRoute>
                    <AdminEvents />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/bookings" element={
                  <AdminProtectedRoute>
                    <AdminBookings />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/tickets" element={
                  <AdminProtectedRoute>
                    <AdminTicketSummary />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/experiences" element={
                  <AdminProtectedRoute>
                    <AdminExperiences />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/banners" element={
                  <AdminProtectedRoute>
                    <AdminBanners />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/premium-members" element={
                  <AdminProtectedRoute>
                    <AdminPremiumMembers />
                  </AdminProtectedRoute>
                } />
                
                {/* Artist Routes */}
                <Route path="/artist/login" element={<ArtistLogin />} />
                <Route path="/artist/profile" element={<ArtistProfile />} />
                <Route path="/artist/dashboard" element={<ArtistDashboard />} />
                <Route path="/artist/events" element={<ArtistEvents />} />
                <Route path="/artist/bookings" element={<ArtistBookings />} />
                <Route path="/artist/create-event" element={<ArtistCreateEvent />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </CityProvider>
      </AdminAuthProvider>
    </ClerkProvider>
  );
}

export default App;
