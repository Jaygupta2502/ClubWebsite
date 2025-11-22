import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, ExternalLink, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Backend recruitment type (updated to match DB)
type Recruitment = {
  _id: string;
  club: string;
  title: string;
  description: string;
  googleFormUrl: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: 'Active' | 'Closed' | 'Draft' | 'Expired';
  applicants: number;
  clubLogoUrl?: string;
};

const RecruitmentForms: React.FC = () => {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH real recruitments from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recruitments`)
      .then((res) => res.json())
      .then((data) => {
        setRecruitments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching recruitments:', err);
        setLoading(false);
      });
  }, []);

  // Function to determine if recruitment is currently active (based on date+status)
  const isActiveNow = (r: Recruitment) => {
    const now = new Date();
    const start = new Date(`${r.startDate}T${r.startTime}`);
    const end = new Date(`${r.endDate}T${r.endTime}`);
    return now >= start && now <= end;
  };

  // Show only active + date-valid recruitments
  const activeRecruitments = recruitments.filter((r) => {
    const active = r.status === "Active" || r.status === "Draft";
    return active && isActiveNow(r);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>;
      case 'Closed':
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">Closed</span>;
      case 'Draft':
        return <span className="bg-warning-100 text-warning-700 px-2 py-1 rounded-full text-xs font-medium">Draft</span>;
      case 'Expired':
        return <span className="bg-error-100 text-error-700 px-2 py-1 rounded-full text-xs font-medium">Expired</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <section className="pt-16 pb-6 bg-neutral-50 -translate-y-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-10">
          <div
            className="text-3xl font-extrabold text-neutral-900 font-poppins"
            style={{
              textShadow:
                '0 0 4px rgba(255, 255, 255, 0.1), 0 0 8px rgba(0, 123, 255, 0.2), 0 0 12px rgba(0, 123, 255, 0.3)',
              marginLeft: '500px',
            }}
          >
            <h2 className="text-3xl font-bold text-neutral-900">Club Recruitments</h2>
          </div>

          <Link
            to="/clubs"
            className="mt-4 md:mt-0 flex items-center text-[#d10000] hover:text-[#b30000] font-medium"
          >
            <span>View All Clubs</span>
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-neutral-600 py-10">Loading recruitments...</p>
        )}

        {/* Cards */}
        {!loading && activeRecruitments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeRecruitments.map((recruitment) => (
              <div
                key={recruitment._id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in"
              >
                <div className="relative">
                  <img
                    src={recruitment.clubLogoUrl || "https://via.placeholder.com/300"}
                    alt={recruitment.club}
                    className="w-full h-48 object-cover"
                  />

                  <div className="absolute top-3 left-3">
                    <div className="bg-white rounded-full p-1 shadow-md">
                      <img
                        src={recruitment.clubLogoUrl || "https://via.placeholder.com/300"}
                        alt={recruitment.club}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    {getStatusBadge("Active")}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 mb-2">
                    {recruitment.title}
                  </h3>

                  <div className="text-sm text-gray-600 mb-1 font-medium">
                    {recruitment.club}
                  </div>

                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {recruitment.description}
                  </p>

                  <div className="flex items-center text-sm text-neutral-600 mb-1">
                    <Calendar size={16} className="mr-2 text-[#d10000]" />
                    <span>{recruitment.startDate} - {recruitment.endDate}</span>
                  </div>

                  <div className="flex items-center text-sm text-neutral-600 mb-4">
                    <Clock size={16} className="mr-2 text-[#d10000]" />
                    <span>{recruitment.startTime} - {recruitment.endTime}</span>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={recruitment.clubLogoUrl || "https://via.placeholder.com/300"}
                        alt={recruitment.club}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs text-gray-500">{recruitment.club}</span>
                    </div>

                    <Link
                      to={`/clubs/${recruitment._id}`}
                      className="text-sm font-medium text-[#d10000] hover:text-[#b30000] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Apply Button */}
                  <div className="mt-4">
                    <a
                      href={recruitment.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-white bg-[#d10000] hover:bg-[#b30000] font-semibold px-4 py-2 rounded-full text-sm w-full"
                    >
                      <span>Apply Now</span>
                      <ExternalLink size={14} className="ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-neutral-600 py-10">
              No active recruitments available right now.
            </p>
          )
        )}

        {/* Footer Button */}
        <div className="mt-10 text-center">
          <Link
            to="/clubs"
            className="inline-flex items-center text-white bg-[#d10000] hover:bg-[#b30000] font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <span>See All Recruitments</span>
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentForms;
