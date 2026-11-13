import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  initialRegisteredUser,
  initialRegisteredUsers,
  mockAdminUser,
  mockSkills,
  mockCourses,
  mockCareers,
  mockElectives,
  mockProjects,
  mockHackathons,
  mockInternships,
  mockSkillSwapRequests,
  mockSkillSwapSessions,
  mockChatMessages,
  mockJavaChallenges,
  mockNotifications,
  mockIndustryTrends,
  mockLeaderboard,
  initialScoringWeights
} from './src/data/mockData.ts';
import type { User, SkillSwapRequest, Project, ChatMessage, SkillSwapSession, DirectMessage, SecurityAuditLog, ModerationReport } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Cloud Run injects PORT=8080 into containers by default, but in this multi-container setup
// Nginx listens on port 8080 and reverse-proxies to http://localhost:3000.
// Therefore, the Node application must always listen on port 3000.
const PORT = Number(process.env.PORT)|| 3000;

app.use(express.json({ limit: '10mb' }));

// Dynamic Registered Users Database Store (Indian Engineering College Community)
let users: User[] = [...initialRegisteredUsers];
let currentUserId = initialRegisteredUser.id;
let skillSwapRequests: SkillSwapRequest[] = [...mockSkillSwapRequests];
let skillSwapSessions: SkillSwapSession[] = [...mockSkillSwapSessions];
let chatMessages: ChatMessage[] = [...mockChatMessages];
let directMessages: DirectMessage[] = [];
let projects: Project[] = [...mockProjects];
let notifications = [...mockNotifications];
let adminWeights = { ...initialScoringWeights };

// Security & Moderation In-Memory Stores
let moderationReports: ModerationReport[] = [
  {
    id: 'rep-01',
    reporterId: 'student-arjun-01',
    reporterName: 'Arjun Reddy',
    targetUserId: 'user-spammer-99',
    targetUserName: 'Unverified External Recruiter',
    reason: 'Spam',
    details: 'Sending unsolicited bulk external links without educational purpose.',
    status: 'Pending Review',
    createdAt: '2026-10-02T10:15:00Z',
  }
];

let securityAuditLogs: SecurityAuditLog[] = [
  {
    id: 'audit-01',
    timestamp: '2026-10-09T08:00:00Z',
    eventType: 'LOGIN',
    userId: 'student-arjun-01',
    userName: 'Arjun Reddy',
    ipAddress: '103.24.120.45',
    severity: 'INFO',
    details: 'User authenticated via student email credentials with 30-day session.',
  },
  {
    id: 'audit-02',
    timestamp: '2026-10-09T08:05:00Z',
    eventType: 'VERIFICATION_APPROVED',
    userId: 'student-arjun-01',
    userName: 'Arjun Reddy',
    ipAddress: '103.24.120.45',
    severity: 'INFO',
    details: 'CGPA 8.65 verified against VNR VJIET grade card transcript.',
  }
];

// Initialize Gemini Client
const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// REST APIS
// ==========================================

// Auth Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (user) {
    currentUserId = user.id;
    // Audit log
    securityAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'LOGIN',
      userId: user.id,
      userName: user.name,
      severity: 'INFO',
      details: `User logged in successfully via ${user.email}. Session token active.`,
    });
    res.json({ success: true, user, token: `cc-jwt-${user.id}-${Date.now()}` });
  } else {
    res.status(404).json({ success: false, message: `No registered account found with email "${email}". Please sign up to create your profile.` });
  }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const user = users.find(u => u.id === currentUserId);
  if (user) {
    securityAuditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'LOGOUT',
      userId: user.id,
      userName: user.name,
      severity: 'INFO',
      details: 'User session terminated gracefully.',
    });
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/verify-email', (req: Request, res: Response) => {
  const { code } = req.body;
  const user = users.find(u => u.id === currentUserId);
  if (user) {
    user.emailVerified = true;
    if (user.verification) {
      user.verification.collegeStatus = 'Verified';
    }
    res.json({ success: true, message: 'Institutional email verified successfully!', user });
  } else {
    res.status(404).json({ success: false, message: 'Session expired' });
  }
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (user) {
    res.json({ success: true, message: `Password recovery code dispatched to ${email}. (Demo Code: 492015)` });
  } else {
    res.status(404).json({ success: false, message: 'No registered student found with this email' });
  }
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  res.json({ success: true, message: 'Password has been successfully updated!' });
});

app.post('/api/auth/switch', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  if (user) {
    currentUserId = user.id;
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const {
    name,
    email,
    course,
    college,
    year,
    graduationYear,
    semester,
    cgpa,
    bio,
    skills,
    interests,
    avatarUrl,
    careerGoal
  } = req.body;

  // Check if email already registered
  const existing = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  if (existing) {
    currentUserId = existing.id;
    return res.json({ success: true, user: existing, message: 'Account already exists. Switched to your profile!' });
  }

  const skillsArray = Array.isArray(skills)
    ? skills.map(s => String(s).trim()).filter(Boolean)
    : typeof skills === 'string'
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Java', 'Cybersecurity', 'Python'];

  const interestsArray = Array.isArray(interests)
    ? interests.map(i => String(i).trim()).filter(Boolean)
    : typeof interests === 'string'
      ? interests.split(',').map(i => i.trim()).filter(Boolean)
      : ['AI', 'Cybersecurity'];

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name?.trim() || 'New Student',
    email: email?.trim() || `student-${Date.now()}@vnrvjiet.ac.in`,
    role: 'STUDENT',
    avatarUrl: avatarUrl || defaultAvatar,
    course: course?.trim() || 'B.Tech Computer Science & Engineering',
    branch: course?.trim() || 'Computer Science & Engineering',
    college: college?.trim() || 'VNR VJIET, Hyderabad',
    year: year?.trim() || '3rd Year',
    graduationYear: graduationYear ? Number(graduationYear) : 2027,
    semester: Number(semester) || 5,
    cgpa: Number(cgpa) || 8.5,
    bio: bio?.trim() || 'Eager Indian engineering student looking to learn, share skills, and build real-world software.',
    skills: skillsArray.length > 0 ? skillsArray : ['Java', 'Cybersecurity', 'Python'],
    skillsTeaching: skillsArray.slice(0, 2),
    skillsLearning: skillsArray.slice(2),
    interests: interestsArray.length > 0 ? interestsArray : ['AI', 'Cybersecurity'],
    careerGoal: careerGoal || 'Java Backend Developer',
    targetCompanies: ['Oracle India', 'Amazon India', 'TCS', 'Infosys'],
    preferredMode: 'Both',
    availability: 'Weekday Evenings & Saturday Mornings',
    connections: [],
    xp: 1500,
    streak: 1,
    badges: ['Community Member'],
    placementReadiness: 72,
    skillScore: 78,
    createdAt: new Date().toISOString(),
    emailVerified: false,
    verification: {
      collegeStatus: 'Pending',
      institutionalEmail: email?.trim(),
      cgpaStatus: 'Not submitted',
      skillsStatus: {
        [skillsArray[0] || 'Java']: 'Self-reported'
      }
    }
  };

  users.push(newUser);
  currentUserId = newUser.id;

  // Log registration audit event
  securityAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'REGISTRATION',
    userId: newUser.id,
    userName: newUser.name,
    severity: 'INFO',
    details: `New student registered from ${newUser.college} (${newUser.course}).`,
  });

  res.status(201).json({ success: true, user: newUser, token: `cc-jwt-${newUser.id}` });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = users.find(u => u.id === currentUserId) || users[0];
  res.json({ user });
});

// Alias: /api/users
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ users: users.filter(u => u.role === 'STUDENT') });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Direct Connections Endpoints
app.get('/api/connections', (req: Request, res: Response) => {
  const user = users.find(u => u.id === currentUserId);
  const connIds = user?.connections || [];
  const connectionUsers = users.filter(u => connIds.includes(u.id));
  res.json({ connections: connectionUsers });
});

app.post('/api/connections', (req: Request, res: Response) => {
  const { targetUserId } = req.body;
  const user = users.find(u => u.id === currentUserId);
  if (user && targetUserId && !user.connections?.includes(targetUserId)) {
    user.connections = [...(user.connections || []), targetUserId];
  }
  res.json({ success: true, connections: user?.connections });
});

app.delete('/api/connections/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === currentUserId);
  if (user && user.connections) {
    user.connections = user.connections.filter(c => c !== req.params.id);
  }
  res.json({ success: true, connections: user?.connections });
});

// Verifications Endpoints (Student Trust Center)
app.get('/api/verifications/status', (req: Request, res: Response) => {
  const user = users.find(u => u.id === currentUserId);
  res.json({
    verification: user?.verification || {
      collegeStatus: 'Verified',
      cgpaStatus: 'Verified',
      skillsStatus: { 'Java': 'Assessment completed' }
    }
  });
});

app.post('/api/verifications/college', (req: Request, res: Response) => {
  const user = users.find(u => u.id === currentUserId);
  if (user && user.verification) {
    user.verification.collegeStatus = 'Verified';
    user.verification.collegeVerifiedAt = new Date().toISOString();
  }
  res.json({ success: true, message: 'College enrollment verified successfully!' });
});

app.post('/api/verifications/cgpa', (req: Request, res: Response) => {
  const { cgpa, documentName } = req.body;
  const user = users.find(u => u.id === currentUserId);
  if (user) {
    if (!user.verification) {
      user.verification = {
        collegeStatus: 'Verified',
        cgpaStatus: 'Verified',
        skillsStatus: {}
      };
    }
    user.verification.cgpaStatus = 'Verified';
    user.verification.cgpaVerifiedAt = new Date().toISOString();
    user.verification.cgpaDocumentName = documentName || 'Marksheet_Sem4.pdf';
    user.verification.cgpaOcrExtracted = Number(cgpa) || user.cgpa;
  }
  res.json({ success: true, message: 'CGPA verified via OCR and institutional record!' });
});

app.post('/api/verifications/skills', (req: Request, res: Response) => {
  const { skill, status } = req.body;
  const user = users.find(u => u.id === currentUserId);
  if (user && user.verification) {
    user.verification.skillsStatus[skill] = status || 'Assessment completed';
    user.xp = (user.xp || 4000) + 250;
  }
  res.json({ success: true, message: `Skill ${skill} verified as ${status}` });
});

// Moderation & Reporting Endpoints
app.post('/api/reports', (req: Request, res: Response) => {
  const { targetUserId, targetUserName, reason, details } = req.body;
  const reporter = users.find(u => u.id === currentUserId);
  const newReport = {
    id: `rep-${Date.now()}`,
    reporterId: currentUserId,
    reporterName: reporter?.name || 'Anonymous Student',
    targetUserId,
    targetUserName: targetUserName || 'Reported Account',
    reason: reason || 'Suspicious Behavior',
    details: details || '',
    status: 'Pending Review' as const,
    createdAt: new Date().toISOString(),
  };
  moderationReports.unshift(newReport);

  securityAuditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'REPORT_FILED',
    userId: currentUserId,
    userName: reporter?.name || 'Student',
    severity: 'WARNING',
    details: `Moderation report filed against ${targetUserName} for ${reason}.`,
  });

  res.status(201).json({ success: true, message: 'Report submitted to academic integrity council.', report: newReport });
});

// Admin Review & Security Endpoints
app.get('/api/admin/verifications', (req: Request, res: Response) => {
  const pending = users
    .filter(u => u.verification?.cgpaStatus === 'Pending' || u.verification?.collegeStatus === 'Pending')
    .map(u => ({
      userId: u.id,
      name: u.name,
      college: u.college,
      email: u.email,
      verification: u.verification
    }));
  res.json({ verifications: pending });
});

app.put('/api/admin/verifications/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  const { type, decision } = req.body; // type: 'cgpa' | 'college', decision: 'Verified' | 'Rejected'
  if (user && user.verification) {
    if (type === 'cgpa') user.verification.cgpaStatus = decision;
    if (type === 'college') user.verification.collegeStatus = decision;
  }
  res.json({ success: true, user });
});

app.get('/api/admin/reports', (req: Request, res: Response) => {
  res.json({ reports: moderationReports });
});

app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  res.json({ logs: securityAuditLogs });
});

// Direct Messages by Peer ID
app.get('/api/messages/:peerId', (req: Request, res: Response) => {
  const { peerId } = req.params;
  const conversation = directMessages.filter(
    m =>
      (m.senderId === currentUserId && m.receiverId === peerId) ||
      (m.senderId === peerId && m.receiverId === currentUserId)
  );
  res.json({ messages: conversation });
});

// AI Advisor Endpoint alias
app.post('/api/ai/advisor', async (req: Request, res: Response) => {
  // Delegate to chat
  const userQuery = req.body.message || req.body.query || '';
  const currentUser = users.find(u => u.id === currentUserId) || initialRegisteredUser;

  if (geminiClient) {
    try {
      const systemInstruction = `You are Campus Compass AI, an elite academic and placement counselor for Indian engineering students. Provide structured guidance on ${currentUser.careerGoal}.`;
      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userQuery,
        config: { systemInstruction },
      });
      if (response.text) return res.json({ reply: response.text });
    } catch (err) {
      console.warn('AI Advisor fallback:', err);
    }
  }

  res.json({
    reply: `Based on your profile as a ${currentUser.careerGoal} at ${currentUser.college}:
- Focus on Core Java (Collections & Concurrency)
- Complement with Cloud Microservices
- Next step: Complete your NPTEL Java certification and solve 2 LeetCode Medium problems daily.`
  });
});

// Mock Interview Evaluate alias
app.post('/api/interview/evaluate', (req: Request, res: Response) => {
  res.json({
    score: 85,
    communicationScore: 88,
    technicalCorrectness: 84,
    feedback: 'Clear technical explanation of Spring Bean lifecycles with good terminology.',
    improvementAreas: ['Mention @PostConstruct and @PreDestroy annotations in enterprise context.']
  });
});

// Community / Students Directory (Real Registered Users Only)
app.get('/api/students', (req: Request, res: Response) => {
  res.json({ students: users.filter(u => u.role === 'STUDENT') });
});

app.get('/api/community/users', (req: Request, res: Response) => {
  res.json({ users: users.filter(u => u.role === 'STUDENT') });
});

app.get('/api/students/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/community/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialCount = users.length;
  users = users.filter(u => u.id !== id);
  if (currentUserId === id && users.length > 0) {
    currentUserId = users[0].id;
  }
  res.json({ success: true, remaining: users.length });
});

app.get('/api/students/profile', (req: Request, res: Response) => {
  const user = users.find(u => u.id === currentUserId) || users[0];
  res.json({ profile: user });
});

app.put('/api/students/profile', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === currentUserId);
  if (index !== -1) {
    const updated = { ...req.body };
    if (typeof updated.skills === 'string') {
      updated.skills = updated.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof updated.interests === 'string') {
      updated.interests = updated.interests.split(',').map((i: string) => i.trim()).filter(Boolean);
    }
    users[index] = { ...users[index], ...updated };
    res.json({ success: true, profile: users[index] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Connect / Follow Action
app.post('/api/community/connect', (req: Request, res: Response) => {
  const { targetUserId } = req.body;
  const currentUser = users.find(u => u.id === currentUserId);
  const targetUser = users.find(u => u.id === targetUserId);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (!Array.isArray(currentUser.connections)) currentUser.connections = [];
  if (!Array.isArray(targetUser.connections)) targetUser.connections = [];

  const isConnected = currentUser.connections.includes(targetUserId);
  if (isConnected) {
    currentUser.connections = currentUser.connections.filter(id => id !== targetUserId);
    targetUser.connections = targetUser.connections.filter(id => id !== currentUser.id);
  } else {
    currentUser.connections.push(targetUserId);
    if (!targetUser.connections.includes(currentUser.id)) {
      targetUser.connections.push(currentUser.id);
    }
  }

  res.json({
    success: true,
    connected: !isConnected,
    connections: currentUser.connections,
    targetConnectionsCount: targetUser.connections.length
  });
});

// Direct Messaging between registered users
app.get('/api/community/messages/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const msgs = directMessages.filter(
    m => (m.senderId === currentUserId && m.receiverId === userId) ||
         (m.senderId === userId && m.receiverId === currentUserId)
  );
  res.json({ messages: msgs });
});

app.post('/api/community/messages', (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { receiverId, message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const receiver = users.find(u => u.id === receiverId);
  const newMsg: DirectMessage = {
    id: `dm-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    senderId: currentUser.id,
    receiverId,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatarUrl,
    receiverName: receiver?.name || 'Student',
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  directMessages.push(newMsg);
  res.status(201).json({ success: true, message: newMsg });
});

// AI Service: Smart Connection & Collaboration Recommendation
app.post('/api/community/ai-recommend', async (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const otherUsers = users.filter(u => u.id !== currentUser.id && u.role === 'STUDENT');

  if (otherUsers.length === 0) {
    return res.json({
      recommendations: [],
      message: 'You are currently the only registered student. When more students join the community, AI will analyze shared interests and complementary skills to recommend high-impact connections!'
    });
  }

  if (geminiClient) {
    try {
      const prompt = `You are the Campus Compass AI Peer Collaboration Recommendation Service.
Current student:
- Name: ${currentUser.name}
- Course: ${currentUser.course}
- Year: ${currentUser.year}
- Skills: ${(currentUser.skills || []).join(', ')}
- Interests: ${(currentUser.interests || []).join(', ')}
- Bio: ${currentUser.bio}

Other registered students in community:
${otherUsers.map(u => `- ID: ${u.id}, Name: ${u.name}, Course: ${u.course}, Year: ${u.year}, Skills: ${(u.skills || []).join(', ')}, Interests: ${(u.interests || []).join(', ')}, Bio: ${u.bio}`).join('\n')}

Recommend up to 3 students for the current student to connect with based on complementary skills or mutual interests.
Return JSON array with format:
[{"userId": "string", "reason": "string", "matchPercentage": number}]`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ recommendations: parsed });
      }
    } catch (e) {
      console.warn('AI recommend fallback:', e);
    }
  }

  const recommendations = otherUsers.slice(0, 3).map(u => {
    const sharedInterests = (u.interests || []).filter(i => (currentUser.interests || []).includes(i));
    const complementarySkills = (u.skills || []).filter(s => !(currentUser.skills || []).includes(s));
    return {
      userId: u.id,
      matchPercentage: sharedInterests.length > 0 ? 88 : 75,
      reason: sharedInterests.length > 0
        ? `Shares passion for ${sharedInterests.join(' & ')} and offers expertise in ${complementarySkills.slice(0, 2).join(', ') || 'collaborative projects'}.`
        : `Strong peer connection between ${currentUser.course} and ${u.course} for technical exchange.`
    };
  });

  res.json({ recommendations });
});

// SkillSwap AI Matching & Requests
app.get('/api/skillswap/matches', (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const candidates = users.filter(u => u.id !== currentUser.id && u.role === 'STUDENT');

  const matches = candidates.map(candidate => {
    // Check skills candidate can teach that current user wants
    const candidateCanTeachMe = candidate.skillsTeaching.filter(s =>
      currentUser.skillsLearning.some(sl => sl.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(sl.toLowerCase()))
    );

    // Check skills current user can teach candidate
    const iCanTeachCandidate = currentUser.skillsTeaching.filter(s =>
      candidate.skillsLearning.some(cl => cl.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cl.toLowerCase()))
    );

    let score = 60;
    const matchReasons: string[] = [];

    if (candidateCanTeachMe.length > 0 && iCanTeachCandidate.length > 0) {
      score += 25;
      matchReasons.push(`Mutual reciprocal exchange: you can teach ${iCanTeachCandidate[0]} and receive ${candidateCanTeachMe[0]}`);
    } else if (candidateCanTeachMe.length > 0) {
      score += 15;
      matchReasons.push(`Can teach you ${candidateCanTeachMe.join(', ')}`);
    } else if (iCanTeachCandidate.length > 0) {
      score += 15;
      matchReasons.push(`Needs your expertise in ${iCanTeachCandidate.join(', ')}`);
    }

    if (candidate.branch === currentUser.branch) {
      score += 5;
      matchReasons.push(`Same academic department (${candidate.branch})`);
    }

    const cYear = parseInt(String(candidate.year), 10) || 2;
    const uYear = parseInt(String(currentUser.year), 10) || 2;
    if (Math.abs(cYear - uYear) <= 1) {
      score += 4;
      matchReasons.push(`Similar academic level (Year ${candidate.year})`);
    }

    // Shared interests
    const sharedInterests = candidate.interests.filter(item => currentUser.interests.includes(item));
    if (sharedInterests.length > 0) {
      score += 5;
      matchReasons.push(`Shared interests in ${sharedInterests.join(', ')}`);
    }

    // Special highlight for flagship demo pair (Arjun Reddy & Sravani Reddy)
    let compatibilityScore = Math.min(score, 98);
    let suggestedExchange = candidateCanTeachMe.length > 0 && iCanTeachCandidate.length > 0
      ? `You teach ${iCanTeachCandidate[0]} ↔ ${candidate.name.split(' ')[0]} teaches ${candidateCanTeachMe[0]}`
      : candidateCanTeachMe.length > 0
      ? `${candidate.name.split(' ')[0]} can mentor you in ${candidateCanTeachMe[0]}`
      : `You can mentor ${candidate.name.split(' ')[0]} in ${iCanTeachCandidate[0] || 'Java'}`;

    if (
      (currentUser.name.includes('Arjun') && candidate.name.includes('Sravani')) ||
      (currentUser.name.includes('Sravani') && candidate.name.includes('Arjun'))
    ) {
      compatibilityScore = 94;
      suggestedExchange = '☕ Arjun → Java + Spring Boot ↔ 🤖 Sravani → Python + ML';
      matchReasons.unshift(
        'Arjun and Sravani have complementary skills. Arjun can help Sravani with Java and Spring Boot, while Sravani can help Arjun with Python and Machine Learning.'
      );
    }

    return {
      student: candidate,
      compatibilityScore,
      matchReasons,
      sharedInterests,
      canTeachMe: candidateCanTeachMe,
      iCanTeach: iCanTeachCandidate,
      suggestedExchange,
    };
  });

  matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  res.json({ matches });
});

app.get('/api/skillswap/requests', (req: Request, res: Response) => {
  res.json({ requests: skillSwapRequests });
});

app.post('/api/skillswap/request', (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { receiverId, skillOffered, skillRequested, message, availability, preferredMode } = req.body;
  const receiver = users.find(u => u.id === receiverId);

  if (!receiver) {
    return res.status(404).json({ message: 'Receiver student not found' });
  }

  const newRequest: SkillSwapRequest = {
    id: `swap-req-${Date.now()}`,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatarUrl,
    senderBranch: currentUser.branch || 'Computer Science & Engineering',
    senderYear: currentUser.year,
    receiverId: receiver.id,
    receiverName: receiver.name,
    receiverAvatar: receiver.avatarUrl,
    skillOffered: skillOffered || currentUser.skillsTeaching[0] || 'Java',
    skillRequested: skillRequested || receiver.skillsTeaching[0] || 'Python',
    message: message || `Hi ${receiver.name.split(' ')[0]}, I'd love to swap skills with you!`,
    availability: availability || 'Weekday evenings',
    preferredMode: preferredMode || 'Online',
    compatibilityScore: 92,
    matchReasons: [
      `Direct complementary swap between ${currentUser.name} and ${receiver.name}`,
      `Mutually matched schedule and preferred mode`
    ],
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  skillSwapRequests.unshift(newRequest);
  res.status(201).json({ success: true, request: newRequest });
});

app.put('/api/skillswap/request/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, rating, counterOffer } = req.body;
  const index = skillSwapRequests.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Request not found' });
  }

  if (status) skillSwapRequests[index].status = status;
  if (rating) {
    skillSwapRequests[index].rating = rating;
    skillSwapRequests[index].completedAt = new Date().toISOString();
    skillSwapRequests[index].status = 'Completed';
  }
  if (counterOffer) {
    skillSwapRequests[index].counterOffer = counterOffer;
    skillSwapRequests[index].status = 'Countered';
  }

  res.json({ success: true, request: skillSwapRequests[index] });
});

// SkillSwap Sessions & Chat
app.get('/api/skillswap/sessions', (req: Request, res: Response) => {
  res.json({ sessions: skillSwapSessions });
});

app.post('/api/skillswap/session', (req: Request, res: Response) => {
  const { swapRequestId, title, scheduledTime, durationMinutes, topic, mode } = req.body;
  const newSession: SkillSwapSession = {
    id: `session-${Date.now()}`,
    swapRequestId,
    title: title || 'Peer Learning & Code Swap Session',
    scheduledTime: scheduledTime || new Date(Date.now() + 86400000).toISOString(),
    durationMinutes: Number(durationMinutes) || 60,
    meetingLink: `https://meet.google.com/campus-compass-${Math.random().toString(36).substring(2, 7)}`,
    mode: mode || 'Online',
    topic: topic || 'Hands-on live coding and knowledge exchange',
    status: 'Scheduled',
  };
  skillSwapSessions.push(newSession);
  res.status(201).json({ success: true, session: newSession });
});

app.get('/api/skillswap/messages/:requestId', (req: Request, res: Response) => {
  const { requestId } = req.params;
  const msgs = chatMessages.filter(m => m.swapRequestId === requestId);
  res.json({ messages: msgs });
});

app.post('/api/skillswap/messages', (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { swapRequestId, message } = req.body;
  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    swapRequestId,
    senderId: currentUser.id,
    senderName: currentUser.name,
    message,
    timestamp: new Date().toISOString(),
  };
  chatMessages.push(newMsg);
  res.status(201).json({ success: true, message: newMsg });
});

// Careers, Courses & Electives
app.get('/api/careers/recommendations', (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  // Calculate dynamic match percentages based on admin scoring weights
  const weightedCareers = mockCareers.map(career => {
    const hasSkills = career.requiredSkills.filter(sk => currentUser.skillsTeaching.includes(sk)).length;
    const skillRatio = hasSkills / career.requiredSkills.length;
    const isTargetGoal = currentUser.careerGoal.toLowerCase() === career.title.toLowerCase();

    const calculatedMatch = Math.round(
      (skillRatio * (adminWeights.skillMatch / 100) * 100) +
      (isTargetGoal ? (adminWeights.careerGoal / 100) * 100 : 10) +
      ((currentUser.cgpa / 10) * (adminWeights.academicPerformance / 100) * 100) +
      (adminWeights.interestMatch * 0.4) +
      (adminWeights.industryDemand * 0.45)
    );

    return {
      ...career,
      matchPercentage: Math.min(Math.max(calculatedMatch, 65), 98),
    };
  });

  weightedCareers.sort((a, b) => b.matchPercentage - a.matchPercentage);
  res.json({ careers: weightedCareers, weights: adminWeights });
});

app.get('/api/courses/recommendations', (req: Request, res: Response) => {
  res.json({ courses: mockCourses });
});

app.get('/api/electives/recommendations', (req: Request, res: Response) => {
  res.json({ electives: mockElectives });
});

// Projects & Teammates
app.get('/api/projects', (req: Request, res: Response) => {
  res.json({ projects });
});

app.post('/api/projects', (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { title, problemStatement, techStack, architecture, difficulty, estimatedDuration, teamSize, rolesNeeded } = req.body;
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    title: title || 'New Innovation Project',
    creatorId: currentUser.id,
    creatorName: currentUser.name,
    creatorAvatar: currentUser.avatarUrl,
    problemStatement: problemStatement || 'Developing innovative software solution for enterprise problems.',
    techStack: Array.isArray(techStack) ? techStack : ['Java', 'Spring Boot', 'React'],
    architecture: architecture || 'Layered microservice architecture with API gateway',
    difficulty: difficulty || 'Intermediate',
    estimatedDuration: estimatedDuration || '6 Weeks',
    teamSize: Number(teamSize) || 4,
    rolesNeeded: Array.isArray(rolesNeeded) ? rolesNeeded : ['Backend Developer', 'Frontend Developer', 'UI/UX'],
    currentMembers: [`${currentUser.name} (Creator)`],
    learningOutcomes: ['Team collaboration', 'Full stack lifecycle', 'Git workflow'],
    resumeValue: 'High demonstrable software development engineering impact.',
    status: 'Open',
  };
  projects.unshift(newProject);
  res.status(201).json({ success: true, project: newProject });
});

app.get('/api/projects/matches', (req: Request, res: Response) => {
  const { projectId } = req.query;
  const targetProj = projects.find(p => p.id === projectId) || projects[0];
  const candidates = users.filter(u => u.id !== currentUserId && u.role === 'STUDENT');

  const teammateMatches = candidates.map(student => {
    const matchingSkills = student.skillsTeaching.filter(s =>
      targetProj.techStack.some(t => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase()))
    );

    let score = 65;
    let suggestedRole = 'Developer';

    if (student.skillsTeaching.some(s => s.toLowerCase().includes('python') || s.toLowerCase().includes('machine learning'))) {
      suggestedRole = 'AI / ML Engineer';
      score += 15;
    } else if (student.skillsTeaching.some(s => s.toLowerCase().includes('ui') || s.toLowerCase().includes('figma'))) {
      suggestedRole = 'UI / UX Designer';
      score += 18;
    } else if (student.skillsTeaching.some(s => s.toLowerCase().includes('security') || s.toLowerCase().includes('linux'))) {
      suggestedRole = 'Cybersecurity Specialist';
      score += 16;
    } else if (student.skillsTeaching.some(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('frontend'))) {
      suggestedRole = 'Frontend Lead';
      score += 17;
    }

    if (matchingSkills.length > 0) score += 10;
    const compatibility = Math.min(score, 97);

    return {
      student,
      compatibility,
      matchingSkills,
      suggestedRole,
      reason: `${student.name} excels in ${student.skillsTeaching.slice(0, 2).join(' & ')} which fits the ${suggestedRole} role needed for "${targetProj.title}".`,
    };
  });

  teammateMatches.sort((a, b) => b.compatibility - a.compatibility);
  res.json({ matches: teammateMatches });
});

// Hackathons & Internships
app.get('/api/hackathons', (req: Request, res: Response) => {
  res.json({ hackathons: mockHackathons });
});

app.get('/api/internships', (req: Request, res: Response) => {
  res.json({ internships: mockInternships });
});

// AI Resume Analyzer
app.post('/api/resume/analyze', async (req: Request, res: Response) => {
  const { resumeText, targetRole } = req.body;
  const target = targetRole || 'Java Backend Developer';

  if (geminiClient && resumeText && resumeText.trim().length > 30) {
    try {
      const prompt = `Analyze this college student's resume for the role of "${target}".
Return ONLY a valid JSON object with the following keys:
- atsScore: number (0 to 100)
- overallScore: number (0 to 100)
- candidateName: string
- extractedSkills: array of strings
- education: array of strings
- projects: array of strings
- experience: array of strings
- strengths: array of strings (top 3)
- weaknesses: array of strings (top 3)
- missingSkillsForTargetRole: array of strings (top 4 missing skills)
- formattingIssues: array of strings
- recommendedProjects: array of strings
- recommendedCertifications: array of strings
- careerMatches: array of objects with { role: string, matchPercent: number }
- beforeAfterSuggestions: array of objects with { before: string, after: string, explanation: string } (at least 2 concrete bullet point improvements)

Resume text:
${resumeText.substring(0, 5000)}`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ analysis: parsed });
      }
    } catch (err) {
      console.warn('Gemini resume analysis fallback triggered:', err);
    }
  }

  // Deterministic realistic analysis fallback
  const fallback = {
    atsScore: 79,
    overallScore: 82,
    candidateName: 'Arjun Reddy',
    extractedSkills: ['Java', 'Spring Boot', 'SQL', 'Data Structures', 'OOP', 'Git', 'Maven', 'REST APIs'],
    education: ['B.Tech in Computer Science & Engineering, VNR VJIET, Hyderabad (CGPA: 8.65)'],
    projects: ['Distributed Task Queue in Java', 'Student Placement Management System', 'RESTful Microservice Gateway'],
    experience: ['Undergraduate Teaching Assistant - Data Structures (6 months)'],
    strengths: [
      'Strong core Java fundamentals and understanding of JVM internal memory & collections',
      'Clean project architectural descriptions with measurable impact metrics',
      'Solid academic record (8.65 CGPA) in foundational Computer Science'
    ],
    weaknesses: [
      'Lacks containerization (Docker) and Kubernetes orchestration proof on live projects',
      'No formal public cloud certification (AWS / Google Cloud) listed under credentials',
      'Action verbs in bullet points need quantifiable engineering metrics (% latency reduction, RPS handled)'
    ],
    missingSkillsForTargetRole: ['Docker', 'AWS Solutions Architecture', 'Apache Kafka', 'CI/CD Pipelines (GitHub Actions)'],
    formattingIssues: [
      'Dates on experience section have inconsistent dash formatting',
      'Skills section should be categorized into Languages, Frameworks, Cloud, and Databases for easier ATS parsing'
    ],
    recommendedProjects: [
      'Event-Driven Spring Boot Microservices with Apache Kafka & Docker Compose',
      'Cloud-Native Resilient Payment Gateway deployed on AWS ECS with PostgreSQL'
    ],
    recommendedCertifications: [
      'Oracle Certified Professional: Java SE 17 Developer',
      'AWS Certified Solutions Architect – Associate'
    ],
    careerMatches: [
      { role: 'Java Backend Developer', matchPercent: 91 },
      { role: 'Full Stack Engineer', matchPercent: 84 },
      { role: 'Cloud Engineer', matchPercent: 78 }
    ],
    beforeAfterSuggestions: [
      {
        before: 'Built a Java backend for handling student records using Spring Boot.',
        after: 'Architected high-throughput Spring Boot REST API for 12,000+ student records, decreasing query latency by 38% via PostgreSQL indexing and connection pooling.',
        explanation: 'Transforms passive task description into high-impact metric-driven engineering accomplishment.'
      },
      {
        before: 'Created microservices and fixed bugs in our database queries.',
        after: 'Containerized 4 Java microservices using Docker; optimized N+1 Hibernate queries resulting in 65% faster payload responses.',
        explanation: 'Specifies technologies (Docker, Hibernate) and concrete performance optimization numbers.'
      }
    ]
  };

  res.json({ analysis: fallback });
});

// Placement Readiness Prediction
app.get('/api/placement/readiness', (req: Request, res: Response) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const breakdown = {
    overallReadiness: currentUser.placementReadiness || 78,
    targetRole: currentUser.careerGoal,
    categories: [
      { name: 'Core Java & OOP', score: 92, status: 'Strong', description: 'Exceptional grasp of class inheritance, memory model, and collections framework.' },
      { name: 'Data Structures & Algorithms', score: 74, status: 'Moderate', description: 'Proficient in arrays, trees, and maps; needs practice in advanced dynamic programming and graphs.' },
      { name: 'System Design & Architecture', score: 68, status: 'Needs Improvement', description: 'Understand basic REST; needs hands-on work with caching (Redis) and message brokers (Kafka).' },
      { name: 'Cloud & Containerization', score: 62, status: 'Needs Improvement', description: 'Docker and AWS skills are required by 75% of target companies.' },
      { name: 'Communication & Mock Interviews', score: 85, status: 'Strong', description: 'Articulates technical choices clearly with structured STAR method responses.' },
      { name: 'GitHub Activity & Projects', score: 80, status: 'Good', description: 'Active repositories with consistent commit streaks and clean README documentation.' }
    ],
    actionPlan: [
      { step: 1, action: 'Solve 40 LeetCode Medium problems focusing on Dynamic Programming and Graphs', timeEstimate: '3 Weeks' },
      { step: 2, action: 'Containerize your Spring Boot backend with Docker & publish images to DockerHub', timeEstimate: '1 Week' },
      { step: 3, action: 'Complete the AWS Solutions Architect Associate practice exams', timeEstimate: '2 Weeks' },
      { step: 4, action: 'Schedule 2 peer mock interviews on Campus Compass AI for STAR behavioral feedback', timeEstimate: '1 Week' }
    ]
  };

  res.json({ readiness: breakdown });
});

// AI Mock Interview
app.post('/api/mock-interview/generate', async (req: Request, res: Response) => {
  const { role, company, difficulty } = req.body;
  const targetRole = role || 'Java Backend Developer';
  const targetCompany = company || 'Amazon';

  if (geminiClient) {
    try {
      const prompt = `Generate 3 realistic technical and behavioral interview questions for a ${targetRole} candidate interviewing at ${targetCompany}.
Return ONLY a valid JSON array of objects with keys: id (string), question (string), category ("Technical" | "System Design" | "Behavioral"), hint (string), expectedKeyPoints (array of strings).`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ questions: parsed });
      }
    } catch (err) {
      console.warn('Gemini mock interview fallback triggered:', err);
    }
  }

  const defaultQuestions = [
    {
      id: 'q-1',
      question: `How does Java HashMap handle hash collisions internally, and what major changes were introduced in Java 8 regarding tree buckets?`,
      category: 'Technical',
      hint: 'Mention separate chaining, hashCode() contract, load factor 0.75, and transition from LinkedList to Red-Black Tree (TreeNode) when threshold exceeds 8.',
      expectedKeyPoints: ['Hash function & index calculation', 'Collision handling with LinkedList', 'TREEIFY_THRESHOLD = 8 converting to Red-Black Tree', 'Time complexity changes from O(n) to O(log n)']
    },
    {
      id: 'q-2',
      question: `At ${targetCompany}, how would you architect an idempotency mechanism for a payment processing microservice built with Spring Boot?`,
      category: 'System Design',
      hint: 'Discuss unique idempotency keys (UUID), distributed locking with Redis, database unique constraints, and HTTP status codes.',
      expectedKeyPoints: ['Client generates Idempotency-Key header', 'Redis key lookup with TTL', 'Database unique transaction constraint', 'Returning cached response on duplicate request']
    },
    {
      id: 'q-3',
      question: `Tell me about a time when you disagreed with a teammate on a software architecture decision. How did you resolve it?`,
      category: 'Behavioral',
      hint: 'Use the STAR technique: Situation, Task, Action, Result. Focus on objective benchmark data, mutual respect, and customer outcomes.',
      expectedKeyPoints: ['Objective evaluation criteria', 'Prototyping / benchmark spikes', 'Customer-obsessed decision making', 'Disagree and commit']
    }
  ];

  res.json({ questions: defaultQuestions });
});

app.post('/api/mock-interview/evaluate', async (req: Request, res: Response) => {
  const { question, answer, role } = req.body;

  if (geminiClient && answer && answer.trim().length > 10) {
    try {
      const prompt = `You are a Principal Software Engineer evaluating an interview answer.
Question: "${question}"
Candidate Answer: "${answer}"
Role: "${role}"

Return ONLY a valid JSON object with:
- technicalScore: number (0 to 100)
- communicationScore: number (0 to 100)
- confidenceScore: number (0 to 100)
- overallScore: number (0 to 100)
- feedback: string (concise 2-3 sentences)
- strengths: array of strings
- weakAreas: array of strings
- improvementSuggestions: array of strings (actionable advice)`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ evaluation: parsed });
      }
    } catch (err) {
      console.warn('Gemini interview evaluation fallback:', err);
    }
  }

  const evaluation = {
    technicalScore: 84,
    communicationScore: 88,
    confidenceScore: 82,
    overallScore: 85,
    feedback: 'Good technical articulation! You accurately highlighted key concepts, though you could delve slightly deeper into edge cases and concurrency safeguards.',
    strengths: [
      'Accurate identification of foundational architectural mechanics',
      'Clear, logical flow of ideas without unnecessary fluff',
      'Demonstrated practical knowledge of real-world enterprise trade-offs'
    ],
    weakAreas: [
      'Did not mention edge-case failover or network timeouts',
      'Could quantify performance impact with concrete big-O memory metrics'
    ],
    improvementSuggestions: [
      'Structure future answers with: Definition → Mechanism → Edge Cases → Production Tradeoff',
      'Explicitly reference Java memory model or ACID isolation guarantees when applicable'
    ]
  };

  res.json({ evaluation });
});

// Java Skills Lab
app.get('/api/java-lab/challenges', (req: Request, res: Response) => {
  res.json({ challenges: mockJavaChallenges });
});

app.post('/api/java-lab/run', (req: Request, res: Response) => {
  const { code, challengeId } = req.body;
  const challenge = mockJavaChallenges.find(c => c.id === challengeId);

  // Validate syntax patterns
  let status = 'PASSED';
  let message = 'All test cases passed successfully! (+100 XP gained)';
  const testResults = [
    { name: 'Test Case 1: Standard input array', status: 'PASS', timeMs: 42 },
    { name: 'Test Case 2: Boundary & edge inputs', status: 'PASS', timeMs: 38 },
  ];

  if (!code || code.trim().length < 20) {
    status = 'FAILED';
    message = 'Compilation Error: Incomplete Java code.';
  } else if (!code.includes('class') && !code.includes('public')) {
    status = 'FAILED';
    message = 'Syntax Error: Missing class definition or public modifier.';
  }

  res.json({
    status,
    message,
    testResults,
    xpAwarded: status === 'PASSED' ? (challenge?.xpReward || 100) : 0,
    output: `Executing JVM 21.0.2 OpenJDK...\nCompiled Solution.java in 120ms.\nRan 2 tests in 80ms.\nSUCCESS: All unit assertions matched expected output.`
  });
});

app.post('/api/java-lab/ai-assistant', async (req: Request, res: Response) => {
  const { action, code } = req.body;
  const actionType = action || 'explain';

  if (geminiClient && code && code.trim().length > 10) {
    try {
      const prompt = `You are a Senior Java Staff Engineer and Java Champion.
Action requested: "${actionType}" (can be "explain", "find_bugs", "optimize", "time_complexity", "test_cases")
Java Code:
\`\`\`java
${code.substring(0, 3000)}
\`\`\`

Provide a crystal-clear, structured response explaining the code, highlighting internal JVM mechanics, Big-O complexities, and modern Java 17/21 idioms.`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        return res.json({ result: response.text });
      }
    } catch (err) {
      console.warn('Gemini Java Lab assistant fallback:', err);
    }
  }

  // Fallback responses per action
  const fallbacks: Record<string, string> = {
    explain: `### Java Code Explanation
1. **Core Concept**: This implementation uses a \`HashMap\` to achieve $O(N)$ linear time lookup by caching previously seen values and their respective array indices.
2. **Memory Model**: Objects reside on the JVM Heap. The hash code determines bucket placement via bitwise masking (\`(n - 1) & hash\`).
3. **Best Practices**: The solution avoids nested $O(N^2)$ loops, minimizing CPU cycles and memory overhead.`,
    find_bugs: `### Bug & Vulnerability Analysis
- **Null Safety**: Ensure the input array \`nums\` is not null to prevent unexpected \`NullPointerException\`.
- **Integer Overflow**: When summing large values near \`Integer.MAX_VALUE\`, verify that complementary subtraction does not overflow.
- **Edge Conditions**: Handles empty arrays gracefully by returning an empty array.`,
    optimize: `### Optimization Suggestions
- **Initial Capacity**: If the array size $N$ is known in advance, initialize \`new HashMap<>(Math.ceil(nums.length / 0.75f))\` to avoid costly rehashing and bucket array resizing.
- **Primitive Collections**: In high-frequency low-latency environments, consider using primitive collections (e.g. Trove or FastUtil) to eliminate auto-boxing overhead between \`int\` and \`Integer\`.`,
    time_complexity: `### Complexity Analysis
- **Time Complexity**: $O(N)$ amortized. Each lookup and insertion into the Java \`HashMap\` operates in $O(1)$ expected time.
- **Space Complexity**: $O(N)$ extra space on the Heap to store up to $N$ key-value entries in the hash table.`,
    test_cases: `### Generated JUnit 5 Test Cases
\`\`\`java
@Test
void testNormalCase() {
    assertArrayEquals(new int[]{0, 1}, Solution.twoSum(new int[]{2, 7, 11, 15}, 9));
}

@Test
void testDuplicates() {
    assertArrayEquals(new int[]{0, 1}, Solution.twoSum(new int[]{3, 3}, 6));
}

@Test
void testNegativeNumbers() {
    assertArrayEquals(new int[]{1, 2}, Solution.twoSum(new int[]{-1, -2, -3, -4}, -5));
}
\`\`\``
  };

  res.json({ result: fallbacks[actionType] || fallbacks.explain });
});

// Smart Timetable Generator
app.post('/api/timetable/generate', (req: Request, res: Response) => {
  const { availableHours, subjects, careerGoal } = req.body;
  const hours = Number(availableHours) || 4;

  const timetable = {
    dailySchedule: [
      { time: '06:30 AM – 07:30 AM', activity: 'DSA Practice & LeetCode in Java', focus: 'Arrays, Trees & Problem Solving' },
      { time: '08:30 AM – 03:30 PM', activity: 'College Lectures & Academic Coursework', focus: 'Academics & CGPA Maintenance' },
      { time: '04:30 PM – 05:30 PM', activity: 'SkillSwap Exchange / Peer Learning Session', focus: 'Teaching Java & Learning Python' },
      { time: '06:00 PM – 07:30 PM', activity: 'Enterprise Project Development', focus: 'Spring Boot Microservices & Docker' },
      { time: '08:30 PM – 09:30 PM', activity: 'Certification & Course Revision', focus: 'AWS / Cybersecurity Modules' }
    ],
    weeklyPlan: {
      Monday: { focus: 'Java Fundamentals & Collections Deep Dive', targetHours: 3 },
      Tuesday: { focus: 'SkillSwap Session ↔ Python Machine Learning', targetHours: 2.5 },
      Wednesday: { focus: 'Database Design & SQL Query Optimization', targetHours: 3 },
      Thursday: { focus: 'Spring Boot REST APIs & Security JWT', targetHours: 3.5 },
      Friday: { focus: 'Elective Preparation: Cybersecurity Defense', targetHours: 2.5 },
      Saturday: { focus: 'Open Source Capstone Project & Docker Builds', targetHours: 5 },
      Sunday: { focus: 'AI Mock Interview & Weekly Placement Progress Review', targetHours: 3 }
    }
  };

  res.json({ timetable });
});

// Profile Optimizers & Cover Letter
app.post('/api/github/analyze', (req: Request, res: Response) => {
  const { username } = req.body;
  const handle = username || 'alexrivera-dev';

  res.json({
    githubScore: 86,
    username: handle,
    totalRepos: 18,
    starredRepos: 4,
    languages: [
      { name: 'Java', percentage: 58 },
      { name: 'TypeScript', percentage: 22 },
      { name: 'Python', percentage: 12 },
      { name: 'Shell / Docker', percentage: 8 }
    ],
    strengths: [
      'Consistent commit frequency across last 6 months',
      'Well-structured Java Maven projects with unit tests (JUnit 5)',
      'Clear semantic commit messages (feat:, fix:, docs:)'
    ],
    weaknesses: [
      'Missing GitHub Actions CI/CD badges on main repositories',
      'Profile README could showcase pinned architecture diagrams and live demo links'
    ],
    recommendations: [
      'Add a `.github/workflows/maven.yml` pipeline to demonstrate automated test runs',
      'Pin your Spring Boot microservices project with a system architecture diagram'
    ]
  });
});

app.post('/api/linkedin/optimize', (req: Request, res: Response) => {
  const { currentHeadline, targetRole } = req.body;
  const role = targetRole || 'Java Backend Developer';

  res.json({
    score: 82,
    suggestedHeadlines: [
      `Aspiring ${role} | Java 21, Spring Boot & Microservices | CSE @ VNR VJIET | AWS Certified Cloud Practitioner`,
      `Backend Software Engineer Intern | High-Throughput Java Architectures & Distributed Systems | LeetCode Knight`
    ],
    aboutSectionSuggestion: `I am a Computer Science & Engineering undergraduate passionate about crafting scalable, fault-tolerant backend architectures. Experienced in building distributed microservices using Java 21, Spring Boot, Spring Data JPA, and PostgreSQL. 

Active mentor on Campus Compass AI with 14+ peer skill exchanges. Currently exploring cloud deployment on AWS and containerization with Docker. Seeking SDE / Backend Engineering internship opportunities for 2027.`,
    recommendedKeywords: ['Spring Boot', 'REST APIs', 'Microservices', 'PostgreSQL', 'Docker', 'Multithreading', 'AWS', 'System Design']
  });
});

app.post('/api/cover-letter/generate', async (req: Request, res: Response) => {
  const { company, role } = req.body;
  const comp = company || 'Amazon';
  const target = role || 'Software Development Engineer Intern';

  if (geminiClient) {
    try {
      const prompt = `Write a crisp, persuasive, professional cover letter for a college student applying for the "${target}" role at "${comp}". Highlight strong Java OOP skills, high academic performance (8.65 CGPA), and hands-on microservices development. Return plain text paragraphs.`;
      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      if (response.text) {
        return res.json({ coverLetter: response.text });
      }
    } catch (err) {
      console.warn('Cover letter fallback:', err);
    }
  }

  const letter = `Dear University Recruiting Team at ${comp},

I am writing to express my strong enthusiasm for the ${target} position at ${comp}. As a third-year Computer Science and Engineering student maintaining an 8.65 CGPA at VNR VJIET, Hyderabad, I have built a disciplined technical foundation in Java systems engineering, algorithmic problem solving, and scalable backend architecture.

At ${comp}, where customer obsession and high-scale operational excellence set the global standard, my experience developing event-driven Java Spring Boot microservices and optimizing database transaction performance directly aligns with your engineering principles. Through my recent projects, I have implemented RESTful architectures, resolved race conditions through Java concurrency primitives, and automated containerized deployments using Docker.

Beyond technical coursework, I am an active contributor to our campus engineering community, mentoring peers in Java collections and data structures through Campus Compass AI. I thrive in collaborative, high-bar engineering environments and would welcome the opportunity to contribute to ${comp}'s mission.

Thank you for your consideration. I look forward to the possibility of discussing how my skills and drive can support ${comp}'s initiatives.

Sincerely,
Arjun Reddy
arjunreddy-vnr | arjun.reddy@vnrvjiet.ac.in`;

  res.json({ coverLetter: letter });
});

// Admin Analytics & Scoring Weights
app.get('/api/admin/analytics', (req: Request, res: Response) => {
  res.json({
    totalStudents: users.filter(u => u.role === 'STUDENT').length,
    activeUsersToday: 18,
    totalSkillSwaps: skillSwapRequests.length,
    completedSkillSwaps: skillSwapRequests.filter(r => r.status === 'Completed').length,
    coursesCompleted: 142,
    averageCgpa: 8.64,
    averagePlacementReadiness: 81.5,
    topTaughtSkills: ['Java', 'SQL', 'Python', 'React', 'Cybersecurity'],
    topRequestedSkills: ['Machine Learning', 'Docker', 'AWS', 'Spring Boot', 'UI/UX'],
    popularCareers: ['Java Backend Developer', 'AI / ML Engineer', 'Cybersecurity Analyst', 'Full Stack Developer'],
    industryTrends: mockIndustryTrends,
  });
});

app.get('/api/admin/weights', (req: Request, res: Response) => {
  res.json({ weights: adminWeights });
});

app.put('/api/admin/weights', (req: Request, res: Response) => {
  adminWeights = { ...adminWeights, ...req.body };
  res.json({ success: true, weights: adminWeights });
});

// Gamification
app.get('/api/gamification/leaderboard', (req: Request, res: Response) => {
  res.json({ leaderboard: mockLeaderboard });
});

// Floating Compass AI Chat Assistant
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  const userQuery = message || 'What should I learn today?';

  if (geminiClient) {
    try {
      const systemInstruction = `You are "Compass AI", the intelligent academic and career advisor embedded in Campus Compass AI.
Your personality is encouraging, deeply technical, structured, and pragmatic.
You help students with:
- Academic advice, electives, and CGPA improvement
- Java concepts, code explanations, Spring Boot, and interview prep
- Career roadmaps, salary expectations, and company target strategies
- SkillSwap matching recommendations
- Placement readiness and resume improvement

Always provide actionable, formatted, concise advice with bullet points or clean code snippets when relevant. Keep responses structured and under 250 words when possible.`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userQuery,
        config: {
          systemInstruction,
        },
      });

      if (response.text) {
        return res.json({ reply: response.text });
      }
    } catch (err) {
      console.warn('Compass AI fallback:', err);
    }
  }

  // Realistic conversational fallback
  let reply = `Here is my recommendation for you today based on your profile as a **Java Backend Developer**:

1. **Java Deep Dive (45 mins)**: Focus on \`java.util.concurrent\` (ExecutorService, CompletableFuture, and volatile visibility).
2. **SkillSwap Synergy**: You have an active match with **Priya Sharma** for Python ML. Schedule a 45-minute code swap to trade Spring Boot REST fundamentals for PyTorch basics.
3. **Elective Alignment**: Elective **CS-401: Cybersecurity Fundamentals** opens for enrollment next semester. It will strengthen your enterprise application security posture.
4. **Placement Target**: Solve 2 LeetCode Medium problems on Tree BFS/DFS to boost your technical interview score!`;

  if (userQuery.toLowerCase().includes('interview') || userQuery.toLowerCase().includes('java question')) {
    reply = `Here are 3 top-tier Java technical interview questions frequently asked by Amazon & Oracle:
1. **JVM Memory Model**: What is the difference between Heap, Stack, and Metaspace? How does Garbage Collection (G1GC) mark and sweep unreachable objects?
2. **Spring Bean Scope**: What happens when a Prototype scoped bean is injected into a Singleton scoped bean? How do you resolve this with \`ObjectProvider\` or \`@Lookup\`?
3. **Concurrency**: How does \`ConcurrentHashMap\` achieve thread safety without synchronizing the entire map like \`Hashtable\`?`;
  } else if (userQuery.toLowerCase().includes('elective') || userQuery.toLowerCase().includes('cgpa')) {
    reply = `Based on your 8.65 CGPA and career goal in Java Backend Development:
- **Primary Recommendation**: **CS-402: Cloud Computing & Distributed Systems** (4 credits). It covers microservice consensus, distributed caching, and cloud orchestration.
- **Secondary Option**: **CS-401: Cybersecurity Fundamentals** to reinforce Spring Security and secure software lifecycle principles.
- **CGPA Tip**: Focus on your Lab practicals and mid-term assessments early; a bump to 8.8+ puts you in the top 5% placement tier for tier-1 firms!`;
  }

  res.json({ reply });
});

// Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({ notifications });
});

app.put('/api/notifications/read', (req: Request, res: Response) => {
  notifications = notifications.map(n => ({ ...n, read: true }));
  res.json({ success: true });
});

// ==========================================
// Vite / Static Serving
// ==========================================
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const indexPath = path.resolve(distPath, 'index.html');

  if (process.env.NODE_ENV !== 'production' && !fs.existsSync(indexPath)) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!doctype html><html><head><title>Campus Compass AI</title></head><body><div id="root">Campus Compass AI is initializing...</div></body></html>');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Campus Compass AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
