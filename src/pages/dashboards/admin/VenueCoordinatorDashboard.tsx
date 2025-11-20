import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import StatsCard from '../StatsCard';
import { CalendarCheck, XCircle } from 'lucide-react';

import {
  Building,
  Calendar,
  CheckSquare,
  ArrowUpRight,
  Clock,
  MapPin,
  Users,
  BarChart3,
  Search,
  Filter,
} from 'lucide-react';

const VenueCoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
const [showModal, setShowModal] = useState(false);
const [rejectingEventId, setRejectingEventId] = useState(null);
const [rejectionReason, setRejectionReason] = useState('');
const [showRejectionModal, setShowRejectionModal] = useState(false);


  const [stats, setStats] = useState({
  totalEvents: 0,
  eventsThisMonth: 0,
  pendingVenueRequests: 0,
  rejectedEvents: 0,
});

  // Sample data for demo

  const buildings = [
    {
      name: 'Main Building',
      venues: [
        {
          name: 'Main Auditorium',
          capacity: 300,
          availability: [
            { date: '2025-06-15', slots: ['10:00 AM - 2:00 PM', '3:00 PM - 7:00 PM'] },
            { date: '2025-06-16', slots: ['9:00 AM - 1:00 PM'] },
          ],
        },
        {
          name: 'Conference Hall',
          capacity: 150,
          availability: [
            { date: '2025-06-15', slots: ['2:00 PM - 6:00 PM'] },
            { date: '2025-06-17', slots: ['10:00 AM - 2:00 PM', '3:00 PM - 7:00 PM'] },
          ],
        },
      ],
    },
    {
      name: 'Engineering Block',
      venues: [
        {
          name: 'Computer Lab',
          capacity: 100,
          availability: [
            { date: '2025-06-15', slots: ['9:00 AM - 1:00 PM', '2:00 PM - 6:00 PM'] },
          ],
        },
        {
          name: 'Innovation Center',
          capacity: 80,
          availability: [
            { date: '2025-06-16', slots: ['10:00 AM - 2:00 PM'] },
          ],
        },
      ],
    },
  ];

const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const fetchFacultyApprovedEvents = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/events/faculty_approved');
    const data = await res.json();
    setEvents(data);
  } catch (err) {
    setError('Failed to fetch events.');
  } finally {
    setLoading(false);
  }
};

const fetchStats = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/events/venue/stats');
    const data = await res.json();
    setStats(data);
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  }
};


useEffect(() => {
  fetchFacultyApprovedEvents();
  fetchStats(); // 👈 Add this line
}, []);

// Transform backend stats object into an array for rendering
const statsArray = [
  {
    id: 1,
    name: 'Total Events',
    icon: <CalendarCheck size={20} />,
    value: stats.totalEvents,
    change: '+1',
  },
  {
    id: 2,
    name: 'Events This Month',
    icon: <Clock size={20} />,
    value: stats.eventsThisMonth,
    change: '+8',
  },
  {
    id: 3,
    name: 'Pending Approvals',
    icon: <MapPin size={20} />,
    value: stats.pendingVenueRequests,
    change: '-2',
  },
  {
    id: 4,
    name: 'Rejected Events',
    icon: <XCircle size={20} />,
    value: stats.rejectedEvents,
    change: '+3',
  },
];



const updateStatus = async (eventId, action) => {
  const route =
    action === 'approve'
      ? `http://localhost:5000/api/events/approve/venue/${eventId}`
      : `http://localhost:5000/api/events/reject/${eventId}`;

  const payload = action === 'reject'
    ? { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rejectionReason }) }
    : { method: 'PATCH' };

  try {
    const res = await fetch(route, payload);
    if (res.ok) {
      setEvents(prev => prev.filter(ev => ev._id !== eventId));
      setShowRejectionModal(false);
      setRejectionReason('');
    } else {
      alert('Failed to update event status');
    }
  } catch (err) {
    alert('Server error');
  }
};



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Faculty Approval':
        return <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">Pending Faculty</span>;
      case 'Pending Venue Approval':
        return <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">Pending Venue</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const filteredBuildings = selectedBuilding === 'all' 
    ? buildings 
    : buildings.filter(b => b.name === selectedBuilding);

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-neutral-600">
          Manage venue requests and bookings from your dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsArray.map((stat) => (
  <StatsCard
    key={stat.id}
    title={stat.name}
    icon={stat.icon}
    value={stat.value}
    change={stat.change}
  />
))}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    </div>
       
      </div>

      {/* Venue Management */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold">Venue Management</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search venues..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input"
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
            >
              <option value="all">All Buildings</option>
              {buildings.map(building => (
                <option key={building.name} value={building.name}>{building.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredBuildings.map((building) => (
            <div key={building.name} className="border border-neutral-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">{building.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {building.venues.map((venue) => (
                  <div key={venue.name} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{venue.name}</h4>
                        <p className="text-sm text-neutral-600">Capacity: {venue.capacity}</p>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-neutral-700">Available Slots:</h5>
                      {venue.availability.map((slot, index) => (
                        <div key={index} className="bg-neutral-50 rounded-lg p-2">
                          <p className="text-sm font-medium">{slot.date}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {slot.slots.map((time, timeIndex) => (
                              <span
                                key={timeIndex}
                                className="bg-success-100 text-success-700 text-xs px-2 py-1 rounded-full"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pending Approvals</h2>
            <Link
              to="/dashboard/venue-coordinator/approvals"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Requester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  View Details 
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {loading ? (
  <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
) : error ? (
  <tr><td colSpan={6} className="text-red-500 py-4">{error}</td></tr>
) : events.length === 0 ? (
  <tr><td colSpan={6} className="text-center py-4">No events pending venue approval</td></tr>
) : (
  events.map((event) => (
    <tr key={event._id} className="hover:bg-neutral-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium">{event.title}</div>
        <div className="text-sm text-neutral-500">{event.club}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <div className="font-medium">{event.date}</div>
          <div className="text-neutral-500">{event.startTime} - {event.endTime}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
        {event.venue}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
        {event.requester || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
  <button
    onClick={() => {
      setSelectedEvent(event);
      setShowModal(true);
    }}
    className="text-blue-600 hover:underline"
  >
    View Details
  </button>
</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
          Faculty Approved
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <div className="flex justify-end space-x-2">
          <button
            className="text-green-600 hover:text-green-700 font-medium"
            onClick={() => updateStatus(event._id, 'approve')}
          >
            Approve
          </button>
          <button
            className="text-red-600 hover:text-red-700 font-medium"
            onClick={() => {
  setRejectingEventId(event._id);
  setShowRejectionModal(true);
}}
          >
            Reject
          </button>
        </div>
      </td>
    </tr>
  ))
)}
            </tbody>
          </table>
        </div>
         {showModal && selectedEvent && (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white rounded-lg p-6 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-4">Event Details</h2>
      <div className="space-y-3 text-sm text-gray-700">
        <p><strong>Club:</strong> {selectedEvent.club}</p>
        <p><strong>Title:</strong> {selectedEvent.title}</p>
        <p><strong>Description:</strong> {selectedEvent.description}</p>
        <p><strong>Category:</strong> {selectedEvent.category}</p>
        <p><strong>Date:</strong> {selectedEvent.date}</p>
        <p><strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
        <p><strong>Venue:</strong> {selectedEvent.venue} ({selectedEvent.building})</p>
        <p><strong>Attendees:</strong> {selectedEvent.attendees}</p>
        <p><strong>Ticketed:</strong> {selectedEvent.isTicketed}</p>
        <p><strong>Target Audience:</strong> {selectedEvent.targetAudience.join(', ') || 'None selected'}</p>
        {selectedEvent.isTicketed === 'yes' && (
          <>
            <p><strong>Ticket Price:</strong> ₹{selectedEvent.ticketPrice}</p>
            <p><strong>Ticket Quantity:</strong> {selectedEvent.ticketQuantity}</p>
          </>
        )}
        <p><strong>Registration Link:</strong> <a href={selectedEvent.registrationLink} target="_blank" className="text-blue-500 underline">Open Link</a></p>

        {selectedEvent.bannerImageUrl && (
          <div>
            <p><strong>Banner Image:</strong></p>
            <img
              src={`http://localhost:5000${selectedEvent.bannerImageUrl}`}
              alt="Banner"
              className="mt-2 h-40 rounded border"
            />
          </div>
        )}
        {selectedEvent.clubLogoUrl && (
          <div>
            <p><strong>Club Logo:</strong></p>
            <img
              src={`http://localhost:5000${selectedEvent.clubLogoUrl}`}
              alt="Logo"
              className="mt-2 h-24 w-24 object-contain border rounded"
            />
          </div>
        )}
      </div>
      <button
        onClick={() => setShowModal(false)}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
)}

{showRejectionModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Reject Event</h2>
      <textarea
        rows={4}
        placeholder="Write reason for rejection..."
        className="w-full border border-gray-300 rounded p-2"
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
      />
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => setShowRejectionModal(false)}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => updateStatus(rejectingEventId, 'reject')}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};



export default VenueCoordinatorDashboard;