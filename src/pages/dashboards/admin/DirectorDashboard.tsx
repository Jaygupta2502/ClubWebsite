import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Building,
  Users,
  Award,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  BookOpen,
} from 'lucide-react';

const DirectorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Sample data for demo
  const stats = [
    {
      id: 1,
      name: 'Total Colleges',
      value: 5,
      change: '+1',
      trend: 'up',
      icon: <Building size={20} className="text-primary-600" />,
    },
    {
      id: 2,
      name: 'Total Departments',
      value: 28,
      change: '+3',
      trend: 'up',
      icon: <BookOpen size={20} className="text-primary-600" />,
    },
    {
      id: 3,
      name: 'Total Students',
      value: '12,450',
      change: '+520',
      trend: 'up',
      icon: <Users size={20} className="text-primary-600" />,
    },
    {
      id: 4,
      name: 'Placement Rate',
      value: '92%',
      change: '-2%',
      trend: 'down',
      icon: <Award size={20} className="text-primary-600" />,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Annual Convocation',
      date: 'July 30, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Main Campus Grounds',
      status: 'Approved',
    },
    {
      id: 2,
      title: 'Board of Directors Meeting',
      date: 'June 25, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Conference Hall',
      status: 'Approved',
    },
    {
      id: 3,
      title: 'Industry-Academia Conclave',
      date: 'August 15, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Convention Center',
      status: 'Pending',
    },
  ];

  const colleges = [
    {
      id: 1,
      name: 'MIT ENGINEERING AND SCIENCESHome',
      dean: 'Dr. Rajni Sachdeo',
      departments: 2,
      faculty: 100,
      students: 2450,
      performance: 92,
    },

    {
      id: 2,
      name: 'MITCOM',
      dean: 'Prof. Sunita Mangesh Karad',
      departments: 2,
      faculty: 62,
      students: 1820,
      performance: 89,
    },
    {
      id: 3,
      name: 'MIT ART FINE ART AND PERFORMING ART',
      dean: 'Dr. Prof. Milind Dhobley',
      departments: 2,
      faculty: 75,
      students: 2100,
      performance: 90,
    },
    {
      id: 4,
      name: 'MIT DESIGN',
      dean: 'Dr. Anant Chakradeo',
      departments: 2,
      faculty: 95,
      students: 3200,
      performance: 86,
    },
    {
      id: 5,
      name: 'MIT MARITIME STUDIES',
      dean: 'Capt. Prerit Misra',
      departments: 1,
      faculty: 110,
      students: 2880,
      performance: 94,
    },
        {
      id: 6,
      name: 'MIT TECHNOLOGY',
      dean: 'Prof. (Dr.) Vasant N. Pawar',
      departments: 2,
      faculty: 110,
      students: 2880,
      performance: 94,
    },
        {
      id: 7,
      name: 'MIT HUMANITIES AND SOCIAL SCIENCES',
      dean: 'Dr. Asawari Bhave',
      departments: 4,
      faculty: 110,
      students: 2880,
      performance: 94,
    },
  ];

  const recentUpdates = [
    {
      id: 1,
      title: 'New Research Grant Approved',
      college: 'College of Science',
      date: '3 days ago',
      amount: '$2.5 million',
      status: 'Approved',
    },
    {
      id: 2,
      title: 'International Partnership with Oxford University',
      college: 'College of Engineering',
      date: '1 week ago',
      status: 'Finalized',
    },
    {
      id: 3,
      title: 'Campus Expansion Project',
      college: 'Institution-wide',
      date: '2 weeks ago',
      status: 'In Progress',
    },
    {
      id: 4,
      title: 'New Curriculum Framework',
      college: 'All Colleges',
      date: '3 weeks ago',
      status: 'Implemented',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Approved</span>;
      case 'Pending':
        return <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
      case 'Finalized':
        return <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">Finalized</span>;
      case 'In Progress':
        return <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">In Progress</span>;
      case 'Implemented':
        return <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Implemented</span>;
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
          Oversee all institutional activities from your executive dashboard
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
        {/* College Performance */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">College Performance Overview</h2>
              <Link
                to="/dashboard/director/colleges"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View details
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Dean
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Departments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {colleges.map((college) => (
                    <tr key={college.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{college.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {college.dean}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {college.departments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {college.students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-neutral-200 rounded-full h-2 mr-2 flex-grow max-w-[100px]">
                            <div 
                              className={`h-2 rounded-full ${getPerformanceColor(college.performance)}`} 
                              style={{ width: `${college.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{college.performance}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <Link
                to="/dashboard/director/calendar"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View calendar
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{event.title}</h3>
                    {getStatusBadge(event.status)}
                  </div>
                  <div className="flex flex-wrap gap-y-1">
                    <div className="text-xs text-neutral-500 flex items-center mr-3">
                      <Calendar size={12} className="mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center mr-3">
                      <Clock size={12} className="mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Updates & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Updates */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-lg font-semibold mb-6">Recent Updates</h2>
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div
                  key={update.id}
                  className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{update.title}</h3>
                    {getStatusBadge(update.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{update.college}</span>
                    <span>{update.date}</span>
                  </div>
                  {update.amount && (
                    <div className="mt-2 text-sm font-medium text-primary-600">
                      {update.amount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <h2 className="text-lg font-semibold mb-6">Key Performance Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Academic Excellence</h3>
                    <span className="text-sm text-success-600 font-medium">+5%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    87% of programs received excellent ratings
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Research Output</h3>
                    <span className="text-sm text-success-600 font-medium">+12%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                    <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    82% increase in published research
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Student Satisfaction</h3>
                    <span className="text-sm text-warning-600 font-medium">+2%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    78% student satisfaction score
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Industry Partnerships</h3>
                    <span className="text-sm text-success-600 font-medium">+15%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                    <div className="bg-accent-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    90% increase in industry collaborations
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">International Recognition</h3>
                    <span className="text-sm text-success-600 font-medium">+8%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    85% improvement in global rankings
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Financial Sustainability</h3>
                    <span className="text-sm text-success-600 font-medium">+7%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    95% budget optimization achieved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Initiatives */}
      <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-100">
        <h2 className="text-lg font-semibold mb-4 text-primary-900">Strategic Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
                <CheckCircle size={16} className="text-warning-600" />
              </div>
              <div>
                <p className="font-medium">Campus Expansion Project</p>
                <p className="text-sm text-neutral-600">Phase 2 scheduled to begin next month</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
                <CheckCircle size={16} className="text-warning-600" />
              </div>
              <div>
                <p className="font-medium">Curriculum Modernization</p>
                <p className="text-sm text-neutral-600">Implementation across all colleges in progress</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
                <CheckCircle size={16} className="text-warning-600" />
              </div>
              <div>
                <p className="font-medium">Research Excellence Initiative</p>
                <p className="text-sm text-neutral-600">Second round of funding approved</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
                <CheckCircle size={16} className="text-warning-600" />
              </div>
              <div>
                <p className="font-medium">Global Partnership Program</p>
                <p className="text-sm text-neutral-600">5 new international universities onboarded</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
                <CheckCircle size={16} className="text-warning-600" />
              </div>
              <div>
                <p className="font-medium">Digital Transformation</p>
                <p className="text-sm text-neutral-600">Phase 1 implementation 75% complete</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
                <CheckCircle size={16} className="text-warning-600" />
              </div>
              <div>
                <p className="font-medium">Sustainability Initiative</p>
                <p className="text-sm text-neutral-600">Carbon neutrality target on track for 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorDashboard;