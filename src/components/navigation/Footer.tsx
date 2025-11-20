import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Calendar size={24} className="text-accent-500" />
              <span className="text-xl font-bold">Campus Events</span>
            </Link>
            <p className="text-neutral-400 mb-4">
              Discover and attend the best campus events. Create and manage your own events with our comprehensive platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-accent-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="text-neutral-400 hover:text-accent-500 transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-accent-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-accent-500 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/login" className="text-neutral-400 hover:text-accent-500 transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-accent-500 mt-1 flex-shrink-0" />
                <span className="text-neutral-400">MIT ADT Campus, Rajbaugh, Solapur - Pune Hwy, near Bharat Petrol Pump, Loni Kalbhor, Maharashtra 412201</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-accent-500 flex-shrink-0" />
                <span className="text-neutral-400">095951 24234</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-accent-500 flex-shrink-0" />
                <span className="text-neutral-400">info@mituniversity.edu.in</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-neutral-400 mb-4">
              Stay updated with our latest events and news.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
  className="w-full px-4 py-2 rounded-lg bg-primary-900 border border-primary-800 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button type="submit" className="btn-primary w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-900 mt-12 pt-8 text-center text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Campus Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;