import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Club = {
  _id: string;
  clubName: string;
  clubLogo: string;
  memberCount: number;
  department: string;
};

const FeaturedClubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/club/all`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setClubs(data);
        }
      } catch (err) {
        console.error('❌ Error fetching clubs:', err);
      }
    };

    fetchClubs();
  }, []);

  return (
    <section className="pt-10 bg-white transform -translate-y-10">
      <div className="w-full max-w-[90rem] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between mb-10">
          <div className="text-center my-8">
            <h1
              className="text-3xl font-extrabold text-neutral-900 font-poppins"
              style={{
                textShadow: '0 0 4px rgba(255, 255, 255, 0.1), 0 0 8px rgba(0, 123, 255, 0.2), 0 0 12px rgba(0, 123, 255, 0.3)',
                marginLeft: '590px',
              }}
            >
              Featured Clubs
            </h1>
          </div>

          <Link
            to="/clubs"
            className="mt-4 md:mt-0 flex items-center text-[#d10000] hover:text-[#b30000] font-medium no-underline"
          >
            <span>See All Clubs</span>
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="flex flex-col items-center text-center group border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-neutral-200 transition-all duration-300 group-hover:border-[#d10000] group-hover:shadow-lg">
                <img
                  src={`${API_BASE_URL}${club.clubLogo}`}
                  alt={club.clubName}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <h3 className="font-medium mb-1 group-hover:text-[#d10000] transition-colors">
                {club.clubName}
              </h3>
              <p className="text-sm text-neutral-500">{club.department}</p>
              <p className="text-xs text-neutral-400">{club.memberCount} members</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/clubs"
            className="inline-flex items-center text-white bg-[#d10000] hover:bg-[#b30000] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <span>See More Clubs</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedClubs;
