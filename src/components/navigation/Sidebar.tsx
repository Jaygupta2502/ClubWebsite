import { NavLink, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  ClipboardList,
  BarChart3,
  TicketIcon,
  Users,
  LayoutDashboard,
  Clock,
  CheckSquare,
  Building,
  BookOpen,
  Award,
  User,
  LogOut,
  ChevronDown,
  Settings,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';

type SidebarProps = {
  role: 'president' | 'venue_coordinator' | 'faculty' | 'hod' | 'dean' | 'director';
};

const Sidebar = ({ role }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        path: `/dashboard/${role.replace('_', '-')}`,
        icon: <LayoutDashboard size={20} />,
      },
      {
        name: 'Calendar',
        path: `/dashboard/${role.replace('_', '-')}/calendar`,
        icon: <Calendar size={20} />,
      },
    ];

    if (role === 'president') {
      return [
        ...baseItems,
        {
          name: 'Create Event',
          path: '/dashboard/president/create-event',
          icon: <ClipboardList size={20} />,
        },
        {
  name: 'Flagship Event',
  path: '/dashboard/president/flagship-event',
  icon: <Award size={20} />,
},


                {
          name: 'Club Recruitment',
          path: '/dashboard/president/recruitment',
          icon: <UserPlus size={20} />,
        },


        {
          name: 'Analytics',
          path: '/dashboard/president/analytics',
          icon: <BarChart3 size={20} />,
        },
        {
          name: 'Event History',
          path: '/dashboard/president/history',
          icon: <Clock size={20} />,
        },
      ];
    } else if (role === 'venue_coordinator') {
      return [
        ...baseItems,
        {
          name: 'Pending Approvals',
          path: '/dashboard/venue-coordinator/approvals',
          icon: <CheckSquare size={20} />,
        },
     
      ];
   } else if (role === 'faculty') {
  return [
    ...baseItems,
    {
      name: 'Pending Approvals',
      path: '/dashboard/faculty/pending-approvals',
      icon: <CheckSquare size={20} />,
    },
    {
      name: 'Event History',
      path: '/dashboard/faculty/history',
      icon: <Clock size={20} />,
    },
  ];
    } else if (role === 'hod') {
  return [
    ...baseItems,
    {
      name: 'Pending Approvals',
      path: '/dashboard/hod/pending-approvals',
      icon: <CheckSquare size={20} />,
    },
    {
      name: 'Event History',
      path: '/dashboard/hod/history',
      icon: <Clock size={20} />,
    },
  ];
    } else if (role === 'dean') {
      return [
        ...baseItems,
        {
          name: 'College Events',
          path: '/dashboard/dean/events',
          icon: <Calendar size={20} />,
        },
        {
          name: 'Department Overview',
          path: '/dashboard/dean/departments',
          icon: <Building size={20} />,
        },
      ];
    } else if (role === 'director') {
      return [
        ...baseItems,
        {
          name: 'Institution Overview',
          path: '/dashboard/director/overview',
          icon: <Award size={20} />,
        },
        
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const getRoleTitle = () => {
    switch (role) {
      case 'president':
        return 'Club President';
      case 'venue_coordinator':
        return 'Venue Coordinator';
      case 'faculty':
        return 'Faculty';
      case 'hod':
        return 'Head of Department';
      case 'dean':
        return 'Dean';
      case 'director':
        return 'Director';
      default:
        return 'User';
    }
  };

  return (
    <aside className="bg-primary-950 text-white w-64 flex-shrink-0 hidden md:block h-screen overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Calendar size={24} className="text-accent-500" />
          <span className="text-xl font-bold">Campus Events</span>
        </div>

    {/* User Profile */}
        <div className="mb-8">
          <div
            className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-primary-900"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center">
                <User size={20} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.name}</div>
              <div className="text-xs text-neutral-400 truncate">{getRoleTitle()}</div>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {isProfileOpen && (
            <div className="mt-2 bg-primary-900 rounded-lg p-2 animate-fade-in">
              <button
                className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-primary-800 text-left"
                onClick={() => navigate(`/dashboard/${role.replace('_', '-')}/profile`)}
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-primary-800 text-left text-error-400"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-900 text-accent-400'
                        : 'text-neutral-300 hover:bg-primary-900 hover:text-white'
                    }`
                  }
                  end={item.path.includes('/dashboard') && item.path.split('/').length === 3}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>


      {/* Logout Button */}
      <div className="p-4 border-t border-primary-900 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-neutral-300 hover:bg-primary-900 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;