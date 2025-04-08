
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Banknote, Users, CalendarDays, Ticket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
}

interface Booking {
  id: string;
  event_name: string;
  tickets: number;
  amount: number;
  event_id: string;
}

interface DashboardData {
  totalRevenue: number;
  ticketsSold: number;
  eventsHosted: number;
  averageAttendance: number;
  topEvents: {
    id: string;
    name: string;
    tickets: number;
    revenue: number;
  }[];
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    ticketsSold: 0,
    eventsHosted: 0,
    averageAttendance: 0,
    topEvents: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch events count
        const { count: eventsCount, error: eventsError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        
        if (eventsError) throw eventsError;
        
        // Fetch bookings data
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('id, event_id, event_name, tickets, amount');
        
        if (bookingsError) throw bookingsError;
        
        // Calculate dashboard metrics
        const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.amount, 0) || 0;
        const ticketsSold = bookings?.reduce((sum, booking) => sum + booking.tickets, 0) || 0;
        const eventsHosted = eventsCount || 0;
        const averageAttendance = eventsHosted > 0 ? Math.round(ticketsSold / eventsHosted) : 0;
        
        // Group bookings by event to calculate top events
        const eventBookings: Record<string, { tickets: number; revenue: number; name: string }> = {};
        
        bookings?.forEach(booking => {
          if (!eventBookings[booking.event_id]) {
            eventBookings[booking.event_id] = {
              tickets: 0,
              revenue: 0,
              name: booking.event_name
            };
          }
          
          eventBookings[booking.event_id].tickets += booking.tickets;
          eventBookings[booking.event_id].revenue += booking.amount;
        });
        
        // Convert to array and sort by revenue
        const topEvents = Object.entries(eventBookings)
          .map(([id, data]) => ({
            id,
            name: data.name,
            tickets: data.tickets,
            revenue: data.revenue
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        setDashboardData({
          totalRevenue,
          ticketsSold,
          eventsHosted,
          averageAttendance,
          topEvents
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <span className="animate-pulse">Loading...</span> :
                `₹${dashboardData.totalRevenue.toLocaleString()}`
              }
            </div>
            <p className="text-xs text-muted-foreground">
              From all events
            </p>
          </CardContent>
        </Card>

        {/* Tickets Sold Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Sold
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <span className="animate-pulse">Loading...</span> :
                dashboardData.ticketsSold
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>

        {/* Events Hosted Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events Hosted
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <span className="animate-pulse">Loading...</span> :
                dashboardData.eventsHosted
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Total events
            </p>
          </CardContent>
        </Card>

        {/* Average Attendance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Attendance
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <span className="animate-pulse">Loading...</span> :
                dashboardData.averageAttendance
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Per event
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Events Table */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Most-Booked Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <p className="text-muted-foreground animate-pulse">Loading event data...</p>
              </div>
            ) : dashboardData.topEvents.length > 0 ? (
              <Table>
                <TableCaption>A list of the top 5 most-booked events.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead className="text-right">Tickets Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.topEvents.map((event, index) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{event.name}</TableCell>
                      <TableCell className="text-right">{event.tickets}</TableCell>
                      <TableCell className="text-right">₹{event.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No bookings data available yet. Create events and wait for bookings to appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
