
import { ThemeToggle } from "./ThemeToggle"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full py-6 bg-white text-black border-t border-black">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-2">
              Motojojo
            </h2>
            <p className="text-gray-500 mb-2">
              Discover the best events and experiences in your city.
            </p>
            <div className="flex items-center">
              <ThemeToggle />
              <span className="text-sm text-gray-500 ml-2">Toggle theme</span>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-2">Explore</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-500 hover:text-black">Events</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Experiences</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Artists</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Venues</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-2">Company</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-500 hover:text-black">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Press</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-500 hover:text-black">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">FAQs</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-black">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-black text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Motojojo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
