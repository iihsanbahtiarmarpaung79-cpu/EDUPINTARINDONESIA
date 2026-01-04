export enum EducationLevel {
  SD = 'SD',
  SMP = 'SMP',
  SMA = 'SMA',
}

// Enum kept for legacy or general categorization if needed, but not strictly bound to data structure anymore
export enum SubjectCategory {
  AGAMA = 'Pendidikan Agama',
  WAJIB = 'Wajib Nasional',
  MIPA = 'Sains (MIPA)',
  IPS = 'Sosial (IPS)',
  BAHASA = 'Bahasa & Seni',
}

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface UserSession {
  role: UserRole;
  name: string; 
  schoolName: string;
  className?: string; // Untuk siswa
  level: EducationLevel | '';
  grade: string;
  selectedSubjectCategory: string; // Changed from SubjectCategory | '' to string
  selectedSubject: string;
}

export interface ClassRoom {
  id: string;
  code: string; // Kode Unik untuk Join (misal: 123456)
  name: string;
  teacherName: string;
  level: string;
  subject: string;
  studentCount: number;
}

export interface Student {
  id: string;
  name: string;
  grade: string; 
  className: string; 
  school: string;
  status: 'online' | 'offline';
  joinedAt: Date;
}

export interface SchoolStats {
  name: string;
  totalScore: number;
  studentCount: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  correct: number;
  wrong: number;
}