import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Map, 
  Filter,
  Download
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedEvent, setSelectedEvent] = useState('all');
  
  // Sample events for filter
  const events = [
    { id: 'all', name: 'All Events' },
    { id: '1', name: 'Tech Symposium' },
    { id: '2', name: 'Coding Competition' },
    { id: '3', name: 'Tech Talk: AI Revolution' }
  ];

  // Sample data for statistics
  const stats = [
    {
      id: 1,
      name: 'Total Events',
      value: 12,
      change: '+20%',
      trend: 'up',
      icon: <Calendar size={20} className="text-primary-600" />,
    },
    {
      id: 2,
      name: 'Total Attendees',
      value: 1240,
      change: '+15%',
      trend: 'up',
      icon: <Users size={20} className="text-primary-600" />,
    },
    {
      id: 3,
      name: 'Average Attendance',
      value: 103,
      change: '-5%',
      trend: 'down',
      icon: <TrendingUp size={20} className="text-primary-600" />,
    },
    {
      id: 4,
      name: 'Revenue',
      value: '$4,280',
      change: '+18%',
      trend: 'up',
      icon: <CreditCard size={20} className="text-primary-600" />,
    },
  ];

  // Sample data for charts
  const monthlyAttendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendees',
        data: [165, 220, 190, 310, 290, 340],
        backgroundColor: 'rgba(107, 70, 193, 0.8)',
        borderColor: 'rgba(107, 70, 193, 1)',
        borderWidth: 1,
      },
    ],
  };

  const attendanceTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Tech Symposium',
        data: [120, 130, 125, 150, 160, 170, 180, 200],
        borderColor: 'rgba(14, 120, 249, 1)',
        backgroundColor: 'rgba(14, 120, 249, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Coding Competition',
        data: [70, 90, 85, 95, 100, 110, 115, 130],
        borderColor: 'rgba(255, 107, 74, 1)',
        backgroundColor: 'rgba(255, 107, 74, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const audienceBreakdownData = {
    labels: ['Students', 'Faculty', 'External', 'Alumni'],
    datasets: [
      {
        data: [65, 15, 10, 10],
        backgroundColor: [
          'rgba(107, 70, 193, 0.8)',
          'rgba(14, 120, 249, 0.8)',
          'rgba(255, 107, 74, 0.8)',
          'rgba(38, 198, 249, 0.8)',
        ],
        borderColor: [
          'rgba(107, 70, 193, 1)',
          'rgba(14, 120, 249, 1)',
          'rgba(255, 107, 74, 1)',
          'rgba(38, 198, 249, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-neutral-600">Track your events performance and metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              className="input appearance-none pr-10"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Filter size={16} className="text-neutral-400" />
            </div>
          </div>
          <div className="relative">
            <select
              className="input appearance-none pr-10"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Calendar size={16} className="text-neutral-400" />
            </div>
          </div>
          <button className="btn-outline flex items-center">
            <Download size={16} className="mr-2" />
            <span>Export</span>
          </button>
        </div>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Attendance */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Monthly Attendance</h2>
            <div className="text-sm text-neutral-600">
              {timeRange === '1m' ? 'Last Month' : 
               timeRange === '3m' ? 'Last 3 Months' : 
               timeRange === '6m' ? 'Last 6 Months' : 
               timeRange === '1y' ? 'Last Year' : 'All Time'}
            </div>
          </div>
          <div className="h-64">
            <Bar 
              data={monthlyAttendanceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} 
            />
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Attendance Trend</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-secondary-500 mr-1"></div>
                <span className="text-xs text-neutral-600">Tech Symposium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-accent-500 mr-1"></div>
                <span className="text-xs text-neutral-600">Coding Competition</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <Line 
              data={attendanceTrendData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audience Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-6">Audience Breakdown</h2>
          <div className="h-56 flex items-center justify-center">
            <Doughnut 
              data={audienceBreakdownData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 12,
                      padding: 20,
                    },
                  },
                },
              }} 
            />
          </div>
        </div>

        {/* Popular Venues */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-6">Popular Venues</h2>
          <div className="space-y-4">
            {[
              { name: 'Main Auditorium', events: 5, capacity: 300 },
              { name: 'Conference Hall', events: 3, capacity: 150 },
              { name: 'Seminar Room', events: 2, capacity: 80 },
              { name: 'Outdoor Grounds', events: 2, capacity: 500 },
            ].map((venue, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-primary-50 p-2 rounded-lg mr-4">
                  <Map size={20} className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium">{venue.name}</h3>
                    <span className="text-sm text-neutral-600">{venue.events} events</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(venue.events / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-6">Top Events by Attendance</h2>
          <div className="space-y-4">
            {[
              { name: 'Tech Symposium', attendees: 200, target: 180, percentage: 111 },
              { name: 'Cultural Festival', attendees: 180, target: 200, percentage: 90 },
              { name: 'Coding Competition', attendees: 130, target: 120, percentage: 108 },
              { name: 'Tech Talk: AI Revolution', attendees: 120, target: 150, percentage: 80 },
            ].map((event, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium">{event.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{event.attendees}</span>
                    <span className="text-xs text-neutral-500 ml-1">/{event.target}</span>
                  </div>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${
                      event.percentage >= 100 ? 'bg-success-500' : 
                      event.percentage >= 80 ? 'bg-warning-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${Math.min(event.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-right text-neutral-500">
                  {event.percentage}% of target
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;