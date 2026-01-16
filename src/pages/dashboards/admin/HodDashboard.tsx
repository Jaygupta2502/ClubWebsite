import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import PendingEventsHOD from './PendingEventsHOD';
import EventHistoryHOD from './EventHistoryHOD';
import {
  Users,
  BookOpen,
  Building,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  MapPin,
  Filter,
  Plus,
  Trash2,
  Edit,
  Search,
  UserPlus,
  Settings,
  TrendingUp,
  Award,
  FileText,
  Download,
  History,
  AlertTriangle,
} from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js';

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

const HodDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showAddModal, setShowAddModal] = useState<'club' | 'faculty' | 'coordinator' | null>(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [managementTab, setManagementTab] = useState('active');
  const [clubs, setClubs] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [editModalData, setEditModalData] = useState<any | null>(null); // for open edit modal
  const [inactiveUsers, setInactiveUsers] = useState({ inactiveClubs: [], inactiveFaculty: [] });
  const [faculty, setFaculty] = useState([]);
  const [stats, setStats] = useState([]);
  const [clubReports, setClubReports] = useState([]);
  const [selectedReportEvent, setSelectedReportEvent] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
const [showReportModal, setShowReportModal] = useState(false);
const API = import.meta.env.VITE_API_BASE_URL;



  useEffect(() => {
  const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;

  const fetchClubs = async () => {

  try {
    
    const res = await fetch(`${API}/api/hod/clubs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch clubs");

    const data = await res.json();
    setClubs(data);
  } catch (error) {
    console.error("Error fetching clubs:", error);
  }
};



  fetchClubs();
}, []);

useEffect(() => {
  const fetchFaculty = async () => {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;

    const res = await fetch(`${API}/api/hod/faculty`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setFaculty(data);
  };

  fetchFaculty();
}, []);

useEffect(() => {
  if (activeTab !== 'event_history') return;

  const fetchUpcomingEvents = async () => {
    const token = JSON.parse(
      localStorage.getItem('campusEventsUser') || '{}'
    )?.token;

    try {
      const res = await fetch(`${API}/api/events/hod/upcoming-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Fetch failed');

      const data = await res.json();
      setUpcomingEvents(data);
    } catch (err) {
      console.error('❌ Fetch upcoming events failed:', err);
    }
  };

  fetchUpcomingEvents();
}, [activeTab]);
const handleDeleteEventPermanently = async (eventId: string) => {
  if (!confirm('⚠️ This will permanently delete the event. Continue?')) return;

  const token = JSON.parse(
    localStorage.getItem('campusEventsUser') || '{}'
  )?.token;

  try {
    const res = await fetch(`${API}/api/events/hod/delete/${eventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      alert('❌ ' + err.message);
      return;
    }

    setUpcomingEvents(prev => prev.filter(e => e._id !== eventId));
    alert('✅ Event permanently deleted');
  } catch (err) {
    alert('❌ Server error');
  }
};
useEffect(() => {
  const fetchReports = async () => {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;

    if (!token) {
      console.error("❌ No token found in localStorage");
      return;
    }

    try {
     const res = await fetch(`${API}/api/events/with-reports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Failed to fetch reports:", errText);
        return;
      }

      const data = await res.json();
      console.log("📦 HOD fetched reports:", data);
      setClubReports(data);
    } catch (err) {
      console.error("❌ Error fetching reports:", err);
    }
  };

  fetchReports();
}, []);

useEffect(() => {
  const fetchAnalytics = async () => {
    const token = JSON.parse(
      localStorage.getItem("campusEventsUser") || "{}"
    )?.token;

    const res = await fetch(`${API}/api/hod/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setAnalyticsData(data);
  };

  fetchAnalytics();
}, []);

const [statsData, setStatsData] = useState({
  activeClubs: 0,
  activeFaculty: 0,
  totalEvents: 0,
});

const fetchStats = async () => {
  const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;

  try {
    const res = await fetch(`${API}/api/hod/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch stats");

    const data = await res.json();
    setStats([
  {
    id: 'activeClubs',
    name: 'Active Clubs',
    value: data.activeClubs,
    icon: <Users size={20} />,
    trend: 'up'
  },
  {
    id: 'activeFaculty',
    name: 'Active Faculty',
    value: data.activeFaculty,
    icon: <UserPlus size={20} />,
    trend: 'up'
  },
  {
    id: 'totalEvents',
    name: 'Total Events',
    value: data.totalEvents,
    icon: <Calendar size={20} />,
    trend: 'up'
  }
]);
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};
useEffect(() => {
  fetchStats();
}, []);


useEffect(() => {
  const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;

  const fetchInactiveUsers = async () => {
    try {
      const res = await fetch(`${API}/api/hod/inactive-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch inactive users");

      const data = await res.json();
      setInactiveUsers(data);
    } catch (error) {
      console.error("Error fetching inactive users:", error);
    }
  };

  fetchInactiveUsers();
}, []);



  const [clubForm, setClubForm] = useState({
    name: '',
    email: '',
    password: '',
    clubName: '',

  });

  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    clubAssigned: ''
  });


  

  // Sample data for management
  const managementData = {
    activeClubs: [
      { id: 1, name: 'Aces Club', president: 'Alex Johnson', events: 12, members: 150, department: 'Computer Science', status: 'Active' },
      { id: 2, name: 'IEEE STB Club', president: 'Sarah Wilson', events: 8, members: 120, department: 'Arts', status: 'Active' },
      { id: 3, name: 'Swift Club', president: 'Mike Brown', events: 15, members: 200, department: 'Physical Education', status: 'Active' },
      { id: 4, name: 'Ignite', president: 'Emma Davis', events: 10, members: 85, department: 'Business', status: 'Active' },
      { id: 5, name: 'AWS', president: 'James Wilson', events: 6, members: 60, department: 'Arts', status: 'Active' },
    ],
    inactiveClubs: [
      { id: 6, name: 'Robotics Club', president: 'John Doe', events: 5, members: 45, department: 'Engineering', status: 'Inactive', lastActive: '2024-12-15' },
      { id: 7, name: 'Drama Club', president: 'Jane Smith', events: 3, members: 30, department: 'Arts', status: 'Inactive', lastActive: '2024-11-20' },
    ],
    activeFaculty: [
      { id: 1, name: 'Dr. John Smith', role: 'Professor', specialization: 'AI & ML', department: 'Computer Science', experience: '10 years', status: 'Active' },
      { id: 2, name: 'Dr. Emily Brown', role: 'Associate Professor', specialization: 'Networks', department: 'Computer Science', experience: '8 years', status: 'Active' },
      { id: 3, name: 'Dr. Michael Johnson', role: 'Assistant Professor', specialization: 'Database Systems', department: 'Computer Science', experience: '5 years', status: 'Active' },
      { id: 4, name: 'Dr. Sarah Davis', role: 'Professor', specialization: 'Software Engineering', department: 'Computer Science', experience: '12 years', status: 'Active' },
    ],
    inactiveFaculty: [
      { id: 5, name: 'Dr. Robert Wilson', role: 'Professor', specialization: 'Data Mining', department: 'Computer Science', experience: '15 years', status: 'Inactive', lastActive: '2024-10-30' },
    ],
    activeCoordinators: [
      { id: 1, name: 'James Wilson', venue: 'Main Auditorium', experience: '5 years', department: 'Administration', status: 'Active' },
      { id: 2, name: 'Lisa Chen', venue: 'Conference Hall', experience: '3 years', department: 'Administration', status: 'Active' },
      { id: 3, name: 'Robert Taylor', venue: 'Computer Lab', experience: '4 years', department: 'Computer Science', status: 'Active' },
    ],
    inactiveCoordinators: [
      { id: 4, name: 'Mark Johnson', venue: 'Sports Complex', experience: '6 years', department: 'Sports', status: 'Inactive', lastActive: '2024-09-15' },
    ]
  };

  // Sample club history and reports data



  // Sample stats
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;

  let url = '';
  let body = {};

  if (showAddModal === 'club') {
    url = `${API}/api/hod/create-club-user`;
;
    body = clubForm;
  } else if (showAddModal === 'faculty') {
    url = `${API}/api/hod/create-faculty-user`;
    body = facultyForm;
  } else {
    return;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      alert(`${showAddModal === 'club' ? 'Club' : 'Faculty'} added successfully!`);
      setShowAddModal(null);
      setClubForm({ name: '', email: '', password: '', clubName: '' });
      setFacultyForm({ name: '', email: '', password: '', department: '', specialization: '', experience: '',clubAssigned: '' });
    } else {
      alert('❌ Error: ' + data.message);
    }
  } catch (err) {
    alert('❌ Server error');
  }
};

const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const id = editModalData?._id;

  try {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
    const res = await fetch(`${API}/api/hod/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editModalData)
    });

    const updated = await res.json();

    if (res.ok) {
      alert('✅ Updated successfully!');
      if (editModalData.role === 'club_president') {
        setClubs(clubs.map((c) => (c._id === id ? updated : c)));
      } else if (editModalData.role === 'faculty') {
        setFacultyList(facultyList.map((f) => (f._id === id ? updated : f)));
      }
      setEditModalData(null);
    } else {
      alert('❌ ' + updated.message);
    }
  } catch (err) {
    alert('❌ Server error');
  }
};


  const handleDelete = async (type: string, id: string) => {
  if (!confirm(`Are you sure you want to delete this ${type}?`)) return;



  try {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
    const res = await fetch(`${API}/api/hod/user/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      alert(`${type} deleted successfully`);
      if (type === 'club') {
  setClubs(clubs.filter((club) => club._id !== id));
  fetchStats(); // ✅ update stats
} else if (type === 'faculty') {
  setFacultyList(facultyList.filter((f) => f._id !== id));
  fetchStats(); // ✅ update stats immediately
}
    } else {
      const data = await res.json();
      alert('❌ Delete failed: ' + data.message);
    }
  } catch (err) {
    alert('❌ Server error during deletion');
  }
};

const eventsByClubChart = {
  labels: analyticsData?.eventsByClub.map(e => e._id),
  datasets: [{
    label: "Number of Events",
    data: analyticsData?.eventsByClub.map(e => e.count),
    backgroundColor: "#6B46C1"
  }]
};

const participationTrendChart = {
  labels: analyticsData?.participationTrend.map(p => p._id),
  datasets: [{
    label: "Participants",
    data: analyticsData?.participationTrend.map(p => p.participants),
    borderColor: "#6B46C1",
    fill: true
  }]
};

const venueUtilizationChart = {
  labels: analyticsData?.venueUtilization.map(v => v._id),
  datasets: [{
    data: analyticsData?.venueUtilization.map(v => v.count),
    backgroundColor: ["#6B46C1", "#0E78F9", "#22C55E", "#F59E0B"]
  }]
};


  const filteredReports = clubReports.filter((report) => {
  const clubMatch = selectedClub === 'all' || report.club === selectedClub;
  const semesterMatch = selectedSemester === 'all' || report.semester === selectedSemester;
  const yearMatch = selectedYear === 'all' || report.date?.includes(selectedYear); // assuming date contains year
  return clubMatch && semesterMatch && yearMatch;
});

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-neutral-600">Manage your department's activities and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="card card-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary-50 p-2 rounded-lg">{stat.icon}</div>
              <div
                className={`flex items-center ${
                  stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                }`}
              >
              </div>
            </div>
            <h3 className="text-sm text-neutral-600 mb-1">{stat.name}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <div className="flex items-center">
                <BarChart3 size={18} className="mr-2" />
                Analytics
              </div>
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'management'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('management')}
            >
              <div className="flex items-center">
                <Settings size={18} className="mr-2" />
                Management
              </div>
            </button>
            <button
  className={`py-4 px-2 border-b-2 font-medium text-sm ${
    activeTab === 'event_history'
      ? 'border-primary-500 text-primary-600'
      : 'border-transparent text-neutral-500 hover:text-neutral-700'
  }`}
  onClick={() => setActiveTab('event_history')}
>
  <div className="flex items-center">
    <History size={18} className="mr-2" />
    Upcoming Event
  </div>
</button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              <div className="flex items-center">
                <FileText size={18} className="mr-2" />
                Club History & Reports
              </div>
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('calendar')}
            >
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                Calendar
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'analytics' && analyticsData && (
            <div>
              {/* Analytics Filters */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Department Analytics</h2>
                <div className="flex flex-wrap gap-4">
                  <select 
                    className="input"
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                  >
                    <option value="all">All Clubs</option>
                    {clubs.map(club => (
  <option key={club._id} value={club.clubName}>
    {club.clubName}
  </option>
))}
                  </select>
                  <select 
                    className="input"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                  >
                    <option value="all">All Semesters</option>
                    <option value="Fall">1st</option>
                    <option value="Spring">2nd</option>
                    <option value="Summer">3rd</option>
                    <option value="Summr">4th</option>
                  </select>
                  <select 
                    className="input"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {[2025, 2024, 2023, 2022].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <button className="btn-primary">
                    Apply Filters
                  </button>
                  <button className="btn-outline flex items-center">
                    <Download size={16} className="mr-2" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Events by Club</h3>
                  <div className="h-64">
                    <Bar data={eventsByClubChart} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Participation Trend</h3>
                  <div className="h-64">
                    <Line data={participationTrendChart} options={chartOptions} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Venue Utilization</h3>
                  <div className="h-64">
                    <Doughnut data={venueUtilizationChart} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Department Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Event Success Rate</span>
                        <span className="text-sm text-success-600 font-medium">92%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-success-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Student Engagement</span>
                        <span className="text-sm text-primary-600 font-medium">85%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Faculty Participation</span>
                        <span className="text-sm text-secondary-600 font-medium">78%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Resource Utilization</span>
                        <span className="text-sm text-accent-600 font-medium">88%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-accent-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

         {activeTab === 'event_history' && (
  <div>
    <h2 className="text-lg font-semibold mb-6">Upcoming Approved Events</h2>

    {upcomingEvents.length === 0 && (
      <p className="text-neutral-600">No upcoming approved events.</p>
    )}

    <div className="space-y-4">
      {upcomingEvents.map(event => (
        <div
          key={event._id}
          className="p-4 bg-white border border-neutral-200 rounded-lg flex justify-between"
        >
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-neutral-600">
              {event.date} | {event.startTime} - {event.endTime}
            </p>
            <p className="text-sm text-neutral-600">Venue: {event.venue}</p>
            <p className="text-sm text-neutral-600">Club: {event.club}</p>
          </div>

          <button
            className="btn-outline text-error-600 border-error-300"
            onClick={() => handleDeleteEventPermanently(event._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
)}


          {activeTab === 'management' && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Department Management</h2>
              
              {/* Management Tabs */}
              <div className="flex space-x-4 mb-6">
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    managementTab === 'active' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  onClick={() => setManagementTab('active')}
                >
                  Active Management
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    managementTab === 'inactive' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                  onClick={() => setManagementTab('inactive')}
                >
                  Inactive Management
                </button>
              </div>

              {managementTab === 'active' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Active Clubs Management */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Active Clubs</h3>
                      <button 
                        className="btn-outline flex items-center"
                        onClick={() => setShowAddModal('club')}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Club
                      </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {clubs.map(club => (
                        <div key={club._id} className="p-4 bg-white border border-neutral-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{club.clubName}</h4>
                              <p className="text-sm text-neutral-600">President: {club.name}</p>
                              <p className="text-sm text-neutral-600">Department: {club.department}</p>
                              <div className="flex gap-4 mt-2 text-sm text-neutral-600">
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
  className="p-1 hover:bg-neutral-100 rounded"
  onClick={() => setEditModalData({ ...club, role: 'club_president' })}
>
  <Edit size={16} />
</button>
                              <button 
                                className="p-1 hover:bg-neutral-100 rounded text-error-600"
                                onClick={() => handleDelete('club', club._id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Faculty Management */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Active Faculty</h3>
                      <button 
                        className="btn-outline flex items-center"
                        onClick={() => setShowAddModal('faculty')}
                      >
                        <UserPlus size={16} className="mr-2" />
                        Add Faculty
                      </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {faculty.map(faculty => (
                        <div key={faculty._id} className="p-4 bg-white border border-neutral-200 rounded-lg">
                          <div className="flex justify-between items-start">
  <div>
    <h4 className="font-medium">Name: {faculty.name}</h4>
    <p className="text-sm text-neutral-600">Role: {faculty.role}</p>
    <p className="text-sm text-neutral-600">Specialization: {faculty.specialization}</p>
    <p className="text-sm text-neutral-600">Experience: {faculty.experience}</p>
    <p className="text-sm text-neutral-600">Department: {faculty.clubAssigned}</p>
  </div>
  <div className="flex space-x-2">
    <button
  className="p-1 hover:bg-neutral-100 rounded"
  onClick={() => setEditModalData({ ...faculty, role: 'faculty' })}
>
  <Edit size={16} />
</button>
    <button 
      className="p-1 hover:bg-neutral-100 rounded text-error-600"
      onClick={() => handleDelete('faculty', faculty._id)}
    >
      <Trash2 size={16} />
    </button>
  </div>
</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {managementTab === 'inactive' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Inactive Clubs */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Inactive Clubs</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {inactiveUsers.inactiveClubs.map(club => (
  <div key={club._id} className="p-4 bg-white border border-neutral-200 rounded-lg">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{club.clubName}</h4>
        <p className="text-sm text-neutral-600">President: {club.name}</p>
        <p className="text-sm text-neutral-600">Department: {club.department}</p>
        <p className="text-sm text-neutral-600">HOD: {club.hodName}</p>
      </div>
    </div>
  </div>
))}
                    </div>
                  </div>

                  {/* Inactive Faculty */}
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Inactive Faculty</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                     {inactiveUsers.inactiveFaculty.map(faculty => (
  <div key={faculty._id} className="p-4 bg-white border border-neutral-200 rounded-lg">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium">{faculty.name}</h4>
        <p className="text-sm text-neutral-600">{faculty.role}</p>
        <p className="text-sm text-neutral-600">{faculty.specialization}</p>
        <p className="text-sm text-neutral-600">Experience: {faculty.experience}</p>
        <p className="text-sm text-neutral-600">Department: {faculty.department}</p>
      </div>
    </div>
  </div>
))}

                    </div>
                  </div>

                  {/* Inactive Coordinators */}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Club History & Reports</h2>


              
              
              {/* Filters */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-4">
                  <select 
                    className="input"
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                  >
                    <option value="all">All Clubs</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club.clubName}>{club.clubName}</option>
                    ))}
                  </select>
                  <select 
                    className="input"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                  >
                    <option value="all">All Semesters</option>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                  <select 
                    className="input"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="all">All Years</option>
                    {[2025, 2024, 2023, 2022].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <button className="btn-outline flex items-center">
                    <Download size={16} className="mr-2" />
                    Export Reports
                  </button>
                </div>
              </div>

              {/* Reports Table */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Event Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Club
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Date & Venue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Participants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Guest & Coordinator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Report Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                     {filteredReports.map((event: any, index: number) => (
  <tr key={event._id || index} className="hover:bg-neutral-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="font-medium">{event.title}</div>
      <div className="text-sm text-neutral-500">
        {event.startTime} - {event.endTime}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
      {event.club}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm">
        <div>{event.date}</div>
        <div className="text-neutral-500">{event.venue}</div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
      {event.report?.participants}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <button
        onClick={() => {
          setSelectedReportEvent(event);
          setShowReportModal(true);
        }}
        className="text-primary-600 hover:underline text-sm font-medium"
      >
        View Details
      </button>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
        Submitted
      </span>
    </td>
  </tr>
))}


                    </tbody>
                  </table>
                </div>
              </div>
              {showReportModal && selectedReportEvent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-2xl relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
        onClick={() => setShowReportModal(false)}
      >
        ✕
      </button>

      <h3 className="text-xl font-semibold mb-4">Event Report Details</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Title:</strong> {selectedReportEvent.title}</div>
        <div><strong>Club:</strong> {selectedReportEvent.club}</div>
        <div><strong>Date:</strong> {selectedReportEvent.date}</div>
        <div><strong>Time:</strong> {selectedReportEvent.startTime} - {selectedReportEvent.endTime}</div>
        <div><strong>Venue:</strong> {selectedReportEvent.venue}</div>
        <div><strong>Building:</strong> {selectedReportEvent.building}</div>
        <div><strong>Participants:</strong> {selectedReportEvent.report?.participants}</div>
        <div><strong>Guest Name:</strong> {selectedReportEvent.report?.guestName || '—'}</div>
        <div><strong>Staff Coordinator:</strong> {selectedReportEvent.report?.staffCoordinator || '—'}</div>
        <div><strong>Staff Invited:</strong> {selectedReportEvent.report?.staffInvited || '—'}</div>
        <div className="col-span-2"><strong>Description:</strong> {selectedReportEvent.description}</div>
      </div>
    </div>
  </div>
)}
            </div>
            
          )}

          {activeTab === 'calendar' && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Calendar Management</h2>
              <div className="bg-neutral-50 rounded-xl p-6">
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p className="text-neutral-600 mb-4">
                    View and manage department events calendar
                  </p>
                  <Link to="/dashboard/hod/calendar" className="btn-primary">
                    Open Calendar
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Add {showAddModal === 'club' ? 'Club' : 
                   showAddModal === 'faculty' ? 'Faculty' : 'Coordinator'}
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Form fields based on modal type */}
              {showAddModal === 'club' && (
                <>
                <input
                  type="text"
                  placeholder="Club Name"
                  className="input"
                  required
                  value={clubForm.clubName}
                  onChange={(e) => setClubForm({ ...clubForm, clubName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="President Name"
                  className="input"
                  required
                  value={clubForm.name}
                  onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input"
                  required
                  value={clubForm.email}
                  onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input"
                  required
                  value={clubForm.password}
                  onChange={(e) => setClubForm({ ...clubForm, password: e.target.value })}
                />
                <input
  type="text"
  className="input"
  value={user?.department}
  disabled
/>
<input
  type="text"
  className="input"
  value={user?.name}
  disabled
/>
                </>
              )}

              {showAddModal === 'faculty' && (
                <>
                  <input
                    type="text"
                    placeholder="Faculty Name"
                    className="input"
                    required
                    value={facultyForm.name}
                    onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    className="input"
                    required
                    value={facultyForm.specialization}
                    onChange={(e) => setFacultyForm({ ...facultyForm, specialization: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Experience"
                    className="input"
                    required
                    value={facultyForm.experience}
                    onChange={(e) => setFacultyForm({ ...facultyForm, experience: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="input"
                    required
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    required
                    value={facultyForm.password}
                    onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                  />
                  <input
                    type="text" 
                    placeholder="Assigned Club (e.g., Tech Club)" 
                    className="input"
                    required
                    value={facultyForm.clubAssigned}
                    onChange={(e) => setFacultyForm({ ...facultyForm, clubAssigned: e.target.value })}
                  />
                  <input
  type="text"
  className="input"
  value={user?.department}
  disabled
/>
                </>
              )}


              {showAddModal === 'coordinator' && (
                <>
                  <input type="text" placeholder="Coordinator Name" className="input" required />
                  <select className="input" required>
                    <option value="">Select Venue</option>
                    <option value="Main Auditorium">Main Auditorium</option>
                    <option value="Conference Hall">Conference Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Sports Complex">Sports Complex</option>
                  </select>
                  <select className="input" required>
                    <option value="">Select Department</option>
                    <option value="Administration">Administration</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                  <input type="text" placeholder="Experience (e.g., 3 years)" className="input" required />
                  <input type="email" placeholder="Email Address" className="input" required />
    <input type="password" placeholder="Password" className="input" required />
                </>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  type="button" 
                  className="btn-outline"
                  onClick={() => setShowAddModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {editModalData && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
      <h2 className="text-xl font-semibold mb-4">Edit {editModalData.role === 'faculty' ? 'Faculty' : 'Club'}</h2>
      <form onSubmit={handleEditSubmit} className="space-y-4">
        {editModalData.role === 'club_president' && (
          <>
            <input
              type="text"
              placeholder="Club Name"
              className="input"
              value={editModalData.clubName}
              onChange={(e) => setEditModalData({ ...editModalData, clubName: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="President Name"
              className="input"
              value={editModalData.name}
              onChange={(e) => setEditModalData({ ...editModalData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="input"
              value={editModalData.email}
              onChange={(e) => setEditModalData({ ...editModalData, email: e.target.value })}
              required
            />
          </>
        )}
        {editModalData.role === 'faculty' && (
          <>
            <input
              type="text"
              placeholder="Faculty Name"
              className="input"
              value={editModalData.name}
              onChange={(e) => setEditModalData({ ...editModalData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Specialization"
              className="input"
              value={editModalData.specialization}
              onChange={(e) => setEditModalData({ ...editModalData, specialization: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Experience"
              className="input"
              value={editModalData.experience}
              onChange={(e) => setEditModalData({ ...editModalData, experience: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="input"
              value={editModalData.email}
              onChange={(e) => setEditModalData({ ...editModalData, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Assigned Club"
              className="input"
              value={editModalData.clubAssigned}
              onChange={(e) => setEditModalData({ ...editModalData, clubAssigned: e.target.value })}
              required
            />
          </>
        )}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="btn-outline"
            onClick={() => setEditModalData(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">Update</button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Action Items */}
      <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
        <h3 className="text-lg font-semibold mb-4 text-primary-900">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-success-100 p-2 rounded-full mr-3 mt-0.5">
              <CheckCircle size={16} className="text-success-600" />
            </div>
            <div>
              <p className="font-medium">New club registration approved</p>
              <p className="text-sm text-neutral-600">Photography Club has been added to the department</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-warning-100 p-2 rounded-full mr-3 mt-0.5">
              <Clock size={16} className="text-warning-600" />
            </div>
            <div>
              <p className="font-medium">Faculty performance review pending</p>
              <p className="text-sm text-neutral-600">3 faculty members need performance evaluation</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-primary-100 p-2 rounded-full mr-3 mt-0.5">
              <FileText size={16} className="text-primary-600" />
            </div>
            <div>
              <p className="font-medium">Monthly report generation</p>
              <p className="text-sm text-neutral-600">Department activity report for May 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;