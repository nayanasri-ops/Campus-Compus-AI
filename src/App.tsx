import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FloatingCompassAI } from './components/FloatingCompassAI';
import { AuthGateway } from './components/auth/AuthGateway';
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { CommunityView } from './components/views/CommunityView';
import { TrustCenterView } from './components/views/TrustCenterView';
import { SkillSwapView } from './components/views/SkillSwapView';
import { AIAdvisorView } from './components/views/AIAdvisorView';
import { CoursesView } from './components/views/CoursesView';
import { ElectivesView } from './components/views/ElectivesView';
import { JavaLabView } from './components/views/JavaLabView';
import { ResumeAnalyzerView } from './components/views/ResumeAnalyzerView';
import { PlacementReadinessView } from './components/views/PlacementReadinessView';
import { MockInterviewView } from './components/views/MockInterviewView';
import { ProjectsView } from './components/views/ProjectsView';
import { CareerRoadmapView } from './components/views/CareerRoadmapView';
import { HackathonsView } from './components/views/HackathonsView';
import { InternshipsView } from './components/views/InternshipsView';
import { IndustryTrendsView } from './components/views/IndustryTrendsView';
import { TimetableView } from './components/views/TimetableView';
import { ProfileOptimizerView } from './components/views/ProfileOptimizerView';
import { GamificationView } from './components/views/GamificationView';
import { StudentProfileView } from './components/views/StudentProfileView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { api } from './services/api';
import {
  User,
  Career,
  Course,
  Elective,
  Hackathon,
  Internship,
  SkillSwapRequest,
  CodingChallenge,
  NotificationItem,
  AdminScoringWeights
} from './types';
import {
  mockCurrentUser,
  mockAdminUser,
  mockCourses,
  mockCareers,
  mockElectives,
  mockHackathons,
  mockInternships,
  mockJavaChallenges,
  mockNotifications,
  initialScoringWeights
} from './data/mockData';

export function App() {
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cc_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCompassAIOpen, setIsCompassAIOpen] = useState<boolean>(false);

  // Data collections
  const [careers, setCareers] = useState<Career[]>(mockCareers);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [electives, setElectives] = useState<Elective[]>(mockElectives);
  const [hackathons, setHackathons] = useState<Hackathon[]>(mockHackathons);
  const [internships, setInternships] = useState<Internship[]>(mockInternships);
  const [requests, setRequests] = useState<SkillSwapRequest[]>([]);
  const [challenges, setChallenges] = useState<CodingChallenge[]>(mockJavaChallenges);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [scoringWeights, setScoringWeights] = useState<AdminScoringWeights>(initialScoringWeights);

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      const [userRes, careersRes, coursesRes, electivesRes, hackRes, internRes, reqsRes, notifsRes] = await Promise.all([
        api.getMe(),
        api.getCareers(),
        api.getCourses(),
        api.getElectives(),
        api.getHackathons(),
        api.getInternships(),
        api.getSkillSwapRequests(),
        api.getNotifications(),
      ]);

      if (userRes.user) setCurrentUser(userRes.user);
      if (careersRes.careers) setCareers(careersRes.careers);
      if (careersRes.weights) setScoringWeights(careersRes.weights);
      if (coursesRes.courses) setCourses(coursesRes.courses);
      if (electivesRes.electives) setElectives(electivesRes.electives);
      if (hackRes.hackathons) setHackathons(hackRes.hackathons);
      if (internRes.internships) setInternships(internRes.internships);
      if (reqsRes.requests) setRequests(reqsRes.requests);
      if (notifsRes.notifications) setNotifications(notifsRes.notifications);
    } catch (err) {
      console.warn('Initial data load fallback to local presets:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout warning:', err);
    }
    try {
      sessionStorage.removeItem('cc_logged_in');
    } catch {}
    setIsAuthenticated(false);
  };

  const handleSwitchUser = async (role: 'STUDENT' | 'ADMIN') => {
    const targetEmail =
      role === 'STUDENT'
        ? 'arjun.reddy@vnrvjiet.ac.in'
        : 'dean.placements@vnrvjiet.ac.in';

    try {
      const res = await api.login(targetEmail);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (role === 'ADMIN') setActiveTab('admin');
        else setActiveTab('dashboard');
      }
    } catch (err) {
      setCurrentUser(role === 'STUDENT' ? mockCurrentUser : mockAdminUser);
    }
  };

  // Section 2: Mandatory login/registration screen as the very first screen
  if (!isAuthenticated) {
    return (
      <AuthGateway
        onAuthenticated={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          try {
            sessionStorage.setItem('cc_logged_in', 'true');
          } catch {}
          setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar adhering to 3-zone contract */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onSwitchUser={handleSwitchUser}
        onOpenCompassAI={() => setIsCompassAIOpen(true)}
        onLogout={handleLogout}
      />

      {/* Landing View (Full Page Hero) */}
      {activeTab === 'landing' ? (
        <main className="flex-1">
          <LandingPage
            onGetStarted={() => setActiveTab('dashboard')}
            onExploreSkillSwap={() => setActiveTab('skillswap')}
            onMeetCompassAI={() => setIsCompassAIOpen(true)}
          />
        </main>
      ) : (
        /* Authenticated Workspace Layout */
        <div className="flex-1 flex w-full relative">
          {/* Collapsible Sidebar */}
          <Sidebar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          {/* Main Viewport */}
          <main
            className={`flex-1 transition-all duration-300 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full ${
              sidebarCollapsed ? 'ml-16' : 'ml-16 md:ml-64'
            }`}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                careers={careers}
                courses={courses}
                electives={electives}
                requests={requests}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'community' && (
              <CommunityView
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
                onSwitchUser={setCurrentUser}
              />
            )}

            {activeTab === 'trustcenter' && (
              <TrustCenterView
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
              />
            )}

            {activeTab === 'skillswap' && (
              <SkillSwapView
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
              />
            )}

            {activeTab === 'advisor' && (
              <AIAdvisorView
                currentUser={currentUser}
                careers={careers}
                weights={scoringWeights}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'courses' && <CoursesView courses={courses} />}

            {activeTab === 'electives' && <ElectivesView electives={electives} />}

            {activeTab === 'javalab' && (
              <JavaLabView
                currentUser={currentUser}
                challenges={challenges}
                onUpdateUser={setCurrentUser}
              />
            )}

            {activeTab === 'resume' && (
              <ResumeAnalyzerView currentUser={currentUser} />
            )}

            {activeTab === 'placement' && (
              <PlacementReadinessView
                currentUser={currentUser}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'mockinterview' && (
              <MockInterviewView currentUser={currentUser} />
            )}

            {activeTab === 'projects' && (
              <ProjectsView currentUser={currentUser} />
            )}

            {activeTab === 'roadmap' && (
              <CareerRoadmapView currentUser={currentUser} />
            )}

            {activeTab === 'hackathons' && (
              <HackathonsView hackathons={hackathons} />
            )}

            {activeTab === 'internships' && (
              <InternshipsView internships={internships} />
            )}

            {activeTab === 'trends' && <IndustryTrendsView />}

            {activeTab === 'timetable' && (
              <TimetableView currentUser={currentUser} />
            )}

            {activeTab === 'optimizer' && (
              <ProfileOptimizerView currentUser={currentUser} />
            )}

            {activeTab === 'gamification' && (
              <GamificationView
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
              />
            )}

            {activeTab === 'profile' && (
              <StudentProfileView
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
                onNavigateToCommunity={() => setActiveTab('community')}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardView currentUser={currentUser} />
            )}
          </main>
        </div>
      )}

      {/* Floating 24/7 Compass AI Assistant */}
      <FloatingCompassAI
        isOpen={isCompassAIOpen}
        onClose={() => setIsCompassAIOpen(false)}
        currentUser={currentUser}
      />

      {/* Quick Launch Floating Orb if modal is closed */}
      {!isCompassAIOpen && (
        <button
          onClick={() => setIsCompassAIOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white shadow-2xl shadow-indigo-600/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
          aria-label="Open Compass AI Assistant"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-300 absolute top-2 right-2 animate-ping" />
          <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}
    </div>
  );
}
export default App;
