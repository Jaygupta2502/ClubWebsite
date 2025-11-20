import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type LocationState = {
  from?: {
    pathname: string;
  };
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || '/';

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  setError("");
  setIsLoading(true);

  try {
    await login(email, password);
    const user = JSON.parse(localStorage.getItem("campusEventsUser") || "{}");

    console.log("🔐 Logged in user:", user);
    console.log("🧠 Role received:", user.role);console.log("🧠 Role received:", user.role);
    toast.success('Login successful!');
    navigate('/');
  } catch (err) {
    console.error("❌ Login failed:", err);
    setError("Invalid email or password");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        {/* Form Section */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Calendar size={28} className="text-accent-500 mr-2" />
              <h1 className="text-2xl font-bold">Campus Events</h1>
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-neutral-600">Log in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-neutral-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-neutral-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block relative bg-primary-900">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800/90 to-primary-950/90 z-10"></div>
          <img
            src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
            alt="Campus event"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 h-full flex flex-col justify-center p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Manage Your Campus Events</h2>
            <p className="mb-6">
              Create, organize, and promote events on campus. Connect with students and
              faculty members.
            </p>
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((num) => (
                  <img
                    key={num}
                    src={`https://i.pravatar.cc/150?img=${num}`}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-sm">Join thousands of users on our platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;