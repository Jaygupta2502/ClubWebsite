import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { BadgeCheck, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
const EventHistory: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [clubFilter, setClubFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [availableClubs, setAvailableClubs] = useState<string[]>([]);

const openModal = (event: any) => {
  setSelectedEvent(event);
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
  setSelectedEvent(null);
};

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events/all');
        const data = await res.json();
        setEvents(data);
        const uniqueClubs = ['all', ...new Set(data.map((e: any) => e.club))];
setAvailableClubs(uniqueClubs);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };
    fetchEvents();
  }, []);

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    const colorMap: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      faculty_approved: 'bg-blue-100 text-blue-800',
      final_approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const filteredEvents = events.filter(event => {
  const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
  const matchesClub = clubFilter === 'all' || event.club === clubFilter;
  return matchesStatus && matchesClub;
});

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Event History</h2>

     <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-200">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Events</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Club Filter */}
    <div>
      <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-1">
        Club
      </label>
      <select
        id="club"
        value={clubFilter}
        onChange={(e) => setClubFilter(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        {availableClubs.map((club) => (
          <option key={club} value={club}>
            {club}
          </option>
        ))}
      </select>
    </div>

    {/* Status Filter */}
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
        Status
      </label>
      <select
        id="status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">All</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="pending">Pending</option>
        <option value="final_approved">Final Approved</option>
      </select>
    </div>
  </div>
</div>


      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map(event => (
              <tr key={event._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
<div
  title={event.description}
  className="text-sm text-gray-600 max-w-xs truncate"
>
  {event.description}
</div>



                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.venue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.club}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(event.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
  <button
    onClick={() => openModal(event)}
    className="text-blue-600 hover:underline"
  >
    View Details
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedEvent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-xl w-full relative overflow-y-auto max-h-[80vh]">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        onClick={closeModal}
      >
        <X size={20} />
      </button>
      <h2 className="text-xl font-semibold mb-4">Event Details</h2>
      <div className="space-y-3 text-sm">
        <p><strong>Club:</strong> {selectedEvent.club}</p>
        <p><strong>Title:</strong> {selectedEvent.title}</p>
        <p><strong>Description:</strong> {selectedEvent.description}</p>
        <p><strong>Category:</strong> {selectedEvent.category}</p>
        <p><strong>Date:</strong> {selectedEvent.date}</p>
        <p><strong>Time:</strong> {selectedEvent.startTime} to {selectedEvent.endTime}</p>
        <p><strong>Venue:</strong> {selectedEvent.venue} ({selectedEvent.building})</p>
        <p><strong>Expected Attendees:</strong> {selectedEvent.attendees}</p>
        <p><strong>Ticketed:</strong> {selectedEvent.isTicketed}</p>
        {selectedEvent.isTicketed === 'yes' && (
          <>
            <p><strong>Ticket Price:</strong> ₹{selectedEvent.ticketPrice}</p>
            <p><strong>Ticket Quantity:</strong> {selectedEvent.ticketQuantity}</p>
          </>
        )}
        <p><strong>Registration Link:</strong> <a href={selectedEvent.registrationLink} target="_blank" className="text-blue-600 underline">Open</a></p>
        {selectedEvent.status === 'rejected' && selectedEvent.rejectionReason && (
  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
    <p className="text-red-700 text-sm"><strong>Rejection Reason:</strong> {selectedEvent.rejectionReason}</p>
  </div>
)}

        {selectedEvent.bannerImageUrl && (
          <div>
            <p><strong>Banner Image:</strong></p>
            <img src={`http://localhost:5000${selectedEvent.bannerImageUrl}`} alt="Banner" className="mt-2 h-40 rounded border" />
          </div>
        )}

        {selectedEvent.clubLogoUrl && (
          <div>
            <p><strong>Club Logo:</strong></p>
            <img src={`http://localhost:5000${selectedEvent.clubLogoUrl}`} alt="Logo" className="mt-2 h-20 w-20 border rounded" />
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </div>
    
  );
};

export default EventHistory;
