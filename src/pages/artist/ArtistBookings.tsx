import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/types/supabase";

interface BookingWithEvent extends Booking {
  event_title?: string;
  event_date_formatted?: string;
}

const ArtistBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventTitles, setEventTitles] = useState<Record<string, string>>({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    const fetchArtistBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First get all events created by this artist
        const { data: artistEvents, error: eventsError } = await supabase
          .from('events')
          .select('id, title, date')
          .eq('artist_id', user.id);
          
        if (eventsError) throw eventsError;
        
        if (!artistEvents || artistEvents.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Create a map of event IDs to titles for easy reference
        const eventMap: Record<string, string> = {};
        const eventDateMap: Record<string, string> = {};
        artistEvents.forEach(event => {
          eventMap[event.id] = event.title;
          eventDateMap[event.id] = new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        });
        
        setEventTitles(eventMap);
        
        // Get all event IDs
        const eventIds = artistEvents.map(event => event.id);
        
        // Fetch bookings for these events
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .in('event_id', eventIds)
          .order('created_at', { ascending: false });
          
        if (bookingsError) throw bookingsError;
        
        if (bookingsData) {
          // Calculate totals
          const revenue = bookingsData.reduce((sum, booking) => sum + booking.amount, 0);
          const tickets = bookingsData.reduce((sum, booking) => sum + booking.tickets, 0);
          
          setTotalRevenue(revenue);
          setTotalTickets(tickets);
          
          // Add event titles to bookings
          const formattedBookings = bookingsData.map(booking => ({
            ...booking,
            form_details: booking.form_details as unknown as Record<string, any>,
            event_title: eventMap[booking.event_id || ''] || 'Unknown Event',
            event_date_formatted: eventDateMap[booking.event_id || ''] || 'Unknown Date'
          }));
          
          setBookings(formattedBookings);
        }
      } catch (error) {
        console.error('Error fetching artist bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtistBookings();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">
          Here's a summary of who's booked your events.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          {/* <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger> */}
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>
                Total revenue and tickets sold across all events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-semibold">Total Revenue</p>
                  <p className="text-2xl">₹{totalRevenue}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Total Tickets Sold</p>
                  <p className="text-2xl">{totalTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                A list of all bookings for your events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>All event bookings</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tickets</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Booking ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.event_title}</TableCell>
                          <TableCell>{booking.event_date_formatted}</TableCell>
                          <TableCell>{booking.user_name}</TableCell>
                          <TableCell>{booking.user_email}</TableCell>
                          <TableCell>{booking.tickets}</TableCell>
                          <TableCell>₹{booking.amount}</TableCell>
                          <TableCell>{booking.booking_id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistBookings;
