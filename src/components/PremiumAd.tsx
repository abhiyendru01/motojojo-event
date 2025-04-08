
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PremiumAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show ad initially after 10 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    // Set interval to show ad every 50 seconds
    const interval = setInterval(() => {
      setIsVisible(true);
    }, 50000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  const handleUpgradeClick = () => {
    setIsVisible(false);
    navigate("/premium");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 max-w-md w-full border border-black relative">
        <button 
          onClick={() => setIsVisible(false)} 
          className="absolute top-2 right-2"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Explore Premium Membership</h2>
        
        <div className="space-y-4 mb-6">
          <p className="font-medium">Why Premium is Better:</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Access to one free event each month</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Exclusive discounts on all bookings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Priority access to high-demand events</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Special invites to members-only experiences</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>No booking fees</span>
            </li>
          </ul>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="bg-black text-white border border-black w-full"
            onClick={handleUpgradeClick}
          >
            Upgrade Now
          </Button>
          <Button 
            variant="outline" 
            className="border border-black w-full"
            onClick={() => setIsVisible(false)}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumAd;
