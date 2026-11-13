import { User, SkillSwapRequest, SkillSwapSession, ChatMessage, Course, Career, Elective, Project, Hackathon, Internship, CodingChallenge, ResumeAnalysisResult, MockInterviewResult, AdminScoringWeights, NotificationItem } from '../types';

const BASE_URL = '/api';

export const api = {
  // Auth
  async login(email: string): Promise<{ success: boolean; user: User; token?: string; message?: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    return res.json();
  },

  async verifyEmail(code: string): Promise<{ success: boolean; user?: User; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return res.json();
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    });
    return res.json();
  },

  async register(data: Partial<User>): Promise<{ success: boolean; user: User; token: string; message?: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/me`);
    return res.json();
  },

  // Profile
  async getProfile(): Promise<{ profile: User }> {
    const res = await fetch(`${BASE_URL}/students/profile`);
    return res.json();
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; profile: User }> {
    const res = await fetch(`${BASE_URL}/students/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getStudents(): Promise<{ students: User[] }> {
    const res = await fetch(`${BASE_URL}/students`);
    return res.json();
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${BASE_URL}/auth/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  async getCommunityUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${BASE_URL}/community/users`);
    return res.json();
  },

  async toggleConnect(targetUserId: string): Promise<{
    success: boolean;
    connected: boolean;
    connections: string[];
    targetConnectionsCount: number;
  }> {
    const res = await fetch(`${BASE_URL}/community/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId }),
    });
    return res.json();
  },

  async getDirectMessages(userId: string): Promise<{ messages: any[] }> {
    const res = await fetch(`${BASE_URL}/community/messages/${userId}`);
    return res.json();
  },

  async sendDirectMessage(receiverId: string, message: string): Promise<{ success: boolean; message: any }> {
    const res = await fetch(`${BASE_URL}/community/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId, message }),
    });
    return res.json();
  },

  async getCommunityAIRecommendations(): Promise<{
    recommendations: Array<{ userId: string; reason: string; matchPercentage?: number }>;
    message?: string;
  }> {
    const res = await fetch(`${BASE_URL}/community/ai-recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    return res.json();
  },

  async deleteCommunityUser(id: string): Promise<{ success: boolean; remaining: number }> {
    const res = await fetch(`${BASE_URL}/community/users/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // SkillSwap
  async getSkillSwapMatches(): Promise<{
    matches: Array<{
      student: User;
      compatibilityScore: number;
      matchReasons: string[];
      sharedInterests: string[];
      canTeachMe: string[];
      iCanTeach: string[];
      suggestedExchange: string;
    }>;
  }> {
    const res = await fetch(`${BASE_URL}/skillswap/matches`);
    return res.json();
  },

  async getSkillSwapRequests(): Promise<{ requests: SkillSwapRequest[] }> {
    const res = await fetch(`${BASE_URL}/skillswap/requests`);
    return res.json();
  },

  async sendSkillSwapRequest(data: {
    receiverId: string;
    skillOffered: string;
    skillRequested: string;
    message: string;
    availability: string;
    preferredMode: 'Online' | 'Offline' | 'Both';
  }): Promise<{ success: boolean; request: SkillSwapRequest }> {
    const res = await fetch(`${BASE_URL}/skillswap/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateSkillSwapRequest(
    id: string,
    data: {
      status?: string;
      rating?: { score: number; feedback: string };
      counterOffer?: { skillOffered: string; skillRequested: string; note: string };
    }
  ): Promise<{ success: boolean; request: SkillSwapRequest }> {
    const res = await fetch(`${BASE_URL}/skillswap/request/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getSkillSwapSessions(): Promise<{ sessions: SkillSwapSession[] }> {
    const res = await fetch(`${BASE_URL}/skillswap/sessions`);
    return res.json();
  },

  async createSkillSwapSession(data: {
    swapRequestId: string;
    title: string;
    scheduledTime: string;
    durationMinutes: number;
    topic: string;
    mode: 'Online' | 'Offline';
  }): Promise<{ success: boolean; session: SkillSwapSession }> {
    const res = await fetch(`${BASE_URL}/skillswap/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getChatMessages(requestId: string): Promise<{ messages: ChatMessage[] }> {
    const res = await fetch(`${BASE_URL}/skillswap/messages/${requestId}`);
    return res.json();
  },

  async sendChatMessage(swapRequestId: string, message: string): Promise<{ success: boolean; message: ChatMessage }> {
    const res = await fetch(`${BASE_URL}/skillswap/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swapRequestId, message }),
    });
    return res.json();
  },

  // Careers, Courses, Electives
  async getCareers(): Promise<{ careers: Career[]; weights: AdminScoringWeights }> {
    const res = await fetch(`${BASE_URL}/careers/recommendations`);
    return res.json();
  },

  async getCourses(): Promise<{ courses: Course[] }> {
    const res = await fetch(`${BASE_URL}/courses/recommendations`);
    return res.json();
  },

  async getElectives(): Promise<{ electives: Elective[] }> {
    const res = await fetch(`${BASE_URL}/electives/recommendations`);
    return res.json();
  },

  // Projects
  async getProjects(): Promise<{ projects: Project[] }> {
    const res = await fetch(`${BASE_URL}/projects`);
    return res.json();
  },

  async createProject(data: Partial<Project>): Promise<{ success: boolean; project: Project }> {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getProjectMatches(projectId: string): Promise<{
    matches: Array<{
      student: User;
      compatibility: number;
      matchingSkills: string[];
      suggestedRole: string;
      reason: string;
    }>;
  }> {
    const res = await fetch(`${BASE_URL}/projects/matches?projectId=${projectId}`);
    return res.json();
  },

  // Opportunities
  async getHackathons(): Promise<{ hackathons: Hackathon[] }> {
    const res = await fetch(`${BASE_URL}/hackathons`);
    return res.json();
  },

  async getInternships(): Promise<{ internships: Internship[] }> {
    const res = await fetch(`${BASE_URL}/internships`);
    return res.json();
  },

  // AI Resume Analyzer
  async analyzeResume(resumeText: string, targetRole: string): Promise<{ analysis: ResumeAnalysisResult }> {
    const res = await fetch(`${BASE_URL}/resume/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole }),
    });
    return res.json();
  },

  // Placement Readiness
  async getPlacementReadiness(): Promise<{
    readiness: {
      overallReadiness: number;
      targetRole: string;
      categories: Array<{ name: string; score: number; status: string; description: string }>;
      actionPlan: Array<{ step: number; action: string; timeEstimate: string }>;
    };
  }> {
    const res = await fetch(`${BASE_URL}/placement/readiness`);
    return res.json();
  },

  // AI Mock Interview
  async generateMockQuestions(role: string, company: string): Promise<{
    questions: Array<{ id: string; question: string; category: string; hint: string; expectedKeyPoints: string[] }>;
  }> {
    const res = await fetch(`${BASE_URL}/mock-interview/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, company }),
    });
    return res.json();
  },

  async evaluateInterviewAnswer(question: string, answer: string, role: string): Promise<{ evaluation: MockInterviewResult }> {
    const res = await fetch(`${BASE_URL}/mock-interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, role }),
    });
    return res.json();
  },

  // Java Skills Lab
  async getJavaChallenges(): Promise<{ challenges: CodingChallenge[] }> {
    const res = await fetch(`${BASE_URL}/java-lab/challenges`);
    return res.json();
  },

  async runJavaCode(code: string, challengeId: string): Promise<{
    status: string;
    message: string;
    testResults: Array<{ name: string; status: string; timeMs: number }>;
    xpAwarded: number;
    output: string;
  }> {
    const res = await fetch(`${BASE_URL}/java-lab/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, challengeId }),
    });
    return res.json();
  },

  async aiJavaAssistant(action: string, code: string): Promise<{ result: string }> {
    const res = await fetch(`${BASE_URL}/java-lab/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, code }),
    });
    return res.json();
  },

  // Timetable
  async generateTimetable(data: { availableHours: number; subjects?: string[]; careerGoal?: string }): Promise<{
    timetable: {
      dailySchedule: Array<{ time: string; activity: string; focus: string }>;
      weeklyPlan: Record<string, { focus: string; targetHours: number }>;
    };
  }> {
    const res = await fetch(`${BASE_URL}/timetable/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Profile Optimizers & Cover Letter
  async analyzeGithub(username: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/github/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    return res.json();
  },

  async optimizeLinkedin(data: { currentHeadline: string; targetRole: string }): Promise<any> {
    const res = await fetch(`${BASE_URL}/linkedin/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async generateCoverLetter(data: { company: string; role: string }): Promise<{ coverLetter: string }> {
    const res = await fetch(`${BASE_URL}/cover-letter/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Admin
  async getAdminAnalytics(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/analytics`);
    return res.json();
  },

  async getAdminWeights(): Promise<{ weights: AdminScoringWeights }> {
    const res = await fetch(`${BASE_URL}/admin/weights`);
    return res.json();
  },

  async updateAdminWeights(weights: AdminScoringWeights): Promise<{ success: boolean; weights: AdminScoringWeights }> {
    const res = await fetch(`${BASE_URL}/admin/weights`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weights),
    });
    return res.json();
  },

  // Gamification & Notifications
  async getLeaderboard(): Promise<{ leaderboard: any[] }> {
    const res = await fetch(`${BASE_URL}/gamification/leaderboard`);
    return res.json();
  },

  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    const res = await fetch(`${BASE_URL}/notifications`);
    return res.json();
  },

  async markNotificationsRead(): Promise<{ success: boolean }> {
    const res = await fetch(`${BASE_URL}/notifications/read`, { method: 'PUT' });
    return res.json();
  },

  // Floating Compass AI Chat
  async askCompassAI(message: string): Promise<{ reply: string }> {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return res.json();
  },

  // Trust Center & Moderation
  async getVerificationStatus(): Promise<{ verification: any }> {
    const res = await fetch(`${BASE_URL}/verifications/status`);
    return res.json();
  },

  async verifyCollege(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/verifications/college`, { method: 'POST' });
    return res.json();
  },

  async verifyCgpa(cgpa: number, documentName: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/verifications/cgpa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cgpa, documentName }),
    });
    return res.json();
  },

  async verifySkill(skill: string, status: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/verifications/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill, status }),
    });
    return res.json();
  },

  async submitReport(data: { targetUserId: string; targetUserName: string; reason: string; details: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAdminReports(): Promise<{ reports: any[] }> {
    const res = await fetch(`${BASE_URL}/admin/reports`);
    return res.json();
  },

  async getAdminAuditLogs(): Promise<{ logs: any[] }> {
    const res = await fetch(`${BASE_URL}/admin/audit-logs`);
    return res.json();
  },
};
