
import React from 'react';
import Navbar from "@/components/Navbar";
import CityStrip from "@/components/CityStrip";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CityStrip />
      
      <main className="flex-1">
        {/* Hero skeleton */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container text-center max-w-4xl px-4">
              <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/4 mx-auto" />
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Info card skeleton */}
            <div className="border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-6 border-b md:border-r last:border-r-0">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile book button skeleton */}
            <div className="lg:hidden">
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Booking card skeleton */}
              <div className="hidden lg:block p-6 bg-card rounded-2xl border">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
                
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Artist info skeleton */}
              <div className="rounded-2xl border p-6">
                <Skeleton className="h-8 w-24 mb-4" />
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
              
              {/* Similar events skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="rounded-2xl border overflow-hidden">
                      <Skeleton className="h-32 w-full" />
                      <div className="p-4">
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetailSkeleton;
