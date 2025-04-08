
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Summer Music Festival",
    description: "Experience the hottest beats under the sun",
    bgColor: "bg-gray-300", 
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Art Exhibition",
    description: "Discover contemporary masterpieces",
    bgColor: "bg-gray-300",
    image: "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Food Festival",
    description: "Taste culinary delights from around the world",
    bgColor: "bg-gray-300",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Theater Night",
    description: "Be captivated by stunning performances",
    bgColor: "bg-gray-300",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=2871&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Tech Conference",
    description: "Connect with industry leaders",
    bgColor: "bg-gray-300",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop"
  },
]

const Hero = () => {
  return (
    <div className="w-full py-4 overflow-hidden">
      <div className="container">
        <div className="overflow-hidden">
          <div className="flex gap-4 py-2">
            {[...banners, ...banners].map((banner, index) => (
              <Card 
                key={index} 
                className="flex-shrink-0 w-[280px] md:w-[350px] lg:w-[400px] border border-black"
              >
                <CardContent className="p-0 h-[200px] md:h-[250px] relative">
                  <div className="absolute inset-0 bg-gray-300 z-0"></div>
                  <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-black">{banner.title}</h2>
                      <p className="text-black">{banner.description}</p>
                    </div>
                    <Button 
                      className="w-fit bg-black text-white border border-black"
                    >
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
