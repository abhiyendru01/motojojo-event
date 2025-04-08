
import React from 'react';

interface EventDetailHeroProps {
  image: string;
  title: string;
  subtitle: string;
}

const EventDetailHero: React.FC<EventDetailHeroProps> = ({ image, title, subtitle }) => {
  return (
    <div className="relative w-full">
      {/* Hero background with overlay */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
        
        {/* Event title content */}
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-6">
          <div className="container text-center max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md animate-slide-in-bottom">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailHero;
