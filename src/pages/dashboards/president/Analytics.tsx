import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useCallback } from "react";
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

  // 🔥 States for backend data
  const [events, setEvents] = useState([{ id: "all", name: "All Events" }]);
  const [stats, setStats] = useState([]);
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState(null);
  const [attendanceTrendData, setAttendanceTrendData] = useState(null);
  const [audienceBreakdownData, setAudienceBreakdownData] = useState(null);
  const [popularVenues, setPopularVenues] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch analytics whenever filters change
  // 🔥 Auto-refresh analytics every 5 seconds
// 🔄 Auto-refresh every 20 minutes
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      await fetchAnalytics();
    } catch (err) {
      console.log("Backend unreachable during auto-refresh.");
    }
  }, 8000);// 20 minutes in ms

  return () => clearInterval(interval);
}, [selectedEvent, timeRange]);


  const fetchAnalytics = useCallback(async () => {
  try {
    setLoading(true);
    const res = await axios.get("https://clubwebsite-backend.onrender.com/api/analytics", {
      params: { eventId: selectedEvent, range: timeRange }
    });

    const data = res.data;

    // (keep your existing logic here unchanged)
    setStats(data.stats);
    setMonthlyAttendanceData({
      labels: data.monthlyAttendance.map(m => m.month),
      datasets: [{
        label: "Attendees",
        data: data.monthlyAttendance.map(m => m.attendees),
        backgroundColor: "rgba(107, 70, 193, 0.8)"
      }]
    });

    setAttendanceTrendData({
      labels: data.attendanceTrend.labels,
      datasets: Object.keys(data.attendanceTrend.data).map((eventName, i) => ({
        label: eventName,
        data: data.attendanceTrend.data[eventName],
        borderColor: i === 0 ? "rgba(14,120,249,1)" : "rgba(255,107,74,1)",
        backgroundColor: i === 0 ? "rgba(14,120,249,0.1)" : "rgba(255,107,74,0.1)",
        fill: true
      }))
    });

    setAudienceBreakdownData({
      labels: ["Students", "Faculty", "External", "Alumni"],
      datasets: [{
        data: [
          data.audienceBreakdown.students,
          data.audienceBreakdown.faculty,
          data.audienceBreakdown.external,
          data.audienceBreakdown.alumni
        ],
        backgroundColor: [
          "rgba(107, 70, 193, 0.8)",
          "rgba(14, 120, 249, 0.8)",
          "rgba(255, 107, 74, 0.8)",
          "rgba(38, 198, 249, 0.8)",
        ]
      }]
    });

    setPopularVenues(data.popularVenues);
    setTopEvents(data.topEvents);
    setEvents([{ id: "all", name: "All Events" }, ...data.eventList]);

    setLoading(false);
  } catch (err) {
    console.error("Analytics error:", err);
    setLoading(false);
  }
}, [selectedEvent, timeRange]);


  if (loading || !monthlyAttendanceData || !attendanceTrendData || !audienceBreakdownData) {
    return <div className="text-center py-10 text-lg font-semibold">Loading analytics...</div>;
  }

  return (
    <div>
      {/* Top filter bar */}
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
        {stats.map((stat: any, index) => (
          <div key={index} className="card card-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary-50 p-2 rounded-lg">{stat.icon}</div>
              <div className={`flex items-center ${stat.trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
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
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Monthly Attendance</h2>
          </div>
          <div className="h-64">
            <Bar 
              data={monthlyAttendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }},
                scales: { y: { beginAtZero: true }}
              }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Attendance Trend</h2>
          </div>
          <div className="h-64">
            <Line 
              data={attendanceTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true }},
                scales: { y: { beginAtZero: true }}
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
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
                plugins: { legend: { position: 'right' }}
              }}
            />
          </div>
        </div>

        {/* Popular Venues */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-6">Popular Venues</h2>
          <div className="space-y-4">
            {popularVenues.map((venue: any, index) => (
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
                      style={{ width: `${(venue.events / venue.maxEvents) * 100}%` }}
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
            {topEvents.map((event: any, index) => (
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
                      event.percentage >= 80 ? 'bg-warning-500' : 
                      'bg-error-500'
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
