import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  User, Mail, Lock, Upload, Save, Eye, EyeOff, 
  Building, Calendar, Users, Award, Camera, Edit, MapPin
} from 'lucide-react';

const VenueCoordinatorProfile: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jamie Smith',
    email: user?.email || 'jamie.smith@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    theme: theme,
    department: 'Administration',
    experience: '5 years',
    specialization: 'Venue Management',
    phone: '+1 (555) 123-4567',
    office: 'Admin Block, Room 205',
    venuesManaged: '8',
    totalBookings: '156',
    monthlyBookings: '24'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'theme') {
      setTheme(value as 'light' | 'dark' | 'system');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      name: user?.name || 'Jamie Smith',
      email: user?.email || 'jamie.smith@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      theme: theme,
      department: 'Administration',
      experience: '5 years',
      specialization: 'Venue Management',
      phone: '+1 (555) 123-4567',
      office: 'Admin Block, Room 205',
      venuesManaged: '8',
      totalBookings: '156',
      monthlyBookings: '24'
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
        <p className="text-neutral-600">Manage your venue coordinator information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-primary-600" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <h3 className="text-lg font-semibold">{profileData.name}</h3>
              <p className="text-neutral-600">Venue Coordinator</p>
              <p className="text-sm text-primary-600">{profileData.department}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Building size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm">Venues Managed</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{profileData.venuesManaged}</span>
                  {isEditing && (
                    <Edit size={12} className="text-neutral-400" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm">Total Bookings</span>
                </div>
                <span className="font-medium">{profileData.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Users size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm">This Month</span>
                </div>
                <span className="font-medium">{profileData.monthlyBookings}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Award size={16} className="text-neutral-400 mr-2" />
                  <span className="text-sm">Experience</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{profileData.experience}</span>
                  {isEditing && (
                    <Edit size={12} className="text-neutral-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Profile Information</h2>
              {!isEditing ? (
                <button 
                  className="btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    className="btn-outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary flex items-center"
                    onClick={handleSave}
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-md font-semibold mb-4 text-neutral-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="input pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-neutral-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="input pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-md font-semibold mb-4 text-neutral-800">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={profileData.specialization}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Office Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={16} className="text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        name="office"
                        value={profileData.office}
                        onChange={handleInputChange}
                        className="input pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              {isEditing && (
                <div className="border-t border-neutral-200 pt-6">
                  <h3 className="text-md font-semibold mb-4 text-neutral-800">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-neutral-400" />
                        </div>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={profileData.currentPassword}
                          onChange={handleInputChange}
                          className="input pl-10 pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={16} className="text-neutral-400" />
                          ) : (
                            <Eye size={16} className="text-neutral-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-neutral-400" />
                          </div>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={profileData.newPassword}
                            onChange={handleInputChange}
                            className="input pl-10 pr-10"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff size={16} className="text-neutral-400" />
                            ) : (
                              <Eye size={16} className="text-neutral-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-neutral-400" />
                          </div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={profileData.confirmPassword}
                            onChange={handleInputChange}
                            className="input pl-10"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-md font-semibold mb-4 text-neutral-800">Preferences</h3>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={profileData.theme}
                    onChange={handleInputChange}
                    className="input max-w-xs"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">
                    Choose your preferred theme. System will follow your device's theme setting.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCoordinatorProfile;