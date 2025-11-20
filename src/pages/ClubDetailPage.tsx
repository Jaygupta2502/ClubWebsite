import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Calendar, Award, Mail, Building, Sparkles } from 'lucide-react';

const ClubDetailPage: React.FC = () => {
  const { id } = useParams();
  const [club, setClub] = useState<any>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/club/${id}`);
        const data = await res.json();
        setClub(data);
      } catch (err) {
        console.error('Failed to fetch club details:', err);
      }
    };

    if (id) fetchClub();
  }, [id]);

  if (!club) return <div className="p-10 text-center text-neutral-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center sticky top-24">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md">
                {club.clubLogo ? (
                  <img
                    src={`http://localhost:5000${club.clubLogo}`}
                    alt="Club Logo"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                    <Building size={32} className="text-neutral-400" />
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-neutral-800">{club.clubName}</h3>
              <p className="text-sm text-indigo-500 font-medium">{club.department}</p>
              <p className="text-xs text-neutral-500">{club.email}</p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg shadow-sm">
                  <span className="flex items-center text-sm text-neutral-700">
                    <Users size={16} className="mr-2 text-indigo-500" /> Members
                  </span>
                  <span className="font-semibold text-neutral-900">{club.memberCount}</span>
                </div>
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg shadow-sm">
                  <span className="flex items-center text-sm text-neutral-700">
                    <Calendar size={16} className="mr-2 text-indigo-500" /> Events
                  </span>
                  <span className="font-semibold text-neutral-900">{club.totalEvents}</span>
                </div>
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg shadow-sm">
                  <span className="flex items-center text-sm text-neutral-700">
                    <Award size={16} className="mr-2 text-indigo-500" /> Established
                  </span>
                  <span className="font-semibold text-neutral-900">{club.establishedYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {club.clubPhoto && (
                <div className="h-64 w-full rounded-xl overflow-hidden mb-6">
                  <img
                    src={`http://localhost:5000${club.clubPhoto}`}
                    alt="Club Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                {club.clubName}
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-6 whitespace-pre-wrap text-lg">
                {club.description}
              </p>

              {club.achievements?.length > 0 && (
                <div className="mt-10 p-6 bg-gradient-to-tr from-pink-100 via-rose-50 to-violet-100 rounded-2xl shadow-md">
                  <div className="flex items-center mb-4">
                    <Sparkles size={20} className="text-violet-600 mr-2" />
                    <h3 className="text-2xl font-bold text-violet-700">Key Achievements</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {club.achievements.map((a: string, index: number) => (
                      <div
                        key={index}
                        className="bg-white border border-violet-200 rounded-lg px-4 py-3 shadow hover:shadow-md transition-all hover:scale-[1.02]"
                      >
                        <p className="text-sm text-neutral-800 font-medium">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailPage;
