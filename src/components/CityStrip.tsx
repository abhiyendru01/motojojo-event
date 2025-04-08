
import { Button } from "@/components/ui/button"
import { useCity } from "@/contexts/CityContext"

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Pune", "Jaipur", 
  "Goa", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad",
  "Lucknow", "Chandigarh", "Indore", "Kochi", "Udaipur"
]

const CityStrip = () => {
  const { selectedCity, setSelectedCity } = useCity();

  return (
    <div className="w-full py-4 bg-background border-b overflow-hidden">
      <div className="container overflow-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 scrolling-touch snap-x">
          {cities.map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "ghost"}
              className={`flex-shrink-0 rounded-full px-4 snap-start ${
                selectedCity === city 
                  ? "bg-motojojo-violet hover:bg-motojojo-deepViolet" 
                  : "hover:bg-primary/10"
              }`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CityStrip
