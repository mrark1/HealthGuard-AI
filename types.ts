
export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  MARATHI = 'mr'
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  language: Language;
  profile?: UserProfile;
  joinedAt: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  activityLog: ActivityLog[];
}

export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  weight: number;
  height: number;
  chronicConditions: string[];
}

export interface Outbreak {
  id: string;
  district: string;
  state: string;
  disease: string;
  severity: 'Low' | 'Medium' | 'High';
  lastUpdated: string;
  precautions: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Reminder {
  id: string;
  userId: string;
  type: 'Vaccination' | 'Medicine' | 'Checkup';
  title: string;
  date: string;
  time: string;
  isCompleted: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'voice';
  imageUrl?: string;
  isMisinformation?: boolean;
}

export interface AnalyticsData {
  totalUsers: number;
  totalQueries: number;
  queriesByLanguage: { name: string; value: number }[];
  commonDiseases: { name: string; count: number }[];
  outbreakAlertsSent: number;
}
