import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, Calendar, Award, ChevronDown } from 'lucide-react';

type Club = {
  _id: string;
  name: string;
  clubLogo: string;
  memberCount: number;
  department: string;
  clubPhoto: string;
  description: string;
  president: string;
  email: string;
  establishedYear: number;
  totalEvents: number;
  achievements: string[];
};

const ClubsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const departments = [
    'IT',
    'CSE', 
    'MECHANICAL',
    'CIVIL',
    'DESIGN',
    'MANET'
  ];

  // Sample clubs data
  const [clubs, setClubs] = useState<Club[]>([]);

useEffect(() => {
  const fetchClubs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/club/all');
      const data = await res.json();

      if (Array.isArray(data)) {
        setClubs(data); // ✅ correct format
      } else if (Array.isArray(data.clubs)) {
        setClubs(data.clubs); // ✅ fallback if wrapped in "clubs" key
      } else {
        console.error('Unexpected clubs response:', data);
        setClubs([]);
      }
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
      setClubs([]);
    }
  };

  fetchClubs();
}, []);


  // Filter clubs based on search query and department
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      searchQuery === '' ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.president.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'all' || club.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="bg-neutral-50 min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Campus Clubs</h1>
          <p className="text-neutral-600">
            Discover and join the diverse clubs across different departments
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search clubs, presidents, or descriptions..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="btn-outline flex items-center justify-center"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} className="mr-2" />
              <span>Filter</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform duration-200 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Filter Options */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-neutral-200 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departments */}
                <div>
                  <h3 className="font-medium mb-3">Department</h3>
                  <select
                    className="input"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <select className="input">
                    <option value="nameAsc">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                    <option value="membersDesc">Most Members</option>
                    <option value="membersAsc">Least Members</option>
                    <option value="eventsDesc">Most Events</option>
                    <option value="establishedDesc">Newest First</option>
                    <option value="establishedAsc">Oldest First</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="btn-outline mr-2"
                  onClick={() => {
                    setSelectedDepartment('all');
                    setSearchQuery('');
                  }}
                >
                  Clear All
                </button>
                <button className="btn-primary" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Department Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {clubs.length}
            </div>
            <div className="text-sm text-neutral-600">All Clubs</div>
          </div>
          {departments.map((dept) => (
            <div key={dept} className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">
                {clubs.filter(club => club.department === dept).length}
              </div>
              <div className="text-sm text-neutral-600">{dept}</div>
            </div>
          ))}
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club) => (
              <div key={club._id} className="card card-hover overflow-hidden group">
  {/* Club Photo Banner */}
  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
    <img
      src={`http://localhost:5000${club.clubPhoto}`}
      alt={`${club.name} Banner`}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    {/* Club Logo on Top-Left */}
    {club.clubLogo && (
      <img
        src={`http://localhost:5000${club.clubLogo}`}
        alt={`${club.name} Logo`}
        className="absolute top-3 left-3 w-12 h-12 rounded-full border-2 border-white object-contain p-1 shadow-md"
      />
    )}

    {/* Department Badge */}
    <div className="absolute top-3 right-3 bg-primary-100 text-primary-700 px-2 py-1 rounded-lg text-xs font-medium">
      {club.department}
    </div>

    {/* Established Date */}
    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
      <div className="text-xs text-neutral-600">Est. {club.establishedYear}</div>
    </div>
  </div>
                
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  {club.clubName}
                </h3>
                
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                  {club.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-neutral-600">
                    <Users size={16} className="mr-1 text-neutral-400" />
                    <span>{club.memberCount} members</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Calendar size={16} className="mr-1 text-neutral-400" />
                    <span>{club.totalEvents} events</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-neutral-600 mb-1">President:  {club.name}</div>
                </div>
                
                {club.achievements.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-neutral-600 mb-2">
                      <Award size={14} className="mr-1 text-warning-500" />
                      <span>Recent Achievement:</span>
                    </div>
                    <div className="text-xs text-warning-700 bg-warning-50 px-2 py-1 rounded-full">
                      {club.achievements[0]}
                    </div>
                  </div>
                )}
                
                <Link
                  to={`/clubs/${club._id}`}
                  className="btn-primary w-full text-center"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-neutral-400 mb-4">
                <Users size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-2">No clubs found</h3>
              <p className="text-neutral-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedDepartment('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;