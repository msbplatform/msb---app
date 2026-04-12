
import { Button } from "@/components/ui/button";
import { Menu, X, Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/msb-uploads/e56fb214-10aa-4393-9fac-248f51e7ece6.png" 
              alt="MSB Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/about-contact" className="text-gray-700 hover:text-gray-900 transition-colors">About & Contact</Link>
            <Link to="/campaigns" className="text-gray-700 hover:text-gray-900 transition-colors">Campaigns</Link>
            <Link to="/faq" className="text-gray-700 hover:text-gray-900 transition-colors">FAQ</Link>
            <Link to="/profile" className="text-gray-700 hover:text-gray-900 transition-colors">Profile</Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link to="/add-content">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Hello, {user.email?.split('@')[0]}
                </span>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="text-gray-700 border-gray-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="text-gray-700 border-gray-300">
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-primary text-black font-medium hover:bg-primary/90 transition-colors">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <Link to="/about-contact" className="text-gray-700 hover:text-gray-900 transition-colors">About & Contact</Link>
              <Link to="/campaigns" className="text-gray-700 hover:text-gray-900 transition-colors">Campaigns</Link>
              <Link to="/faq" className="text-gray-700 hover:text-gray-900 transition-colors">FAQ</Link>
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 transition-colors">Profile</Link>
              {user && (
                <Link to="/add-content">
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition-colors w-full mb-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </Link>
              )}
              
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 px-2">
                    Hello, {user.email?.split('@')[0]}
                  </div>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    className="text-gray-700 border-gray-300 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" className="text-gray-700 border-gray-300 w-full mb-2">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-primary text-black font-medium hover:bg-primary/90 transition-colors w-full">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
