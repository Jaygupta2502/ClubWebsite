import { useState, useEffect,useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, Bell, Search, User, Settings, LogOut, X, MessageSquare 
} from 'lucide-react';

type DashboardHeaderProps = {
  onOpenMessages: () => void;
};
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const DashboardHeader = ({ onOpenMessages }: DashboardHeaderProps) => {

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
 const fetchNotifications = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
    if (!token) {
      console.error('❌ No auth token found in localStorage');
      return;
    }

    const res = await fetch(`${API_BASE}/api/events/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('❌ Failed to fetch notifications:', res.status);
      return;
    }

    const data = await res.json();
    setNotifications(data);
  } catch (err) {
    console.error('❌ Fetch notifications error:', err);
  }
};

  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when changing routes
  useEffect(() => {
  setIsMobileMenuOpen(false);
  setIsNotificationsOpen(false);
  fetchNotifications();
  
  const handleClickOutside = (event: MouseEvent) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target as Node)
    ) {
      setIsNotificationsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [location]);


  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = async (id: string) => {
  try {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
await fetch(`${API_BASE}/api/events/notifications/${id}/read`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${token}` },
});
    // refresh notifications
    fetchNotifications();
  } catch (err) {
    console.error('❌ Mark as read failed:', err);
  }
};


  return (
    <header className="bg-white border-b border-neutral-200 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Page Title */}
      <div className="hidden md:block">
        <h1 className="text-xl font-semibold text-neutral-900">
          {location.pathname.includes('create-event')
            ? 'Create Event'
            : location.pathname.includes('tickets')
            ? 'Manage Tickets'
            : location.pathname.includes('recruitment')
            ? 'Club Recruitment'
            : location.pathname.includes('analytics')
            ? 'Analytics'
            : location.pathname.includes('history')
            ? 'Event History'
            : location.pathname.includes('calendar')
            ? 'Calendar'
            : location.pathname.includes('profile')
            ? 'Profile'
            : 'Dashboard'}
        </h1>
      </div>

      {/* Search (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-10">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="flex items-center space-x-4">
  {/* Notifications */}
  <div ref={notificationsRef} className="relative flex items-center justify-center">
    <button
      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
      className="flex items-center justify-center p-1 rounded-full hover:bg-neutral-100 transition-colors relative"
      aria-label="Notifications"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>

    {/* Notifications Dropdown */}
    {isNotificationsOpen && (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-10 animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900">Notifications</h3>
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Mark all as read
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 border-b border-neutral-100 ${
                  notification.read ? 'bg-white' : 'bg-primary-50'
                }`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm text-neutral-900">{notification.message}</p>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-neutral-500">No notifications</p>
          )}
        </div>
        <div className="p-3 text-center border-t border-neutral-200">
          <button className="text-sm text-primary-600 hover:text-primary-700">
            View all notifications
          </button>
        </div>
      </div>
    )}
  </div>

  {/* User */}
  <div className="flex items-center space-x-2">
    <div className="text-right">
      <div className="text-sm font-medium text-neutral-900">{user?.name}</div>
      <div className="text-xs text-neutral-500">
        {user?.role === 'president'
          ? `${user.clubName} President`
          : user?.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </div>
    </div>
    <div className="ml-2">
      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <User size={16} className="text-primary-700" />
        </div>
      )}
    </div>
  </div>
</div>


        {/* User Menu */}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in">
          <div className="absolute top-0 left-0 w-3/4 h-full bg-white shadow-lg animate-slide-up">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={20} className="text-primary-700" />
                </div>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-neutral-500">
                    {user?.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-neutral-100">
                  <User size={20} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-neutral-100 text-error-600"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;