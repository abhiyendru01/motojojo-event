
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

type GeolocationState = {
  city: string;
  loading: boolean;
  error: string | null;
};

// List of Indian cities for mapping coordinates to city names
// In a real app, we would use a more accurate reverse geocoding service
const indianCities = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Goa", lat: 15.2993, lng: 74.1240 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
];

// Simple distance calculation between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
};

// Find the nearest city based on coordinates
const findNearestCity = (latitude: number, longitude: number) => {
  let minDistance = Number.MAX_VALUE;
  let nearestCity = "Mumbai"; // Default to Mumbai if we can't find a match

  indianCities.forEach((city) => {
    const distance = calculateDistance(latitude, longitude, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city.name;
    }
  });

  return nearestCity;
};

export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    city: "Mumbai", // Default city
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        city: "Mumbai",
        loading: false,
        error: "Geolocation is not supported by your browser",
      });
      return;
    }

    // Attempt to get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestCity = findNearestCity(latitude, longitude);
        
        setState({
          city: nearestCity,
          loading: false,
          error: null,
        });
        
        toast.success(`Location detected: ${nearestCity}`);
      },
      (error) => {
        console.error("Error getting location:", error);
        setState({
          city: "Mumbai", // Default to Mumbai if there's an error
          loading: false,
          error: error.message,
        });
      }
    );
  }, []);

  return state;
};
