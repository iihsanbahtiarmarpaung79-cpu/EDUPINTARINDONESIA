import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClassRoom, Student, SchoolStats } from '../types';

interface SchoolContextType {
  classes: ClassRoom[];
  onlineStudents: Student[];
  schoolLeaderboard: SchoolStats[];
  addClass: (name: string, level: string, subject: string, teacherName: string) => string; // Returns class code
  joinClass: (code: string, studentName: string) => ClassRoom | null;
  studentLogin: (name: string, grade: string, school: string, className: string) => void;
  addSchoolPoints: (schoolName: string, points: number) => void;
  removeClass: (id: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Data Awal Mockup
const INITIAL_CLASSES: ClassRoom[] = [
  { id: 'c1', code: 'IPA-101', name: '10 IPA 1', level: 'SMA', subject: 'Fisika', teacherName: 'Pak Budi', studentCount: 24 },
  { id: 'c2', code: 'PAI-5A', name: '5A - PAI', level: 'SD', subject: 'Pendidikan Agama Islam', teacherName: 'Bu Siti', studentCount: 30 },
];

const INITIAL_SCHOOLS: SchoolStats[] = [
  { name: 'SMA Negeri 1 Jakarta', totalScore: 1250, studentCount: 15 },
  { name: 'SD IT Nurul Fikri', totalScore: 980, studentCount: 10 },
  { name: 'SMP Al-Azhar', totalScore: 850, studentCount: 8 },
];

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassRoom[]>(INITIAL_CLASSES);
  const [onlineStudents, setOnlineStudents] = useState<Student[]>([]);
  const [schoolLeaderboard, setSchoolLeaderboard] = useState<SchoolStats[]>(INITIAL_SCHOOLS);

  // Generate Kode Acak 6 Digit/Huruf
  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Guru Membuat Kelas
  const addClass = (name: string, level: string, subject: string, teacherName: string) => {
    const newCode = generateClassCode();
    const newClass: ClassRoom = {
      id: Date.now().toString(),
      code: newCode,
      name,
      level,
      subject,
      teacherName,
      studentCount: 0
    };
    setClasses([...classes, newClass]);
    return newCode;
  };

  // Siswa Gabung Kelas
  const joinClass = (code: string, studentName: string) => {
    const targetClass = classes.find(c => c.code === code);
    if (targetClass) {
      // Update student count (simulasi)
      setClasses(prev => prev.map(c => c.id === targetClass.id ? {...c, studentCount: c.studentCount + 1} : c));
      return targetClass;
    }
    return null;
  };

  const removeClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const studentLogin = (name: string, grade: string, school: string, className: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      grade,
      school,
      className,
      status: 'online',
      joinedAt: new Date(),
    };
    setOnlineStudents(prev => [newStudent, ...prev]);
    
    // Register school if not exists
    setSchoolLeaderboard(prev => {
        const exists = prev.find(s => s.name.toLowerCase() === school.toLowerCase());
        if (!exists) {
            return [...prev, { name: school, totalScore: 0, studentCount: 1 }];
        }
        return prev;
    });
  };

  const addSchoolPoints = (schoolName: string, points: number) => {
      setSchoolLeaderboard(prev => {
          return prev.map(s => {
              if (s.name.toLowerCase() === schoolName.toLowerCase()) {
                  return { ...s, totalScore: s.totalScore + points };
              }
              return s;
          }).sort((a, b) => b.totalScore - a.totalScore); // Auto sort by score
      });
  };

  return (
    <SchoolContext.Provider value={{ classes, onlineStudents, schoolLeaderboard, addClass, joinClass, studentLogin, addSchoolPoints, removeClass }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};