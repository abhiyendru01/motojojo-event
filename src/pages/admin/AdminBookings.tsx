import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface Booking {
  id: string;
  booking_id: string;
  user_name: string;
  user_email: string;
  event_name: string;
  event_date: string;
  tickets: number;
  amount: number;
  form_details: {
    phone?: string;
    address?: string;
    preferences?: string;
    age?: string;
    [key: string]: any;
  } | Json;
  payment_status: string;
  created_at: string;
}

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  const filteredBookings = bookings.filter(booking => 
    booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;
    
    const headers = [
      'Booking ID',
      'User Name',
      'User Email',
      'Event',
      'Date',
      'Tickets',
      'Amount',
      'Payment Status',
      'Booking Time'
    ];
    
    const csvData = filteredBookings.map(booking => [
      booking.booking_id,
      booking.user_name,
      booking.user_email,
      booking.event_name,
      formatDate(booking.event_date),
      booking.tickets,
      booking.amount,
      booking.payment_status,
      formatTimestamp(booking.created_at)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <AdminLayout title="View Bookings">
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="w-full sm:w-96">
            <Input
              placeholder="Search by name, email, event, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={exportToCSV}
            disabled={filteredBookings.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
        
        {/* Bookings Table */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Tickets</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="text-center">
                      Loading bookings data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.booking_id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{booking.user_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.event_name}</TableCell>
                    <TableCell>{formatDate(booking.event_date)}</TableCell>
                    <TableCell className="text-right">{booking.tickets}</TableCell>
                    <TableCell className="text-right">₹{booking.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.payment_status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.payment_status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.payment_status === 'completed' 
                          ? 'Paid' 
                          : booking.payment_status === 'failed'
                          ? 'Failed'
                          : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewBookingDetails(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm 
                      ? 'No bookings found matching your search.' 
                      : 'No bookings data available yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details: {selectedBooking?.booking_id}</DialogTitle>
            <DialogDescription>
              Made on {selectedBooking && formatTimestamp(selectedBooking.created_at)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                  <p>{selectedBooking.user_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p>{selectedBooking.user_email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                  <p>{typeof selectedBooking.form_details === 'object' && selectedBooking.form_details !== null 
                      ? (selectedBooking.form_details as any).phone || 'N/A' 
                      : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Age</h4>
                  <p>{typeof selectedBooking.form_details === 'object' && selectedBooking.form_details !== null 
                      ? (selectedBooking.form_details as any).age || 'N/A' 
                      : 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                <p>{typeof selectedBooking.form_details === 'object' && selectedBooking.form_details !== null 
                    ? (selectedBooking.form_details as any).address || 'N/A' 
                    : 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Event</h4>
                <p>{selectedBooking.event_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedBooking.event_date)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tickets</h4>
                  <p>{selectedBooking.tickets}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total Amount</h4>
                  <p className="font-medium">₹{selectedBooking.amount}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Payment Status</h4>
                <p className={`${
                  selectedBooking.payment_status === 'completed' 
                    ? 'text-green-600' 
                    : selectedBooking.payment_status === 'failed'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {selectedBooking.payment_status === 'completed' 
                    ? 'Payment Completed' 
                    : selectedBooking.payment_status === 'failed'
                    ? 'Payment Failed'
                    : 'Payment Pending'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Preferences</h4>
                <p>{typeof selectedBooking.form_details === 'object' && selectedBooking.form_details !== null 
                    ? (selectedBooking.form_details as any).preferences || 'None specified' 
                    : 'None specified'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBookings;
