
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { initializeRazorpayPayment } from "@/utils/razorpay";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  whatsapp: z.string().min(10, {
    message: "Please enter a valid WhatsApp number.",
  }),
});

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    price: number;
    date: string;
    time: string;
    image: string;
    city: string;
  };
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, event }) => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  
  // Initialize form with user data if they're logged in
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isSignedIn ? user?.fullName || "" : "",
      email: isSignedIn ? user?.primaryEmailAddress?.emailAddress || "" : "",
      whatsapp: "",
    },
  });

  const handleRazorpayPayment = async (values: z.infer<typeof formSchema>) => {
    // Convert price to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(event.price * 100);
    
    try {
      await initializeRazorpayPayment({
        key: "rzp_test_kXdvIUTOdIictY", // Test key
        amount: amountInPaise,
        currency: "INR",
        name: "MotoJojo Events",
        description: `Booking for ${event.title}`,
        handler: function(response) {
          console.log("Payment successful:", response);
          
          // Save booking data to localStorage
          const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
          const newBooking = {
            id: Date.now().toString(),
            eventId: event.id,
            eventTitle: event.title,
            eventImage: event.image,
            eventDate: event.date,
            eventTime: event.time,
            eventLocation: event.city,
            bookingDate: new Date().toISOString(),
            paymentId: response.razorpay_payment_id,
            amount: event.price,
            status: 'confirmed',
            attendee: values.name,
            email: values.email,
            whatsapp: values.whatsapp
          };
          
          bookings.push(newBooking);
          localStorage.setItem('userBookings', JSON.stringify(bookings));
          
          // Close booking dialog and show confirmation
          onClose();
          setIsConfirmationOpen(true);
        },
        prefill: {
          name: values.name,
          email: values.email,
          contact: values.whatsapp
        },
        theme: {
          color: "#000000"
        }
      });
    } catch (error) {
      console.error("Razorpay payment failed:", error);
      toast.error("Payment failed", {
        description: "There was an issue processing your payment. Please try again.",
      });
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleRazorpayPayment(values);
  };

  const handleViewBookings = () => {
    setIsConfirmationOpen(false);
    navigate('/bookings');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Book Your Ticket</DialogTitle>
            <DialogDescription>
              Complete your details to book tickets for "{event.title}".
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your WhatsApp number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-6 border-t pt-4">
                <p className="text-lg font-semibold flex justify-between items-center">
                  <span>Total Amount:</span>
                  <span className="text-black">₹{event.price}</span>
                </p>
              </div>
              
              <DialogFooter className="mt-6">
                <Button
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-black hover:bg-black/90 text-white"
                >
                  Pay Now
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Booking confirmation dialog */}
      <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking Confirmed!</AlertDialogTitle>
            <AlertDialogDescription>
              Your seat has been booked for "{event.title}". We're waiting for you at the event!
              You can view your booking details in the My Bookings section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleViewBookings}>
              View My Bookings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingForm;
