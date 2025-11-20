import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/events');
        const data = await res.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = data
  .filter((event: any) => {
    const eventDate = new Date(`${event.date}T${event.startTime}`);
    return (
      eventDate >= today &&
      event.approvedByFaculty &&
      event.approvedByVenue &&
      event.status === 'final_approved'
    );
  })
          .sort((a: any, b: any) => {
            const aDate = new Date(`${a.date}T${a.startTime}`);
            const bDate = new Date(`${b.date}T${b.startTime}`);
            return aDate.getTime() - bDate.getTime();
          });

        setEvents(filtered);
      } catch (err) {
        console.error('❌ Failed to fetch upcoming events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="pt-16 pb-6 bg-neutral-50 -translate-y-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between mb-10">
          <div
            className="text-3xl font-extrabold text-neutral-900 font-poppins"
            style={{
              textShadow:
                '0 0 4px rgba(255, 255, 255, 0.1), 0 0 8px rgba(0, 123, 255, 0.2), 0 0 12px rgba(0, 123, 255, 0.3)',
              marginLeft: '500px',
            }}
          >
            <h2 className="text-3xl font-bold text-neutral-900">Upcoming Events</h2>
          </div>
          <Link
            to="/events"
            className="mt-4 md:mt-0 flex items-center text-[#d10000] hover:text-[#b30000] font-medium"
          >
            <span>See All Events</span>
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <Link to={`/events/${event._id}`} key={event._id} className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                <div className="relative">
                  <img
                    src={`http://localhost:5000${event.bannerImageUrl}`}
                    alt={event.title}
                    className="w-full h-48 object-contain object-centre bg-black"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="bg-white rounded-full p-1 shadow-md">
                      <img
                        src={`http://localhost:5000${event.clubLogoUrl}`}
                        alt={event.club}
                        className="w-8 h-8 rounded-full object-contain bg-white"
                      />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#d10000] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 mb-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#d10000]" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-[#d10000]" />
                      <span>
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#d10000]" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={`http://localhost:5000${event.clubLogoUrl}`}
                        alt={event.club}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-500">{event.club}</span>
                    </div>

                    <span className="text-sm font-medium text-[#d10000] hover:text-[#b30000] transition-colors">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/events"
            className="inline-flex items-center text-white bg-[#d10000] hover:bg-[#b30000] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <span>See More Events</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
