import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import DashboardHeader from '../components/navigation/DashboardHeader';
import MessageCenter from '../components/communication/MessageCenter';
import { useState } from 'react';

type DashboardLayoutProps = {
  role: 'president' | 'venue_coordinator' | 'faculty' | 'hod' | 'dean' | 'director';
};

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-100">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onOpenMessages={() => setIsMessageCenterOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
        {isMessageCenterOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up">
              <MessageCenter onClose={() => setIsMessageCenterOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;