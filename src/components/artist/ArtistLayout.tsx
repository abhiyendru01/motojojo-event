
import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Users,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ArtistLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/artist/login");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-motojojo-violet border-opacity-50 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="border border-motojojo-violet"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white border-r shadow-sm`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Profile */}
          <div className="p-4 border-b">
            <Link to="/" className="block mb-4">
              <h1 className="text-xl font-bold">MotoJojo</h1>
              <p className="text-sm text-muted-foreground">Artist Dashboard</p>
            </Link>
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <span className="font-medium">Artist Portal</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link 
              to="/artist/dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/artist/profile" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <User size={20} />
              <span>My Profile</span>
            </Link>
            <Link 
              to="/artist/events/create" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <Calendar size={20} />
              <span>Create Event</span>
            </Link>
            <Link 
              to="/artist/events" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <Calendar size={20} />
              <span>My Events</span>
            </Link>
            <Link 
              to="/artist/bookings" 
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <Users size={20} />
              <span>Who Booked</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Return to Main Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default ArtistLayout;
