
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAuth from "./UserAuth";
import { useCity } from "@/contexts/CityContext";
import NavbarSearch from "./NavbarSearch";

const Navbar = () => {
  const { selectedCity } = useCity();

  return (
    <div className="w-full py-2 border-b bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold">
              MotoJojo
            </h1>
          </Link>

          {/* Search area (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-xl mx-4">
            <NavbarSearch />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* City selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex border border-black"
                >
                  {selectedCity || "Select City"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border border-black">
                <DropdownMenuLabel>Popular Cities</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Mumbai</DropdownMenuItem>
                <DropdownMenuItem>Delhi</DropdownMenuItem>
                <DropdownMenuItem>Bangalore</DropdownMenuItem>
                <DropdownMenuItem>Pune</DropdownMenuItem>
                <DropdownMenuItem>Hyderabad</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Premium */}
            <Link to="/premium">
              <Button
                variant="outline"
                className="hidden md:flex border border-black"
              >
                Explore Premium
              </Button>
            </Link>

            {/* Artist Login Button */}
            <Link to="/artist/login">
              <Button
                variant="outline"
                className="hidden md:flex border border-black"
              >
                Artist Login
              </Button>
            </Link>

            {/* Admin Login Button */}
            <Link to="/admin">
              <Button
                variant="outline"
                className="hidden md:flex border border-black"
              >
                Admin Login
              </Button>
            </Link>

            {/* Auth buttons */}
            <UserAuth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
