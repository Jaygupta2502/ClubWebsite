import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingEventsHOD = () => {
  const [events, setEvents] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
const [showModal, setShowModal] = useState(false);


 const fetchEvents = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;
    const res = await axios.get('http://localhost:5000/api/events/pending/hod', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Fetched Events:', res.data);
    setEvents(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error('❌ Fetch HOD events failed:', err);
    setEvents([]);
  }
};
  const approveEvent = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;

await axios.patch(`http://localhost:5000/api/events/approve/hod/${id}`, null, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      fetchEvents(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const rejectEvent = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;
      await axios.patch(`http://localhost:5000/api/events/reject/hod/${selectedEventId}`, {
  reason: rejectReason,
}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      setRejectReason('');
      setSelectedEventId('');
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Pending Events for HOD Approval</h1>
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
        {events.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-6 text-neutral-500">
              No pending events
            </td>
          </tr>
        ) : (
          events.map((event) => (
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
                    className="text-green-600 hover:text-green-800 font-medium"
                    onClick={() => approveEvent(event._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 font-medium"
                    onClick={() => setSelectedEventId(event._id)}
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
</div>


      {/* Rejection modal or prompt */}
      {selectedEventId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Enter Rejection Reason</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedEventId('');
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={rejectEvent}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default PendingEventsHOD;
