import { Mail } from "lucide-react";
const Footer = () => {
  return <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/msb-uploads/22cdc170-923f-4896-a1ab-d5d9b4467f6d.png" 
                alt="MSB Logo" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Empowering creators and enriching lives through meaningful impact and community support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="/about-contact" className="text-gray-400 hover:text-white transition-colors block">About Us</a>
              <a href="/faq" className="text-gray-400 hover:text-white transition-colors block">FAQ</a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">MSB.earth.help@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 MSB. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;