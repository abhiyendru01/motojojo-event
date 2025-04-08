import { Card, CardContent } from "@/components/ui/card"
import { useCity } from "@/contexts/CityContext"

const allExperiences = [
  {
    id: 1,
    title: "DJ Masterclass",
    category: "Music",
    cities: ["Mumbai", "Delhi", "Bangalore"],
    image: "https://images.unsplash.com/photo-1571266028242-f0e919a2d108?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Cocktail Workshop",
    category: "Food & Drink",
    cities: ["Mumbai", "Goa", "Pune"],
    image: "https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Pottery Class",
    category: "Arts",
    cities: ["Jaipur", "Delhi", "Mumbai"],
    image: "https://images.unsplash.com/photo-1565104271227-4ae8de960a26?q=80&w=2948&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Wine Tasting",
    category: "Food & Drink",
    cities: ["Bangalore", "Mumbai", "Goa"],
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Cooking Class",
    category: "Food & Drink",
    cities: ["Delhi", "Mumbai", "Chennai"],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Yoga Retreat",
    category: "Wellness",
    cities: ["Rishikesh", "Goa", "Pune"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2820&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Stand-up Comedy Workshop",
    category: "Comedy",
    cities: ["Mumbai", "Bangalore", "Delhi"],
    image: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Photography Walk",
    category: "Arts",
    cities: ["Delhi", "Mumbai", "Jaipur"],
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Tech Hackathon",
    category: "Technology",
    cities: ["Bangalore", "Hyderabad", "Pune"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 10,
    title: "Poetry Workshop",
    category: "Poetry",
    cities: ["Delhi", "Mumbai", "Chandigarh"],
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2070&auto=format&fit=crop"
  },
]

const ExperiencesSection = () => {
  const { selectedCity } = useCity();
  
  // Filter experiences based on selected city
  const experiences = allExperiences.filter(exp => 
    selectedCity === "All Cities" || exp.cities.includes(selectedCity)
  );

  return (
    <section className="py-8 w-full">
      <div className="container">
        <h2 className="section-title">Unique Experiences in {selectedCity}</h2>
        
        {experiences.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No experiences found in {selectedCity} at this time.</p>
          </div>
        ) : (
          <div className="horizontal-scroll">
            {experiences.map((exp) => (
              <Card key={exp.id} className="flex-shrink-0 min-w-[280px] max-w-[280px] border border-black">
                <CardContent className="p-0">
                  <div className="relative h-[320px]">
                    <div className="w-full h-full bg-gray-300"></div>
                    <div className="absolute bottom-0 left-0 p-4 bg-white w-full">
                      <h3 className="text-xl font-bold text-black">{exp.title}</h3>
                      <p className="text-black text-sm mt-1">{exp.category}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.cities.map(city => (
                          <span 
                            key={city} 
                            className={`text-xs bg-gray-200 px-2 py-0.5 border border-black ${
                              city === selectedCity ? "bg-gray-400" : ""
                            }`}
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ExperiencesSection
