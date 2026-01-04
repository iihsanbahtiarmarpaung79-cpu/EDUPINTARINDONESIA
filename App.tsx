import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Learning from './pages/Learning';
import ClassRoom from './pages/ClassRoom'; 
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Festival from './pages/Festival'; // Added Festival import
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { UserSession } from './types';
import { SchoolProvider } from './context/SchoolContext';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({
    role: 'STUDENT',
    name: '',
    schoolName: '',
    className: '',
    level: '',
    grade: '',
    selectedSubjectCategory: '',
    selectedSubject: ''
  });

  return (
    <SchoolProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home setSession={setSession} session={session} />} />
            <Route path="/about" element={<About />} />
            <Route path="/learning" element={<Learning session={session} setSession={setSession} />} />
            <Route path="/class-room" element={<ClassRoom session={session} />} />
            <Route path="/chat" element={<Chat session={session} />} />
            <Route path="/quiz" element={<Quiz session={session} setSession={setSession} />} />
            <Route path="/festival" element={<Festival session={session} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </SchoolProvider>
  );
};

export default App;