import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
  BarChart3,
  Users,
  Calendar,
  ClipboardList,
  TicketIcon,
  TrendingUp,
  ArrowUpRight,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  Upload,
  Building,
  User,
  UserCheck,
  Download,
  Filter,
} from 'lucide-react';
const PresidentDashboard: React.FC = () => {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showReportForm, setShowReportForm] = useState(false);
  const [pendingReports, setPendingReports] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedClub, setSelectedClub] = useState('all');

  const [clubs, setClubs] = useState([
    { id: 1, name: 'Tech Club' },
    { id: 2, name: 'Cultural Club' },
    { id: 3, name: 'Sports Club' },
    { id: 4, name: 'E-Cell' },
    { id: 5, name: 'Photography Club' },
  ]);

  const [reportFormData, setReportFormData] = useState({
    club: '',
    eventTitle: '',
    eventPoster: null,
    reportFile: null,
    building: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
    guestName: '',
    staffCoordinator: '',
    staffInvited: '',
  });

  const buildings = [
    {
      name: 'Main Building',
      venues: ['Main Auditorium', 'Conference Hall', 'Seminar Room']
    },
    {
      name: 'Engineering Block',
      venues: ['Computer Lab', 'Innovation Center', 'Workshop Area']
    },
    {
      name: 'Science Block',
      venues: ['Physics Lab', 'Chemistry Lab', 'Research Center']
    },
  ];

 useEffect(() => {
  const fetchPendingReports = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
      const res = await fetch('http://localhost:5000/api/events/pending-reports', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log('📦 Report Events:', data);
      setPendingReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Failed to fetch pending reports', err);
    }
  };

  fetchPendingReports();
}, []);


  const completedEvents = pendingReports;
  const warningEvents = completedEvents.filter(event => !event.reportSubmitted && event.daysOverdue > 10);

  const filteredCompletedEvents = selectedClub === 'all'
    ? completedEvents
    : completedEvents.filter(event => event.club === selectedClub);

  const filteredWarningEvents = selectedClub === 'all'
    ? warningEvents
    : warningEvents.filter(event => event.club === selectedClub);

  const handleReportFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReportFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'building' && { venue: '' }),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'eventPoster' | 'reportFile') => {
    if (e.target.files && e.target.files[0]) {
      setReportFormData(prev => ({
        ...prev,
        [field]: e.target.files ? e.target.files[0] : null,
      }));
    }
  };
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;

    if (!selectedEvent || !selectedEvent._id) {
      alert('No event selected. Please click Submit Report button again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('participants', reportFormData.participants);
      formData.append('guestName', reportFormData.guestName);
      formData.append('staffCoordinator', reportFormData.staffCoordinator);
      formData.append('staffInvited', reportFormData.staffInvited);
      if (reportFormData.eventPoster) {
        formData.append('eventPoster', reportFormData.eventPoster);
      }

      const res = await fetch(`http://localhost:5000/api/events/report/${selectedEvent._id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to submit report');
      }

      const data = await res.json();
      console.log('✅ Report submitted:', data);

      // Refresh data
      const updated = await fetch('http://localhost:5000/api/events/pending-reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedReports = await updated.json();
      setPendingReports(updatedReports);

      alert('✅ Report submitted successfully!');
      setShowReportForm(false);

      // Reset form
      setReportFormData({
        club: '',
        eventTitle: '',
        eventPoster: null,
        reportFile: null,
        building: '',
        venue: '',
        date: '',
        startTime: '',
        endTime: '',
        participants: '',
        guestName: '',
        staffCoordinator: '',
        staffInvited: '',
      });
    } catch (err) {
      console.error('❌ Error submitting report:', err);
      alert('Error submitting report. Please try again.');
    }
  };

  const getAvailableVenues = () => {
    const selectedBuilding = buildings.find(b => b.name === reportFormData.building);
    return selectedBuilding ? selectedBuilding.venues : [];
  };

  const downloadReportTemplate = () => {
    // In a real app, this would download an actual template file
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'event-report-template.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };





  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-neutral-600">
          Manage your club's events and activities from your dashboard
        </p>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              Report Upload
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'warnings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('warnings')}
            >
              Warnings
              {warningEvents.length > 0 && (
                <span className="ml-2 bg-error-500 text-white text-xs px-2 py-1 rounded-full">
                  {warningEvents.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    to="/dashboard/president/create-event"
                    className="card card-hover bg-gradient-to-br from-primary-600 to-primary-800 text-white"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-white/20 rounded-lg mr-4">
                        <ClipboardList size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Create Event</h3>
                        <p className="text-sm text-white/80">Start planning a new event</p>
                      </div>
                    </div>
                  </Link>
                  
                  

                  <Link
                    to="/dashboard/president/analytics"
                    className="card card-hover bg-gradient-to-br from-pink-500 to-pink-700 text-white"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-white/20 rounded-lg mr-4">
                        <BarChart3 size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">View Analytics</h3>
                        <p className="text-sm text-white/80">Track event performance</p>
                      </div>
                    </div>
                  </Link>
                  <Link
  to="/dashboard/president/report-history"
  className="card card-hover bg-gradient-to-br from-yellow-500 to-yellow-700 text-white"
>
  <div className="flex items-center">
    <div className="p-2 bg-white/20 rounded-lg mr-4">
      <FileText size={24} />
    </div>
    <div>
      <h3 className="font-semibold">Report History</h3>
      <p className="text-sm text-white/80">View submitted reports</p>
    </div>
  </div>
</Link>
{/* Club Recruitment */}
<Link
  to="/dashboard/president/Club-Recruitment"
  className="card card-hover bg-gradient-to-br from-green-600 to-green-800 text-white"
>
  <div className="flex items-center">
    <div className="p-2 bg-white/20 rounded-lg mr-4">
      <Users size={24} />
    </div>
    <div>
      <h3 className="font-semibold">Club Recruitment</h3>
      <p className="text-sm text-white/80">Manage club hiring & posts</p>
    </div>
  </div>
</Link>
</div>
</div>


              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              </div>
            </div>
          )}

{activeTab === 'reports' && (
  <div>
    {pendingReports.length > 0 && (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" />
          <strong>You have pending reports to submit:</strong>
        </div>
        <ul className="list-disc ml-6 mt-2">
          {pendingReports.map((event) => (
            <li key={event._id || event._id}>
              <FileText className="inline mr-1" />
              <span>{event.title} - {event.date}</span>
              <span
                className="ml-2 text-sm text-blue-600 cursor-pointer underline"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowReportForm(true);
                }}
              >
                Submit Report
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-lg font-semibold">Event Report Upload</h2>
        <p className="text-neutral-600">Submit reports for completed events</p>
      </div>
      <div className="flex items-center space-x-4">
   
        <button 
          className="btn-primary flex items-center"
          onClick={() => {
            setReportFormData(prev => ({
              ...prev,
              club: user?.club || ''
            }));
            setShowReportForm(true);
          }}
        >
          <Upload size={18} className="mr-2" />
          Upload Report
        </button>
      </div>
      </div>



              {/* Completed Events List */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Club
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Venue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Report Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Days Since Event
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {filteredCompletedEvents.map((event) => (
                        <tr key={event._id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{event.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                            {event.clubName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                            {event.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                            {event.venue}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {event.reportSubmitted ? (
                              <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">
                                Submitted
                              </span>
                            ) : (
                              <span className="bg-error-100 text-error-700 px-2 py-1 rounded-full text-xs font-medium">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                            {event.daysOverdue} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            {!event.reportSubmitted && (
                              <button 
  className="text-primary-600 hover:text-primary-700 font-medium"
  onClick={() => {
    setSelectedEvent(event); // ✅ Set the event
    setShowReportForm(true);
  }}
>
  Upload Report
</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Report Upload Form Modal */}
              {showReportForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Upload Event Report</h2>
                     <form onSubmit={handleReportSubmit} className="space-y-6">
{/* Club and Event Title */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Club <span className="text-error-600">*</span>
    </label>
    <input
  type="text"
  name="club"
  value={selectedEvent?.club || ''}
  readOnly
  className="input bg-gray-100 cursor-not-allowed"
/>
  </div>

  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Event Title <span className="text-error-600">*</span>
    </label>
    <input
  type="text"
  name="eventTitle"
  value={selectedEvent?.title || ''}
  readOnly
  className="input bg-gray-100 cursor-not-allowed"
/>
  </div>
</div>

{/* Date, Start Time, End Time */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Date <span className="text-error-600">*</span>
    </label>
    <input
  type="date"
  name="date"
  value={selectedEvent?.date || ''}
  readOnly
  className="input bg-gray-100 cursor-not-allowed"
/>
  </div>

  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Start Time <span className="text-error-600">*</span>
    </label>
    <input
  type="time"
  name="startTime"
  value={selectedEvent?.startTime || ''}
  readOnly
  className="input bg-gray-100 cursor-not-allowed"
/>
  </div>

  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      End Time <span className="text-error-600">*</span>
    </label>
    <input
  type="time"
  name="endTime"
  value={selectedEvent?.endTime || ''}
  readOnly
  className="input bg-gray-100 cursor-not-allowed"
/>
  </div>
</div>

{/* Event Photo + Participants */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Event Photo <span className="text-error-600">*</span>
    </label>
    <input
      type="file"
      onChange={(e) => handleFileChange(e, 'reportFile')}
      className="input"
      accept="image/*"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Number of Participants <span className="text-error-600">*</span>
    </label>
    <input
      type="number"
      name="participants"
      value={reportFormData.participants}
      onChange={handleReportFormChange}
      className="input"
      placeholder="Enter participant count"
      min="1"
      required
    />
  </div>
</div>

{/* Staff Coordinator */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Staff Coordinator <span className="text-error-600">*</span>
    </label>
    <input
      type="text"
      name="staffCoordinator"
      value={reportFormData.staffCoordinator}
      onChange={handleReportFormChange}
      className="input"
      placeholder="Enter coordinator name"
      required
    />
  </div>
</div>
  {/* Submit / Cancel */}
  <div className="flex justify-end space-x-4">
    <button
      type="button"
      className="btn-outline"
      onClick={() => setShowReportForm(false)}
    >
      Cancel
    </button>
    <button type="submit" className="btn-primary">
      Submit Report
    </button>
  </div>
</form>

                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {activeTab === 'warnings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <AlertTriangle size={24} className="text-error-600 mr-3" />
                  <div>
                    <h2 className="text-lg font-semibold">Warning: Overdue Reports</h2>
                    <p className="text-neutral-600">Events with reports pending for more than 10 days</p>
                  </div>
                </div>
                <div className="relative">
                  <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <select
                    className="input pl-10"
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                  >
                    <option value="all">All Clubs</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.name}>{club.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredWarningEvents.length > 0 ? (
                <div className="bg-error-50 border border-error-200 rounded-xl p-6">
                  <div className="space-y-4">
                    {filteredWarningEvents.map((event) => (
                      <div key={event._id} className="bg-white border border-error-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-error-900">{event.title}</h3>
                            <p className="text-sm text-error-700">Club: {event.clubName}</p>
                            <p className="text-sm text-error-700">Event Date: {event.date}</p>
                            <p className="text-sm text-error-700">Venue: {event.venue}</p>
                            <p className="text-sm text-error-600 font-medium">
                              Report overdue by {event.daysOverdue} days
                            </p>
                          </div>
                          <button 
                            className="btn-primary bg-error-600 hover:bg-error-700"
                            onClick={() => setShowReportForm(true)}
                          >
                            Submit Report Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck size={32} className="text-success-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">All Reports Up to Date</h3>
                  <p className="text-neutral-600">
                    {selectedClub === 'all' 
                      ? "Great job! All your event reports have been submitted on time."
                      : `All reports for ${selectedClub} have been submitted on time.`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default PresidentDashboard;