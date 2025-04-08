
import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Membership } from '@/types/supabase';

const AdminPremiumMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<(Membership & { user_name?: string, user_email?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('memberships')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching members:', error);
          throw error;
        }
        
        // Since we don't have direct access to user data from auth.users,
        // we need to fetch it from bookings or another source that has user info
        const membersWithUserInfo = await Promise.all((data as Membership[]).map(async (member) => {
          // Try to find user info from bookings
          const { data: bookingData } = await supabase
            .from('bookings')
            .select('user_name, user_email')
            .eq('user_id', member.user_id)
            .limit(1)
            .maybeSingle();
            
          return {
            ...member,
            user_name: bookingData?.user_name || 'Unknown User',
            user_email: bookingData?.user_email || 'No email found'
          };
        }));
        
        setMembers(membersWithUserInfo);
      } catch (error) {
        console.error('Error in fetchMembers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, []);
  
  const filteredMembers = members.filter(member => 
    (member.user_name && member.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.user_email && member.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    member.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.payment_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <AdminLayout title="Premium Members">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search by name, email, tier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-3">
            <Badge variant="outline" className="text-sm">
              Total Members: {members.length}
            </Badge>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Membership Tier</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="text-center">
                      Loading premium members...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.user_name}</TableCell>
                    <TableCell>{member.user_email}</TableCell>
                    <TableCell>
                      <Badge className={
                        member.tier === 'Premium V3' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' :
                        member.tier === 'Premium V2' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        'bg-green-100 text-green-800 hover:bg-green-100'
                      }>
                        {member.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{member.amount}</TableCell>
                    <TableCell>{member.payment_id}</TableCell>
                    <TableCell>{formatDate(member.created_at)}</TableCell>
                    <TableCell>
                      <Badge className={member.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm 
                      ? 'No members found matching your search.' 
                      : 'No premium members found.'}
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

export default AdminPremiumMembers;
