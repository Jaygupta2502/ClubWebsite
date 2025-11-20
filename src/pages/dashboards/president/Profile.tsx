import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import {
  User, Upload, Save, Building, Calendar, Users, Award, Camera, Edit, Image as ImageIcon
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
  clubName: '',
  clubLogo: '',
  clubPhoto: '',
  establishedYear: '',
  memberCount: '',
  totalEvents: '',
  achievements: [],
  department: '',
  description: ''
});


  useEffect(() => {
   const fetchProfile = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/club/profile", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!res.ok) {
      console.error("❌ Failed to fetch profile: " + res.status);
      return;
    }

    const data = await res.json();
    setProfileData(data);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
  }
};

    const fetchEventCount = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
    const res = await fetch('http://localhost:5000/api/events/club/total', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   const data = await res.json();
setProfileData(prev => ({
  ...prev,
  clubName: data.clubName || '',
  clubLogo: data.clubLogo || '',
  clubPhoto: data.clubPhoto || '',
  establishedYear: data.establishedYear || '',
  memberCount: data.memberCount || '',
  totalEvents: data.totalEvents || '',
  achievements: Array.isArray(data.achievements) ? data.achievements : [],
  department: data.department || '',
  description: data.description || '',
}));
  } catch (err) {
    console.error('Failed to fetch event count:', err);
  }
};

    fetchProfile();
    fetchEventCount();
  }, []);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };



  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prev) => ({
        ...prev,
        clubLogo: e.target.files![0]
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prev) => ({
        ...prev,
        clubPhoto: e.target.files![0]
      }));
    }
  };

  const handleSave = async () => {
  try {
    const formData = new FormData();

    formData.append('clubName', profileData.clubName || '');
    formData.append('description', profileData.description || '');
    formData.append('establishedYear', profileData.establishedYear || '');
    formData.append('memberCount', profileData.memberCount || '');
    formData.append('totalEvents', profileData.totalEvents || '');
    formData.append('achievements', JSON.stringify(profileData.achievements || []));

    if (profileData.clubLogo instanceof File) {
      formData.append('clubLogo', profileData.clubLogo);
    }

    if (profileData.clubPhoto instanceof File) {
      formData.append('clubPhoto', profileData.clubPhoto);
    }

    const token = JSON.parse(localStorage.getItem('campusEventsUser'))?.token;
    const res = await fetch('http://localhost:5000/api/club/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`
        // DO NOT set 'Content-Type' here — let the browser do it
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    toast.success('Profile updated successfully!');
    setProfileData(data); // ✅
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    toast.error('Failed to update profile');
  }
};


  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Club Profile</h1>
        <p className="text-neutral-600">Manage your club's information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {typeof profileData.clubLogo === 'string' && profileData.clubLogo !== '' ? (
  <img
    src={`http://localhost:5000${profileData.clubLogo}`}
    alt="Club Logo"
    className="w-full h-full object-cover"
  />
) : profileData.clubLogo instanceof File ? (
  <img
    src={URL.createObjectURL(profileData.clubLogo)}
    alt="Preview"
    className="w-full h-full object-cover"
  />
) : (
  <Building size={32} className="text-primary-600" />
)}
                </div>
              </div>
              <h3 className="text-lg font-semibold">{profileData.clubName}</h3>
              <p className="text-sm text-neutral-600">Club President</p>
              <p className="text-sm text-primary-600">{profileData.department}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Users size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm">Members</span>
                </div>
                <span className="font-medium mr-2">{profileData.memberCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm">Events</span>
                </div>
                <span className="font-medium">{profileData.totalEvents}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Award size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm">Established</span>
                </div>
                <span className="font-medium mr-2">{profileData.establishedYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Club Information</h2>
              {!isEditing ? (
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button className="btn-outline" onClick={handleCancel}>Cancel</button>
                  <button className="btn-primary flex items-center" onClick={handleSave}>
                    <Save size={16} className="mr-2" /> Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Club Logo</label>
                 <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, clubLogo: file }));
    }
  }}
/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Club Photo</label>
                  <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, clubPhoto: file }));
    }
  }}
/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Club Name</label>
                  <input
                    type="text"
                    name="clubName"
                    value={profileData.clubName || ''}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Established Year</label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={profileData.establishedYear || ''}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Member Count</label>
                  <input
                    type="number"
                    name="memberCount"
                    value={profileData.memberCount || ''}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={profileData.department || ''}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={profileData.description || ''}
                    onChange={handleInputChange}
                    className="input"
                    rows={3}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Achievements (one per line)</label>
                  <textarea
                    name="achievements"
                   value={Array.isArray(profileData.achievements) ? profileData.achievements.join('\n') : ''}
onChange={(e) =>
  setProfileData((prev) => ({
    ...prev,
    achievements: e.target.value.split('\n')
  }))
}
                    className="input"
                    rows={4}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
