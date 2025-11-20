// 📁 src/pages/hod/EventHistoryHOD.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { X } from 'lucide-react';
import axios from 'axios';

const EventHistoryHOD: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [upcomingEvents, setUpcomingEvents] = useState([]);
const [actionLoading, setActionLoading] = useState(false);
const [rejectionReason, setRejectionReason] = useState('');


  useEffect(() => {
  const fetchUpcomingEvents = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("campusEventsUser"))?.token;
      const res = await axios.get("http://localhost:5000/api/events/hod/upcoming-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUpcomingEvents(res.data); // show department-wise filtered events
    } catch (err) {
      console.error("Failed to fetch upcoming events:", err);
    }
  };

  fetchUpcomingEvents();
}, []);

const handleDecision = async (eventId: string, decision: 'approved' | 'rejected') => {
  const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;

  if (!token) return alert("Missing token");

  setActionLoading(true);

  try {
    const res = await fetch(`http://localhost:5000/api/events/hod/decision/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        decision,
        reason: decision === 'rejected' ? rejectionReason : null,
      }),
    });

    const data = await res.json();
    console.log('✅ Decision response:', data);

    // Refresh upcoming events list
    fetchUpcomingEvents();
  } catch (error) {
    console.error("❌ Error sending decision:", error);
  } finally {
    setActionLoading(false);
    setRejectionReason('');
  }
};



// CHANGE THIS 👇
const filteredEvents = upcomingEvents.filter(ev => ['final_approved', 'rejected'].includes(ev.status));



  const openModal = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleReject = async (eventId: string) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/hod/reject/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rejectionReason: reason })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Event rejected.');
        setEvents(events.map(ev => ev._id === eventId ? data.event : ev));
        closeModal();
      } else {
        alert('Failed: ' + data.message);
      }
    } catch (err) {
      alert('Server error.');
    }
  };


  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">HOD Event History</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEvents.map(event => (
            <tr key={event._id}>
              <td className="px-6 py-4">{event.title}</td>
              <td className="px-6 py-4">{event.date}</td>
              <td className="px-6 py-4 capitalize">{event.status.replace(/_/g, ' ')}</td>
              <td className="px-6 py-4">
                <button className="text-blue-600 hover:underline" onClick={() => openModal(event)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={closeModal}>
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">{selectedEvent.title}</h2>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Club:</strong> {selectedEvent.club}</p>
            <p><strong>Date:</strong> {selectedEvent.date}</p>
            <p><strong>Status:</strong> {selectedEvent.status.replace(/_/g, ' ')}</p>
            {selectedEvent.rejectionReason && (
              <p className="text-red-600 mt-2">Reason: {selectedEvent.rejectionReason}</p>
            )}
            {selectedEvent.status === 'final_approved' && (
              <button onClick={() => handleReject(selectedEvent._id)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                Reject This Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHistoryHOD;
