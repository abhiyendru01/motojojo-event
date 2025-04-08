
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    comment: "Great events! Attended a music festival and it was perfectly organized.",
    date: "2025-02-15",
  },
  {
    id: 2,
    name: "Priya Patel",
    rating: 4,
    comment: "Good variety of events. The booking process is simple and straightforward.",
    date: "2025-01-20",
  },
  {
    id: 3,
    name: "Vikram Singh",
    rating: 5,
    comment: "Excellent platform to discover hidden gems in the city.",
    date: "2025-03-05",
  },
  {
    id: 4,
    name: "Meera Kapoor",
    rating: 4,
    comment: "User-friendly interface and great customer service.",
    date: "2025-02-28",
  },
];

const GoogleReviews = () => {
  return (
    <div className="w-full py-8">
      <div className="container">
        <h2 className="section-title mb-6">What Our Community Says</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className="border border-black">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon 
                        key={index} 
                        size={16} 
                        className={index < review.rating ? "text-black" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">{review.name}</div>
                  <p className="text-sm">{review.comment}</p>
                  <div className="text-xs text-gray-500">{review.date}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleReviews;
