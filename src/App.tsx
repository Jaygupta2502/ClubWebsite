import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Adjust path if needed
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import PendingApprovalsPage from './pages/dashboards/admin/PendingApprovalsPage';
import PendingEventsHOD from './pages/dashboards/admin/PendingEventsHOD';



// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DeanEventsPage from './pages/dashboards/admin/DeanEventsPage';
import DeanDepartmentsPage from './pages/dashboards/admin/DeanDepartmentsPage';
import ReportHistory from './pages/dashboards/president/ReportHistory';
import EventHistoryHOD from './pages/dashboards/admin/EventHistoryHOD'; // Adjust path if needed
import Analytics from './pages/dashboards/president/Analytics';
import FlagshipEvent from './pages/dashboards/president/FlagshipEvent';



// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ClubsPage = lazy(() => import('./pages/ClubsPage'));
const ClubDetailPage = lazy(() => import('./pages/ClubDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const OfficeBearersPage = lazy(() => import('./pages/OfficeBearersPage'));


// Dashboard Pages
const PresidentDashboard = lazy(() => import('./pages/dashboards/president/PresidentDashboard'));
const VenueCoordinatorDashboard = lazy(() => import('./pages/dashboards/admin/VenueCoordinatorDashboard'));
const FacultyDashboard = lazy(() => import('./pages/dashboards/admin/FacultyDashboard'));
const HodDashboard = lazy(() => import('./pages/dashboards/admin/HodDashboard'));
const DeanDashboard = lazy(() => import('./pages/dashboards/admin/DeanDashboard'));
const DirectorDashboard = lazy(() => import('./pages/dashboards/admin/DirectorDashboard'));
const InstitutionOverview = lazy(() => import('./pages/dashboards/admin/InstitutionOverview'));


// Dashboard Components
const CreateEvent = lazy(() => import('./pages/dashboards/president/CreateEvent'));
const EventHistory = lazy(() => import('./pages/dashboards/president/EventHistory'));
const ClubRecruitment = lazy(() => import('./pages/dashboards/president/ClubRecruitment'));
const CalendarView = lazy(() => import('./pages/dashboards/shared/CalendarView'));
const Profile = lazy(() => import('./pages/dashboards/president/Profile'));
const FacultyProfile = lazy(() => import('./pages/dashboards/admin/FacultyProfile'));
const VenueCoordinatorProfile = lazy(() => import('./pages/dashboards/admin/VenueCoordinatorProfile'));
const HodProfile = lazy(() => import('./pages/dashboards/admin/HodProfile'));
const DeanProfile = lazy(() => import('./pages/dashboards/admin/DeanProfile'));
const DirectorProfile = lazy(() => import('./pages/dashboards/admin/DirectorProfile'));

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route path="clubs" element={<ClubsPage />} />
            <Route path="clubs/:id" element={<ClubDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="office-bearers" element={<OfficeBearersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* President Dashboard Routes */}
          <Route 
            path="/dashboard/president" 
            element={
              <ProtectedRoute allowedRoles={['club_president']}>
                <DashboardLayout role="president" />
              </ProtectedRoute>
            }
          >
            <Route index element={<PresidentDashboard />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="/dashboard/president/flagship-event" element={<FlagshipEvent />} />
            <Route path="recruitment" element={<ClubRecruitment />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="history" element={<EventHistory />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="profile" element={<Profile />} />

          </Route>

          {/* Admin Dashboard Routes */}
<Route 
  path="/dashboard/venue-coordinator" 
  element={
    <ProtectedRoute allowedRoles={['venue_coordinator']}>
      <DashboardLayout role="venue_coordinator" />
    </ProtectedRoute>
  }
>
  <Route index element={<VenueCoordinatorDashboard />} />
  <Route path="calendar" element={<CalendarView />} />
  <Route path="approvals" element={<PendingApprovalsPage />} /> {/* ✅ Add this line */}
  <Route path="profile" element={<VenueCoordinatorProfile />} />
</Route>


          <Route 
            path="/dashboard/faculty" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <DashboardLayout role="faculty" />
              </ProtectedRoute>
            }
          >
            <Route index element={<FacultyDashboard />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="profile" element={<FacultyProfile />} />
          </Route>

          <Route 
            path="/dashboard/hod" 
            element={
              <ProtectedRoute allowedRoles={['hod']}>
                <DashboardLayout role="hod" />
              </ProtectedRoute>
            }
          >
            <Route index element={<HodDashboard />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="pending-approvals" element={<PendingEventsHOD />} />
            <Route path="event-history" element={<EventHistoryHOD />} /> {/* ✅ Add this line here */}
            <Route path="profile" element={<HodProfile />} />

          </Route>

     <Route 
  path="/dashboard/dean" 
  element={
    <ProtectedRoute allowedRoles={['dean']}>
      <DashboardLayout role="dean" />
    </ProtectedRoute>
  }
>
  <Route index element={<DeanDashboard />} />
  <Route path="calendar" element={<CalendarView />} />
  <Route path="events" element={<DeanEventsPage />} />
  <Route path="departments" element={<DeanDepartmentsPage />} />
  <Route path="profile" element={<DeanProfile />} />
</Route>

<Route 
  path="/dashboard/director" 
  element={
    <ProtectedRoute allowedRoles={['director']}>
      <DashboardLayout role="director" />
    </ProtectedRoute>
  }
>
  <Route index element={<DirectorDashboard />} />
  <Route path="calendar" element={<CalendarView />} />
  <Route path="institution-overview" element={<InstitutionOverview />} />
  <Route path="profile" element={<DirectorProfile />} />
</Route>
<Route path="/dashboard/president/report-history" element={<ReportHistory />} />
          {/* Redirect for /dashboard */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/president\" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;