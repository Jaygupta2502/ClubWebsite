import React from 'react';
import { Clock, MapPin, Building } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'College Annual Day',
    date: 'June 30, 2025',
    time: '10:00 AM - 6:00 PM',
    location: 'Auditorium',
    department: 'Admin',
    status: 'Approved',
  },
  {
    id: 2,
    title: 'Tech Symposium',
    date: 'June 15, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Main Hall',
    department: 'CSE',
    status: 'Approved',
  },
  {
    id: 3,
    title: 'Business Summit',
    date: 'July 5, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Conf. Room',
    department: 'MBA',
    status: 'Pending',
  },
];

const getBadge = (status: string) => {
  const base = 'px-2 py-1 text-xs rounded-full font-medium';
  if (status === 'Approved') return <span className={`${base} bg-green-100 text-green-800`}>Approved</span>;
  if (status === 'Pending') return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
  return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
};

const DeanEventsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">All College Events</h1>
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{event.title}</h2>
            <div className="text-sm text-gray-600 flex flex-wrap gap-3 mt-1">
              <span className="flex items-center"><Clock size={14} className="mr-1" />{event.time}</span>
              <span className="flex items-center"><MapPin size={14} className="mr-1" />{event.location}</span>
              <span className="flex items-center"><Building size={14} className="mr-1" />{event.department}</span>
            </div>
          </div>
          <div>{getBadge(event.status)}</div>
        </div>
      ))}
    </div>
  </div>
);

export default DeanEventsPage;
