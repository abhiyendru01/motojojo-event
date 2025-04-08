
import { createContext, useContext, useState, ReactNode } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

type CityContextType = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isLoading: boolean;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const { city, loading } = useGeolocation();
  const [selectedCity, setSelectedCity] = useState<string>(city);

  // Update selected city when geolocation resolves
  if (!loading && city !== selectedCity && selectedCity === "Mumbai") {
    setSelectedCity(city);
  }

  return (
    <CityContext.Provider value={{ 
      selectedCity, 
      setSelectedCity, 
      isLoading: loading 
    }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
