export type Role = 'STUDENT' | 'ADMIN';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'Needs re-verification' | 'Not submitted';
export type SkillVerificationStatus = 'Self-reported' | 'Assessment completed' | 'Project demonstrated' | 'Verified by an authorized reviewer';

export interface VerificationProfile {
  collegeStatus: VerificationStatus;
  collegeVerifiedAt?: string;
  institutionalEmail?: string;
  cgpaStatus: VerificationStatus;
  cgpaVerifiedAt?: string;
  cgpaDocumentName?: string;
  cgpaDocumentSize?: string;
  cgpaOcrExtracted?: number;
  skillsStatus: Record<string, SkillVerificationStatus>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  course?: string;
  branch?: string;
  college: string;
  year: string | number;
  graduationYear?: number;
  semester: number;
  cgpa: number;
  bio: string;
  skills?: string[];
  skillsTeaching: string[];
  skillsLearning: string[];
  interests: string[];
  careerGoal: string;
  targetCompanies: string[];
  preferredMode: 'Online' | 'Offline' | 'Both';
  availability: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  connections?: string[];
  xp: number;
  streak: number;
  badges: string[];
  placementReadiness: number;
  skillScore: number;
  createdAt?: string;
  emailVerified?: boolean;
  verification?: VerificationProfile;
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetUserId: string;
  targetUserName: string;
  reason: 'Fake Account' | 'Impersonation' | 'Spam' | 'Harassment' | 'Fraudulent Skill Claim' | 'Suspicious Messages' | string;
  details: string;
  status: 'Pending Review' | 'Investigating' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'REGISTRATION' | 'PASSWORD_RESET' | 'VERIFICATION_SUBMITTED' | 'VERIFICATION_APPROVED' | 'REPORT_FILED' | 'RATE_LIMIT_TRIGGERED';
  userId: string;
  userName: string;
  ipAddress?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderAvatar?: string;
  receiverName?: string;
  message: string;
  timestamp: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Framework' | 'Database' | 'Cloud' | 'Cybersecurity' | 'AI/ML' | 'Design' | 'Core CS';
  icon?: string;
  demandLevel: 'High' | 'Very High' | 'Trending';
  avgSalaryGrowth?: string;
}

export type SkillSwapStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Countered' | 'Active' | 'Completed';

export interface SkillSwapRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderBranch: string;
  senderYear: string | number;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  skillOffered: string;
  skillRequested: string;
  counterOffer?: {
    skillOffered: string;
    skillRequested: string;
    note: string;
  };
  message: string;
  availability: string;
  preferredMode: 'Online' | 'Offline' | 'Both';
  compatibilityScore: number;
  matchReasons: string[];
  status: SkillSwapStatus;
  createdAt: string;
  completedAt?: string;
  rating?: {
    score: number;
    feedback: string;
  };
}

export interface SkillSwapSession {
  id: string;
  swapRequestId: string;
  title: string;
  scheduledTime: string;
  durationMinutes: number;
  meetingLink: string;
  mode: 'Online' | 'Offline';
  topic: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface ChatMessage {
  id: string;
  swapRequestId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Career {
  id: string;
  title: string;
  matchPercentage: number;
  matchReason: string;
  requiredSkills: string[];
  missingSkills: string[];
  studentSkills: string[];
  expectedSalary: string;
  hiringCompanies: string[];
  interviewTopics: string[];
  roadmapOverview: string[];
}

export interface Course {
  id: string;
  title: string;
  provider: 'Coursera' | 'Udemy' | 'NPTEL' | 'Oracle' | 'AWS' | 'Google' | 'Cisco' | 'freeCodeCamp' | 'LinkedIn' | 'Infosys Springboard' | 'SWAYAM' | 'TCS iON' | 'IBM SkillsBuild' | 'Oracle University' | string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skillsGained: string[];
  careerRelevance: string;
  rating: number;
  reviewCount: number;
  isFree: boolean;
  price?: string;
  hasCertificate: boolean;
  aiRecommendationReason: string;
  prerequisites: string[];
  category: 'Java' | 'Cybersecurity' | 'AI/ML' | 'Cloud' | 'Web Development' | 'Data Science' | 'DevOps' | 'Core CS' | string;
  link: string;
}

export interface Elective {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  department: string;
  matchScore: number;
  prerequisites: string[];
  whyRecommended: string;
  syllabusHighlights: string[];
  alignedCareers: string[];
}

export interface Project {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  problemStatement: string;
  techStack: string[];
  architecture: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  teamSize: number;
  rolesNeeded: string[];
  currentMembers: string[];
  learningOutcomes: string[];
  resumeValue: string;
  status: 'Open' | 'In Progress' | 'Completed';
}

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  date: string;
  mode: 'Online' | 'Offline' | 'Hybrid' | string;
  theme: string;
  eligibility: string;
  technologies: string[];
  deadline: string;
  teamSize: string;
  prizePool: string;
  matchPercentage: number;
  link: string;
}

export interface Internship {
  id: string;
  company: string;
  logoText: string;
  role: string;
  requiredSkills: string[];
  eligibility: string;
  location: string;
  isRemote: boolean;
  stipend: string;
  deadline: string;
  matchPercentage: number;
  applyUrl: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  topic: 'Basics' | 'OOP' | 'Collections' | 'Multithreading' | 'Streams' | 'Exception Handling' | 'Spring Boot' | 'Concurrency' | string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Intermediate' | string;
  description: string;
  starterCode: string;
  solutionCode?: string;
  testCases?: { input: string; expected: string }[];
  expectedOutput?: string;
  hints?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  category?: string;
  xpReward?: number;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  overallScore: number;
  candidateName: string;
  extractedSkills: string[];
  education: string[];
  projects: string[];
  experience: string[];
  strengths: string[];
  weaknesses: string[];
  missingSkillsForTargetRole: string[];
  formattingIssues: string[];
  recommendedProjects: string[];
  recommendedCertifications: string[];
  careerMatches: { role: string; matchPercent: number }[];
  beforeAfterSuggestions: { before: string; after: string; explanation: string }[];
}

export interface MockInterviewResult {
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  overallScore: number;
  feedback: string;
  strengths: string[];
  weakAreas: string[];
  improvementSuggestions: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'skillswap' | 'exam' | 'deadline' | 'hackathon' | 'recommendation' | 'badge' | 'match' | 'internship' | 'course' | string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AdminScoringWeights {
  skillMatch: number;
  interestMatch: number;
  careerGoal: number;
  academicPerformance: number;
  industryDemand: number;
  experience: number;
}
