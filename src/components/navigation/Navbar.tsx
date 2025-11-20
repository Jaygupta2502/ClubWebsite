import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Search, Phone, Info, User, Menu, X, Award, FileText } from 'lucide-react';
import logo from '../../components/home/logo.png'; 

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, loading , logout} = useAuth();
  if (loading) return null;
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 const getDashboardLink = () => {
  if (!user) return '/login';

  const roleRouteMap = {
    club_president: 'president',
    faculty: 'faculty',
    hod: 'hod',
    dean: 'dean',
    director: 'director',
    venue_coordinator: 'venue-coordinator'
  };

  return `/dashboard/${roleRouteMap[user.role] || 'president'}`;
};

  const navLinks = [
    { name: 'Home', path: '/', icon: <Calendar size={18} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={18} /> },
    { name: 'Contact Us', path: '/contact', icon: <Phone size={18} /> },
    { name: 'About Us', path: '/about', icon: <Info size={18} /> },
    { name: 'Terms & Conditions', path: '/terms', icon: <FileText size={18} /> },
    { name: 'Office Bearers', path: '/office-bearers', icon: <Award size={18} /> },

  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary-950 text-white shadow-md py-2'
          : 'bg-white text-gray-900 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className="flex justify-between items-center">
          {/* Logo */}
<Link
  to="/"
  className="flex items-center space-x-3"
>
  <img
    src={logo}
    alt="Campus Events Logo"
    className="h-11 w-auto object-contain"
    style={{ marginLeft: '-60%' }}
  />
  <span
    className={`font-bold text-xl ${
      isScrolled ? 'text-white' : 'text-[#d10000]'
    }`}
  >
    Campus Events
  </span>
</Link>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 font-medium transition-colors ${
                    isActive
                      ? 'text-[#af6a5f]'
                      : isScrolled
                      ? 'text-white hover:text-[#af6a5f]'
                      : 'text-gray-800 hover:text-[#d10000]'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <Link
                to={getDashboardLink()}
                className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                  isScrolled
                    ? 'bg-white text-[#000c2d] hover:bg-gray-100'
                    : 'bg-[#d10000] text-white hover:bg-[#b30000]'
                }`}
              >
                <User size={18} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                  isScrolled
                    ? 'bg-white text-[#000c2d] hover:bg-gray-100'
                    : 'bg-[#d10000] text-white hover:bg-[#b30000]'
                }`}
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${isScrolled ? 'text-white' : 'text-[#d10000]'}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white mt-3 rounded-lg shadow-lg">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-3 ${
                      isActive ? 'text-[#d10000]' : 'text-gray-800'
                    } hover:bg-gray-100`
                  }
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              ))}
              {isAuthenticated ? (
  <div className="flex items-center space-x-3">
    <Link
      to={getDashboardLink()}
      className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-1 ${
        isScrolled
          ? 'bg-white text-[#000c2d] hover:bg-gray-100'
          : 'bg-[#d10000] text-white hover:bg-[#b30000]'
      }`}
    >
      <User size={18} />
      <span>Dashboard</span>
    </Link>
    <button
      onClick={() => {
        if (confirm('Are you sure you want to log out?')) {
          logout();
          window.location.href = '/'; // redirect to homepage
        }
      }}
      className={`px-4 py-2 rounded-md transition-colors ${
        isScrolled
          ? 'bg-white text-red-600 hover:bg-gray-100'
          : 'bg-gray-200 text-red-600 hover:bg-gray-300'
      }`}
    >
      Logout
    </button>
  </div>
) : (
 <Link
  to="/login"
  className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-1 ${
    isScrolled
      ? 'bg-white text-[#000c2d] hover:bg-gray-100'
      : 'bg-[#d10000] text-white hover:bg-[#b30000]'
  }`}
>
  <User size={18} />
  <span>Login</span>
</Link>
)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
