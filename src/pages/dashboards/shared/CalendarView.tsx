import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events/all');
        const data = await res.json();

        const formatted = data.map((ev) => ({
          title: ev.title,
          start: new Date(`${ev.date}T${ev.startTime}`),
          end: new Date(`${ev.date}T${ev.endTime}`),
          status: ev.status,
        }));

        setEvents(formatted);
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor:
              event.status === 'pending'
                ? '#60A5FA' // blue
                : event.status === 'final_approved'
                ? '#34D399' // green
                : event.status === 'rejected'
                ? '#F87171' // red
                : '#D1D5DB', // fallback gray
          },
        })}
      />
    </div>
  );
};

export default CalendarView;
