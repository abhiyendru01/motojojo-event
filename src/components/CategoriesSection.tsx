
import { Card, CardContent } from "@/components/ui/card"
import { Music, Theater, Utensils, Ticket, PaintBucket, Dumbbell } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Concerts",
    icon: <Music className="h-8 w-8" />,
    color: "bg-motojojo-violet"
  },
  {
    id: 2,
    name: "Theater",
    icon: <Theater className="h-8 w-8" />,
    color: "bg-motojojo-pink"
  },
  {
    id: 3,
    name: "Food & Drink",
    icon: <Utensils className="h-8 w-8" />,
    color: "bg-motojojo-orange"
  },
  {
    id: 4,
    name: "Festivals",
    icon: <Ticket className="h-8 w-8" />,
    color: "bg-motojojo-red"
  },
  {
    id: 5,
    name: "Arts",
    icon: <PaintBucket className="h-8 w-8" />,
    color: "bg-blue-500"
  },
  {
    id: 6,
    name: "Sports",
    icon: <Dumbbell className="h-8 w-8" />,
    color: "bg-green-500"
  },
]

const CategoriesSection = () => {
  return (
    <section className="py-12 w-full">
      <div className="container">
        <h2 className="section-title">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden rounded-2xl card-hover">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-3 text-white`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection
