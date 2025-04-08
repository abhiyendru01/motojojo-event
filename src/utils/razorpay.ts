
// Interface for Razorpay payment options
export interface RazorpayOptions {
  key: string;
  amount: number; // in paise (100 paise = ₹1)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color: string;
  };
}

// Declare Razorpay as a global type
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (options: RazorpayOptions): Promise<boolean> => {
  const isLoaded = await loadRazorpayScript();
  
  if (isLoaded) {
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    return true;
  } else {
    console.error('Razorpay SDK failed to load');
    return false;
  }
};
