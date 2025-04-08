
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CityStrip from "@/components/CityStrip";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CircleCheck } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  bookingDate: string;
  paymentId: string;
  amount: number;
  status: string;
  attendee: string;
  email: string;
  whatsapp: string;
}

const Bookings = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protect route - redirect to login if not signed in
    if (isLoaded && !isSignedIn) {
      toast.error("You need to be signed in to view your bookings", {
        duration: 5000,
      });
      navigate("/");
      return;
    }

    // Load bookings from localStorage
    const loadBookings = () => {
      const savedBookings = localStorage.getItem("userBookings");
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
      setLoading(false);
    };

    loadBookings();
  }, [isSignedIn, isLoaded, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CityStrip />

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">View all your confirmed event bookings here</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden border border-gray-300">
                <div className="relative h-48">
                  <img
                    src={booking.eventImage}
                    alt={booking.eventTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black text-white px-2 py-1">
                    {booking.status}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{booking.eventTitle}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{booking.eventDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{booking.eventTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{booking.eventLocation}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Booking ID:</span>
                      <span className="text-sm">{booking.id.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Amount Paid:</span>
                      <span className="text-sm">₹{booking.amount}</span>
                    </div>
                    <div className="flex items-center justify-center mt-4">
                      <CircleCheck className="h-4 w-4 mr-1 text-black" />
                      <span className="text-sm font-medium">Confirmed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">You haven't booked any events yet.</p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-black text-white"
            >
              Explore Events
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Bookings;
