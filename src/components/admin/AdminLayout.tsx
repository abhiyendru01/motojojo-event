
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Calendar,
  TicketCheck,
  Receipt,
  Globe,
  Image,
  LogOut,
  User,
  Star,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  // Navigation items with icons
  const navItems = [
    { 
      path: "/admin/dashboard", 
      name: "Dashboard", 
      icon: <LayoutGrid className="mr-2 h-4 w-4" /> 
    },
    { 
      path: "/admin/events", 
      name: "Events", 
      icon: <Calendar className="mr-2 h-4 w-4" /> 
    },
    { 
      path: "/admin/bookings", 
      name: "Bookings", 
      icon: <TicketCheck className="mr-2 h-4 w-4" /> 
    },
    { 
      path: "/admin/tickets", 
      name: "Ticket Summary", 
      icon: <Receipt className="mr-2 h-4 w-4" /> 
    },
    { 
      path: "/admin/experiences", 
      name: "Experiences", 
      icon: <Globe className="mr-2 h-4 w-4" /> 
    },
    { 
      path: "/admin/banners", 
      name: "Banners", 
      icon: <Image className="mr-2 h-4 w-4" /> 
    },
    { 
      path: "/admin/premium-members", 
      name: "Premium Members", 
      icon: <Star className="mr-2 h-4 w-4" /> 
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="flex flex-col flex-grow">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    location.pathname === item.path
                      ? "bg-motojojo-violet hover:bg-motojojo-deepViolet"
                      : ""
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-2" />
            <span>Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
