
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar, MapPin, Users, Ticket, User } from "lucide-react";

interface EventInfoProps {
  event: {
    date: string;
    time: string;
    duration: string;
    city: string;
    artist: string;
    category: string;
    totalSeats: number;
    availableSeats: number;
  };
}

const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
  return (
    <Card className="border border-black">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {/* Date */}
          <div className="p-4 border-b border-r border-black">
            <div className="flex flex-col">
              <div className="flex items-center mb-2 text-black">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">Date</span>
              </div>
              <span className="text-lg">{event.date}</span>
            </div>
          </div>

          {/* Time */}
          <div className="p-4 border-b border-r border-black">
            <div className="flex flex-col">
              <div className="flex items-center mb-2 text-black">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Time</span>
              </div>
              <span className="text-lg">{event.time}</span>
              <span className="text-sm text-gray-500">{event.duration}</span>
            </div>
          </div>

          {/* Location */}
          <div className="p-4 border-b border-black">
            <div className="flex flex-col">
              <div className="flex items-center mb-2 text-black">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="font-medium">Location</span>
              </div>
              <span className="text-lg">{event.city}</span>
            </div>
          </div>

          {/* Artist */}
          <div className="p-4 border-b border-r border-black">
            <div className="flex flex-col">
              <div className="flex items-center mb-2 text-black">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">Artist</span>
              </div>
              <span className="text-lg">{event.artist}</span>
            </div>
          </div>

          {/* Category */}
          <div className="p-4 border-b border-r border-black">
            <div className="flex flex-col">
              <div className="flex items-center mb-2 text-black">
                <Ticket className="h-5 w-5 mr-2" />
                <span className="font-medium">Category</span>
              </div>
              <span className="text-lg">{event.category}</span>
            </div>
          </div>

          {/* Seats */}
          <div className="p-4 border-b border-black">
            <div className="flex flex-col">
              <div className="flex items-center mb-2 text-black">
                <Users className="h-5 w-5 mr-2" />
                <span className="font-medium">Seats</span>
              </div>
              <span className="text-lg">{event.availableSeats} available</span>
              <span className="text-sm text-gray-500">
                out of {event.totalSeats} total
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventInfo;
