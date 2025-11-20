import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Filter, ChevronDown, Search } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Event = {
  _id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  building: string;
  venue: string;
  bannerImageUrl: string;
  clubLogoUrl: string;
  club: {
    name: string;
    description?: string;
  };
};

const EventsPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events`);
        const data = await res.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = data.filter((event: any) => {
          const eventDate = new Date(`${event.date}T${event.startTime}`);
          const isApproved =
            event.approvedByFaculty &&
            event.approvedByVenue &&
            event.status === 'final_approved';
          const isPast = eventDate < today;
          const isUpcoming = eventDate >= today;

          return isApproved && (showPast ? isPast : isUpcoming);
        });

        filtered.sort((a: any, b: any) => {
          const aDateTime = new Date(`${a.date}T${a.startTime}`);
          const bDateTime = new Date(`${b.date}T${b.startTime}`);
          return aDateTime.getTime() - bDateTime.getTime();
        });

        setEvents(filtered);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };

    fetchEvents();
  }, [showPast]);

  const categories = ['Technology', 'Cultural', 'Business', 'Sports', 'Arts', 'Academic'];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.club.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(event.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">
            Campus Events
          </h1>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events, categories, or clubs..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-lg border border-orange-600 text-orange-600 font-semibold hover:bg-orange-600 hover:text-white transition"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={20} />
              <span>Filter</span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {isFilterOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedCategories.includes(category)
                            ? 'bg-orange-200 text-orange-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Date Range</h3>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 transition"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Sort By</h3>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 transition"
                  >
                    <option value="dateAsc">Date (Nearest First)</option>
                    <option value="dateDesc">Date (Furthest First)</option>
                    <option value="titleAsc">Title (A-Z)</option>
                    <option value="titleDesc">Title (Z-A)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  className="px-5 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => {
                    setSelectedCategories([]);
                    setDateRange('all');
                    setSearchQuery('');
                  }}
                >
                  Clear All
                </button>
                <button
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="mb-4 text-right">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={() => setShowPast(prev => !prev)}
          >
            {showPast ? 'Show Upcoming Events' : 'Show Past Events'}
          </button>
        </div>

        <section>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={`${API_BASE_URL}${event.bannerImageUrl}`}
                      alt="Event Banner"
                      className="w-full h-full object-contain object-center bg-black"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
                      <img
                        src={`${API_BASE_URL}${event.clubLogoUrl}`}
                        alt="Club Logo"
                        className="w-10 h-10 rounded-full object-contain bg-white p-1"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-semibold">
                      {event.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-5 text-gray-600 text-sm mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        <span>{event.building}, {event.venue}</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="inline-block text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md px-6 py-3 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <Calendar size={64} className="mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-2">No events found</h3>
              <p className="mb-6 max-w-md mx-auto">
                Try adjusting your search or filter criteria.
              </p>
              <button
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
                onClick={() => {
                  setSelectedCategories([]);
                  setDateRange('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventsPage;
