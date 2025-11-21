import React, { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_BASE_URL;
const ClubProfile = () => {
  const [clubData, setClubData] = useState(null);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const res = await fetch(`${API}/api/club/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setClubData(data);
      } catch (err) {
        console.error('Failed to fetch club profile:', err);
      }
    };

    fetchClubDetails();
  }, []);

  if (!clubData) return <p className="p-4">Loading club profile...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Club Profile</h2>
      <p><strong>Club Name:</strong> {clubData.clubName}</p>
      <p><strong>President:</strong> {clubData.president}</p>
      <p><strong>Email:</strong> {clubData.email}</p>
      <p><strong>Description:</strong> {clubData.description || 'N/A'}</p>
    </div>
  );
};

export default ClubProfile;
