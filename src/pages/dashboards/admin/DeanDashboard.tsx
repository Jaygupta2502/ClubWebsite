import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ManageHods from './ManageHods';
import {
  Building,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';

const DeanDashboard: React.FC = () => {
  const { user } = useAuth();

  // Sample data for demo
  const stats = [
    {
      id: 1,
      name: 'Total Departments',
      value: 6,
      change: '+1',
      trend: 'up',
      icon: <Building size={20} className="text-primary-600" />,
    },
    {
      id: 2,
      name: 'Total Faculty',
      value: 86,
      change: '+4',
      trend: 'up',
      icon: <BookOpen size={20} className="text-primary-600" />,
    },
    {
      id: 3,
      name: 'Total Students',
      value: '2,450',
      change: '+120',
      trend: 'up',
      icon: <Users size={20} className="text-primary-600" />,
    },
    {
      id: 4,
      name: 'Event Participation',
      value: '68%',
      change: '-3%',
      trend: 'down',
      icon: <Calendar size={20} className="text-primary-600" />,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'College Annual Day',
      date: 'June 30, 2025',
      time: '10:00 AM - 6:00 PM',
      location: 'College Auditorium',
      department: 'College Administration',
      status: 'Approved',
    },
    {
      id: 2,
      title: 'Tech Symposium',
      date: 'June 15, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Main Auditorium',
      department: 'Computer Science',
      status: 'Approved',
    },
    {
      id: 3,
      title: 'Business Summit',
      date: 'July 5, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Conference Hall',
      department: 'Business Administration',
      status: 'Pending',
    },
    {
      id: 4,
      title: 'Engineering Expo',
      date: 'July 12, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Engineering Block',
      department: 'Mechanical Engineering',
      status: 'Approved',
    },
  ];

  const departments = [
    {
      id: 1,
      name: 'Computer Science & Engineering(cc)',
      hod: 'Prof Dr. Ganesh Pathak',
      faculty: 16,
      students: 450,
      events: 28,
      performance: 92,
    },
    {
      id: 2,
      name: 'Computer Science & Engineering(AIA)',
      hod: 'Dr. Jayashree Rajesh Prasad',
      faculty: 14,
      students: 380,
      events: 18,
      performance: 86,
    },
    {
      id: 3,
      name: 'Computer Science & Engineering(Csf)',
      hod: 'Dr. Nagesh Narayan Jadhav',
      faculty: 18,
      students: 420,
      events: 22,
      performance: 88,
    },
    {
      id: 4,
      name: 'Computer Science & Engineering',
      hod: 'Dr. Shraddha Phansalkar',
      faculty: 15,
      students: 400,
      events: 20,
      performance: 85,
    },
    {
      id: 5,
      name: 'Computer Science & Engineering(EEE)',
      hod: 'Dr. Ramesh Mali',
      faculty: 12,
      students: 350,
      events: 15,
      performance: 82,
    },
    {
      id: 6,
      name: 'Computer Science & Engineering(PG & FY)',
      hod: 'Dr. Dipti Patil',
      faculty: 11,
      students: 450,
      events: 12,
      performance: 78,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Approved</span>;
      case 'Pending':
        return <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'bg-success-500';
    if (performance >= 80) return 'bg-primary-500';
    if (performance >= 70) return 'bg-warning-500';
    return 'bg-error-500';
  };

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-neutral-600">
          Oversee college departments and activities from your dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="card card-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary-50 p-2 rounded-lg">{stat.icon}</div>
              <div
                className={`flex items-center ${
                  stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                }`}
              >
                <span className="text-sm font-medium">{stat.change}</span>
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={16} className="ml-1" />
                ) : (
                  <ArrowDownRight size={16} className="ml-1" />
                )}
              </div>
            </div>
            <h3 className="text-sm text-neutral-600 mb-1">{stat.name}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Upcoming College Events</h2>
              <Link
                to="/dashboard/dean/events"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-primary-600 font-medium">
                        {event.date.split(' ')[0]}
                      </span>
                      <span className="text-sm font-bold text-primary-700">
                        {event.date.split(' ')[1].replace(',', '')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate">{event.title}</h3>
                    <div className="flex flex-wrap gap-y-1">
                      <div className="text-xs text-neutral-500 flex items-center mr-3">
                        <Clock size={12} className="mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center mr-3">
                        <MapPin size={12} className="mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center">
                        <Building size={12} className="mr-1" />
                        <span>{event.department}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(event.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* College Metrics */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-lg font-semibold mb-6">College Performance</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Overall Performance</h3>
                  <span className="text-sm text-success-600 font-medium">+5%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="text-xs text-neutral-500">
                  85% overall performance rating
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Student Satisfaction</h3>
                  <span className="text-sm text-success-600 font-medium">+8%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                  <div className="bg-success-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <div className="text-xs text-neutral-500">
                  88% student satisfaction rate
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Faculty Retention</h3>
                  <span className="text-sm text-success-600 font-medium">+3%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                  <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="text-xs text-neutral-500">
                  92% faculty retention rate
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Research Publications</h3>
                  <span className="text-sm text-warning-600 font-medium">+2%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                  <div className="bg-warning-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
                <div className="text-xs text-neutral-500">
                  76% of target research output
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Industry Partnerships</h3>
                  <span className="text-sm text-success-600 font-medium">+12%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                  <div className="bg-accent-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <div className="text-xs text-neutral-500">
                  82% increase in industry collaborations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Department Overview</h2>
          <Link
            to="/dashboard/dean/departments"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all departments
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  HOD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Faculty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {departments.map((department) => (
                <tr key={department.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{department.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {department.hod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {department.faculty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {department.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {department.events}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-neutral-200 rounded-full h-2 mr-2 flex-grow max-w-[100px]">
                        <div 
                          className={`h-2 rounded-full ${getPerformanceColor(department.performance)}`} 
                          style={{ width: `${department.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{department.performance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Items */}
      <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-100">
        <h2 className="text-lg font-semibold mb-4 text-primary-900">Action Items</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
              <CheckCircle size={16} className="text-warning-600" />
            </div>
            <div>
              <p className="font-medium">Review Annual Department Reports</p>
              <p className="text-sm text-neutral-600">Due in 2 weeks</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
              <CheckCircle size={16} className="text-warning-600" />
            </div>
            <div>
              <p className="font-medium">Approve College Annual Day Budget</p>
              <p className="text-sm text-neutral-600">Pending your approval</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
              <CheckCircle size={16} className="text-warning-600" />
            </div>
            <div>
              <p className="font-medium">HOD Performance Review Meeting</p>
              <p className="text-sm text-neutral-600">Scheduled for next Thursday</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
              <CheckCircle size={16} className="text-warning-600" />
            </div>
            <div>
              <p className="font-medium">New Curriculum Review</p>
              <p className="text-sm text-neutral-600">5 departments pending approval</p>
            </div>
          </div>
        </div>
      </div>
      <ManageHods />
    </div>
  );
};

export default DeanDashboard;