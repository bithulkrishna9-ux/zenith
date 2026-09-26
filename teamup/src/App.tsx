import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/layout/ToastContainer';
import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeamLeaderDashboard } from './pages/TeamLeaderDashboard';
import { FindTeams } from './pages/FindTeams';
import { FindTeammates } from './pages/FindTeammates';
import { EventsPage } from './pages/EventsPage';
import { ProjectBoardPage } from './pages/ProjectBoardPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { CreateTeamModal } from './components/teams/CreateTeamModal';
import { TeamDetailsModal } from './components/teams/TeamDetailsModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { PortalSwitcherBar } from './components/layout/PortalSwitcherBar';
import { Student, Team } from './types';
import { Shield, Sparkles, Users, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, currentRole, isAdmin, createOrOpenDirectChat } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [preselectedEventId, setPreselectedEventId] = useState<string | undefined>();
  const [inspectedTeam, setInspectedTeam] = useState<Team | null>(null);
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);

  const handleOpenCreateTeam = (eventId?: string) => {
    setPreselectedEventId(eventId);
    setShowCreateTeamModal(true);
  };

  const handleOpenChatWithStudent = (student: Student) => {
    createOrOpenDirectChat(student);
    setCurrentTab('chat');
  };

  const handleManageTeam = (team: Team) => {
    setInspectedTeam(team);
    setCurrentTab('team-leader');
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-900 flex flex-col justify-between selection:bg-blue-600/20 selection:text-blue-900 font-uber relative overflow-x-hidden">
      {/* Crisp White & Dark Blue Atmospheric gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-blue-900/8 via-sky-600/5 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[30%] -right-40 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -left-40 w-[600px] h-[600px] bg-slate-100/70 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCreateTeam={() => handleOpenCreateTeam()}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenCreateTeam={() => handleOpenCreateTeam()}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenCreateTeam={() => handleOpenCreateTeam()}
            onSelectTeamDetails={(team) => setInspectedTeam(team)}
          />
        )}

        {currentTab === 'team-leader' && (
          <TeamLeaderDashboard
            selectedTeam={inspectedTeam || undefined}
            onNavigate={(tab) => setCurrentTab(tab)}
            onViewStudentProfile={(student) => setInspectedStudent(student)}
            onOpenChatWithStudent={handleOpenChatWithStudent}
          />
        )}

        {currentTab === 'find-teams' && (
          <FindTeams
            onSelectTeamDetails={(team) => setInspectedTeam(team)}
            onOpenCreateTeam={() => handleOpenCreateTeam()}
          />
        )}

        {currentTab === 'find-teammates' && (
          <FindTeammates
            onViewProfile={(student) => setInspectedStudent(student)}
            onOpenChat={handleOpenChatWithStudent}
          />
        )}

        {currentTab === 'events' && (
          <EventsPage
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenCreateTeamWithEvent={(eventId) => handleOpenCreateTeam(eventId)}
          />
        )}

        {currentTab === 'projects' && <ProjectBoardPage />}

        {currentTab === 'chat' && <ChatPage />}

        {currentTab === 'profile' && <ProfilePage />}

        {currentTab === 'admin' && <AdminDashboard />}

        {currentTab === 'auth' && (
          <AuthPage
            onSuccess={() => setCurrentTab('dashboard')}
            onNavigateHome={() => setCurrentTab('landing')}
          />
        )}
      </main>

      {/* Global Modals */}
      <CreateTeamModal
        isOpen={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        preselectedEventId={preselectedEventId}
        onTeamCreated={(teamId) => {
          setCurrentTab('dashboard');
        }}
      />

      <TeamDetailsModal
        team={inspectedTeam}
        onClose={() => setInspectedTeam(null)}
        onManageTeam={handleManageTeam}
      />

      <StudentProfileModal
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        onOpenChat={handleOpenChatWithStudent}
      />

      {/* Floating Portal Switcher Bar at the Bottom */}
      <PortalSwitcherBar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Floating Notifications */}
      <ToastContainer />

      {/* Modern White & Dark Blue Liquid-Glass Footer */}
      <footer className="border-t border-slate-200/90 liquid-glass py-10 px-4 sm:px-6 lg:px-8 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B192C] to-[#1E40AF] flex items-center justify-center text-white shadow-sm shadow-blue-900/30">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
              </svg>
            </div>
            <div className="flex items-center text-base tracking-tight font-uber font-bold text-[#0B192C]">
              team<span className="font-extrabold text-[#2563eb]">up</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">College-Exclusive Smart Squad &amp; Hackathon Formation</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-center font-medium">
            <span>"Find the squad that needs your skills, or find the teammates your project needs."</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-semibold">
            <span className="hover:text-[#0B192C] cursor-pointer transition">Guidelines</span>
            <span>•</span>
            <span className="hover:text-[#0B192C] cursor-pointer transition">Verified College ID</span>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('admin')}
              className="hover:text-[#0B192C] cursor-pointer transition text-slate-600 hover:underline font-semibold"
            >
              Admin
            </button>
            <span>•</span>
            <span className="text-[#1E40AF] font-bold">2026 Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
