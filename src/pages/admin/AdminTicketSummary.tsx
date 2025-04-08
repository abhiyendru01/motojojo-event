
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EventSummary {
  id: string;
  eventName: string;
  ticketsSold: number;
  revenue: number;
  capacity: number;
  remainingCapacity: number;
  eventDate: string;
}

const AdminTicketSummary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventSummaries, setEventSummaries] = useState<EventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEventSummaries = async () => {
      try {
        setIsLoading(true);
        
        // First, get all events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id, title, date, max_capacity');
          
        if (eventsError) throw eventsError;
        
        // Then, get all bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('event_id, tickets, amount');
          
        if (bookingsError) throw bookingsError;
        
        // Create a map of event ID to summary info
        const summariesMap = new Map<string, EventSummary>();
        
        // Initialize with events data
        events?.forEach(event => {
          summariesMap.set(event.id, {
            id: event.id,
            eventName: event.title,
            ticketsSold: 0,
            revenue: 0,
            capacity: event.max_capacity,
            remainingCapacity: event.max_capacity,
            eventDate: event.date
          });
        });
        
        // Add booking information
        bookings?.forEach(booking => {
          if (!booking.event_id || !summariesMap.has(booking.event_id)) return;
          
          const summary = summariesMap.get(booking.event_id)!;
          summary.ticketsSold += booking.tickets;
          summary.revenue += booking.amount;
          summary.remainingCapacity = Math.max(0, summary.capacity - summary.ticketsSold);
          
          summariesMap.set(booking.event_id, summary);
        });
        
        // Convert map to array and sort by event date (most recent first)
        const summariesArray = Array.from(summariesMap.values())
          .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        
        setEventSummaries(summariesArray);
      } catch (error) {
        console.error('Error fetching event summaries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventSummaries();
  }, []);
  
  const filteredEvents = eventSummaries.filter(event =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalRevenue = eventSummaries.reduce((sum, event) => sum + event.revenue, 0);
  const totalTicketsSold = eventSummaries.reduce((sum, event) => sum + event.ticketsSold, 0);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportToCSV = () => {
    if (filteredEvents.length === 0) return;
    
    const headers = [
      'Event Name',
      'Date',
      'Tickets Sold',
      'Capacity',
      'Occupancy (%)',
      'Revenue'
    ];
    
    const csvData = filteredEvents.map(event => [
      event.eventName,
      formatDate(event.eventDate),
      event.ticketsSold,
      event.capacity,
      Math.round((event.ticketsSold / event.capacity) * 100),
      event.revenue
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ticket_summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <AdminLayout title="Ticket Summary">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium">Total Events</h3>
            <p className="text-3xl font-bold mt-2">
              {isLoading ? <span className="animate-pulse">Loading...</span> : eventSummaries.length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium">Total Tickets Sold</h3>
            <p className="text-3xl font-bold mt-2">
              {isLoading ? <span className="animate-pulse">Loading...</span> : totalTicketsSold}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold mt-2">
              {isLoading ? <span className="animate-pulse">Loading...</span> : `₹${totalRevenue.toLocaleString()}`}
            </p>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="w-full sm:w-96">
            <Input
              placeholder="Search by event name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={exportToCSV}
            disabled={filteredEvents.length === 0}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
        
        {/* Tickets Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Tickets Sold</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="text-center">
                      Loading ticket data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.eventName}</TableCell>
                    <TableCell>{formatDate(event.eventDate)}</TableCell>
                    <TableCell className="text-right">{event.ticketsSold}</TableCell>
                    <TableCell className="text-right">{event.capacity}</TableCell>
                    <TableCell>
                      <div className="w-full flex items-center gap-2">
                        <Progress 
                          value={(event.ticketsSold / event.capacity) * 100} 
                          className="h-2"
                        />
                        <span className="text-xs whitespace-nowrap">
                          {Math.round((event.ticketsSold / event.capacity) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">₹{event.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/bookings?event=${event.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          <span>View Bookings</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm 
                      ? 'No events found matching your search.' 
                      : 'No event data available yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTicketSummary;
