import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending Faculty</span>;
    case 'faculty_approved':
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Pending HOD</span>;
    case 'hod_approved':
      return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">Pending VC</span>;
    case 'final_approved':
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Approved</span>;
    case 'rejected':
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Rejected</span>;
    default:
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
  }
};

const PendingApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
const [showModal, setShowModal] = useState(false);
const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const token = JSON.parse(localStorage.getItem('campusEventsUser') || '{}')?.token;

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/events/pending/venue`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApprovals(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [token]);

  const handleUpdateStatus = async (id: string, action: 'approve' | 'reject') => {
    const url =
      action === 'approve'
        ? `${API_BASE}/api/events/approve/venue/${id}`
        : `${API_BASE}/api/events/reject/${id}`

    try {
      const res = await axios.patch(
        url,
        action === 'reject' ? { reason: 'Rejected by VC' } : {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 || res.status === 204) {
        setApprovals((prev) => prev.filter((ev) => ev._id !== id));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Pending Approvals</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Event</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date & Time</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Venue</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Club</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Details</th>
    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
  </tr>
</thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="text-red-500 text-center p-4">{error}</td></tr>
              ) : approvals.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-4">No pending approvals</td></tr>
              ) : (
                approvals.map((event) => (
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
    {event.club}
  </td>
  <td className="px-6 py-4 whitespace-nowrap">
    {getStatusBadge(event.status)}
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
  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
    <button
      onClick={() => handleUpdateStatus(event._id, 'approve')}
      className="text-green-600 hover:underline"
    >
      Approve
    </button>
    <button
      onClick={() => handleUpdateStatus(event._id, 'reject')}
      className="text-red-600 hover:underline"
    >
      Reject
    </button>
  </td>
</tr>

                ))
              )}
            </tbody>
          </table>
        </div>
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
        <p><strong>Target Audience:</strong> {selectedEvent.targetAudience?.join(', ') || 'None selected'}</p>

        {selectedEvent.isTicketed === 'yes' && (
          <>
            <p><strong>Ticket Price:</strong> ₹{selectedEvent.ticketPrice}</p>
            <p><strong>Ticket Quantity:</strong> {selectedEvent.ticketQuantity}</p>
          </>
        )}

        <p><strong>Registration Link:</strong>{' '}
          <a href={selectedEvent.registrationLink} target="_blank" className="text-blue-500 underline">
            Open Link
          </a>
        </p>

        {selectedEvent.bannerImageUrl && (
          <div>
            <p><strong>Banner Image:</strong></p>
            <img
              src={`${API_BASE}${selectedEvent.bannerImageUrl}`}
              alt="Banner"
              className="mt-2 h-40 rounded border"
            />
          </div>
        )}

        {selectedEvent.clubLogoUrl && (
          <div>
            <p><strong>Club Logo:</strong></p>
            <img
              src={`${API_BASE}${selectedEvent.clubLogoUrl}`}
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

  );
};

export default PendingApprovalsPage;
