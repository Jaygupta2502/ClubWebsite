import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const FacultyDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // UI filters and tabs
  const [activeTab, setActiveTab] = useState('events');
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPendingEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/pending/faculty/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const updateStatus = async (eventId, action) => {
  const route =
    action === 'approve'
      ? `http://localhost:5000/api/events/approve/faculty/${eventId}`
      : `http://localhost:5000/api/events/reject/${eventId}`;

  try {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
    const res = await fetch(route, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      setEvents(prev => prev.filter(ev => ev._id !== eventId));
    } else {
      alert('Failed to update event status');
    }
  } catch (err) {
    alert('Server error');
  }
};


  // Apply filters to fetched backend events
  const filteredEvents = events.filter(event => {
    const matchesClub = selectedClub === 'all' || event.club === selectedClub;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClub && matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-neutral-600">Manage department events and staff invitations</p>
      </div>

      {/* Tabs + Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'events'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              onClick={() => setActiveTab('events')}
            >
              Department Events
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'invites'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              onClick={() => setActiveTab('invites')}
            >
              Staff Invitations
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
            >
              <option value="all">All Clubs</option>
              <option value="Tech Club">Tech Club</option>
              <option value="Cultural Club">Cultural Club</option>
              <option value="Sports Club">Sports Club</option>
              <option value="E-Cell">E-Cell</option>
              <option value="Photography Club">Photography Club</option>
            </select>
            <select
              className="input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {activeTab === 'events' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Club</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Details</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-neutral-500">
                          No events found
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((event) => (
                        <tr key={event._id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{event.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{event.club}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{event.date}</div>
                            <div className="text-neutral-500">{event.startTime} - {event.endTime}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{event.venue}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                className="text-success-600 hover:text-success-700 font-medium"
                                onClick={() => updateStatus(event._id, 'approve')}
                              >
                                <CheckCircle size={16} className="inline-block mr-1" />
                                Approve
                              </button>
                              <button
                                className="text-error-600 hover:text-error-700 font-medium"
                                onClick={() => updateStatus(event._id, 'reject')}
                              >
                                <XCircle size={16} className="inline-block mr-1" />
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
            </div>
          )}
          {activeTab === 'invites' && (
            <div className="text-center text-neutral-500 p-6">
              Staff Invitations not supported in backend yet.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyDashboard;
