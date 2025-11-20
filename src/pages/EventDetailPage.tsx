import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Share2, ChevronLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventDetailPage: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events/${id}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const handleShare = () => {
    if (!event) return;

    const eventUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: eventUrl,
        })
        .then(() => console.log('✅ Shared successfully'))
        .catch((error) => console.error('❌ Share failed:', error));
    } else {
      navigator.clipboard.writeText(eventUrl);
      alert('📋 Event link copied to clipboard!');
    }
  };

  if (!event) {
    return <div className="p-6">Loading event details...</div>;
  }

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link
          to="/events"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to Events</span>
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-96">
            <img
              src={`${API_BASE_URL}${event.bannerImageUrl}`}
              alt="Event Banner"
              className="w-full h-full object-contain object-center rounded mb-4 bg-black"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center mb-2">
                <img
                  src={`${API_BASE_URL}${event.clubLogoUrl}`}
                  alt="Club Logo"
                  className="h-12 w-12 rounded-full object-contain object-center bg-white p-1"
                />
                <span className="font-medium ml-2">{event.club}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-2" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  <span>{event.building}, {event.venue}</span>
                </div>
                <div className="flex items-center">
                  <Users size={18} className="mr-2" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-neutral-700 mb-6 leading-relaxed">{event.description}</p>

              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
                <div className="space-y-4">
                  {event.schedule?.map((item: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="mr-4 relative">
                        <div className="w-3 h-3 bg-primary-500 rounded-full mt-1.5"></div>
                        {index < event.schedule.length - 1 && (
                          <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-primary-200"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-primary-600 font-medium">{item.time}</p>
                        <h4 className="font-medium mt-1">{item.title}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 sticky top-24">
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full mb-4 text-center block"
              >
                Register Now
              </a>

              <button
                onClick={handleShare}
                className="btn-secondary w-full mb-4 flex items-center justify-center gap-2"
              >
                <Share2 size={16} />
                Share Event
              </button>

              <div className="border-t border-neutral-200 my-6"></div>

              <h3 className="text-lg font-semibold mb-4">Organizer</h3>
              <div className="flex items-center mb-6">
                <img
                  src={`${API_BASE_URL}${event.clubLogoUrl}`}
                  alt="Club Logo"
                  className="h-12 w-12 rounded-full mt-4"
                />
                <div className="ml-3">
                  <p className="text-sm text-bold-600 mt-1">{event.club}</p>
                </div>
              </div>

              {event.club?.description && (
                <p className="text-sm text-neutral-700 mb-4">{event.club.description}</p>
              )}

              <Link
                to="/clubs/tech-club"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Club Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
