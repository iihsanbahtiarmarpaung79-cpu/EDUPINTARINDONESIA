import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EducationLevel, UserSession, UserRole } from '../types';
import { GRADES } from '../constants';
import { School, User, ArrowRight, BookOpenCheck, Crown, Briefcase, GraduationCap, Trophy } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface HomeProps {
  setSession: (session: UserSession) => void;
  session: UserSession;
}

const Home: React.FC<HomeProps> = ({ setSession, session }) => {
  const navigate = useNavigate();
  const { studentLogin, schoolLeaderboard } = useSchool();
  const [activeTab, setActiveTab] = useState<UserRole>('STUDENT'); // STUDENT or TEACHER
  
  const [formData, setFormData] = useState<UserSession>({
    role: 'STUDENT',
    name: '',
    schoolName: '',
    className: '',
    level: '',
    grade: '',
    selectedSubjectCategory: '',
    selectedSubject: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update Role
    const finalSession = { ...formData, role: activeTab };
    
    // Jika Siswa, simpan ke context
    if (activeTab === 'STUDENT') {
        studentLogin(
            formData.name || 'Siswa', 
            formData.grade, 
            formData.schoolName,
            formData.className || '-'
        );
        navigate('/class-room'); // Siswa diarahkan untuk Join Kelas
    } else {
        // Guru
        navigate('/class-room'); // Guru diarahkan untuk Buat Kelas
    }
    
    setSession(finalSession);
  };

  const handleLevelChange = (level: EducationLevel) => {
    if (!level || !GRADES[level]) return; // Validation check
    setFormData({ 
      ...formData, 
      level, 
      grade: GRADES[level][0], 
      selectedSubject: '' 
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 pb-12">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-islamic-600 to-islamic-800 text-white py-16 px-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <School size={300} />
         </div>
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
                <div className="inline-flex items-center gap-2 bg-gold-500 text-islamic-900 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <Crown size={14} />
                    Platform Kompetisi Sekolah #1
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Buktikan Sekolahmu <br/>
                    <span className="text-gold-400">Paling Jago!</span>
                </h1>
                <p className="text-islamic-100 text-lg mb-8 max-w-lg">
                    Bergabung dengan ribuan siswa dan guru. Kerjakan kuis, kumpulkan poin, dan bawa sekolahmu ke puncak klasemen EduPintar.
                </p>
                
                <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20">
                        <h3 className="font-bold text-2xl text-gold-400">{schoolLeaderboard.length}</h3>
                        <p className="text-sm">Sekolah Bergabung</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20">
                        <h3 className="font-bold text-2xl text-gold-400">FMA</h3>
                        <p className="text-sm">AI Engine</p>
                    </div>
                </div>
            </div>

            {/* Login Form Card */}
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button 
                        onClick={() => setActiveTab('STUDENT')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'STUDENT' ? 'bg-white text-islamic-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <GraduationCap size={16} /> Siswa
                    </button>
                    <button 
                        onClick={() => setActiveTab('TEACHER')}
                        className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'TEACHER' ? 'bg-white text-islamic-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Briefcase size={16} /> Guru
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            placeholder={activeTab === 'STUDENT' ? "Nama Siswa" : "Nama Bapak/Ibu Guru"}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-islamic-500 outline-none bg-gray-50 focus:bg-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Asal Sekolah</label>
                        <input
                            type="text"
                            required
                            placeholder="Nama Sekolah"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-islamic-500 outline-none bg-gray-50 focus:bg-white"
                            value={formData.schoolName}
                            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        />
                    </div>

                    {activeTab === 'STUDENT' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Jenjang</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-islamic-500 outline-none bg-gray-50 focus:bg-white"
                                value={formData.level}
                                onChange={(e) => handleLevelChange(e.target.value as EducationLevel)}
                                required
                            >
                                <option value="" disabled>Pilih</option>
                                {Object.keys(EducationLevel).map((key) => (
                                <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Kelas</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-islamic-500 outline-none bg-gray-50 focus:bg-white disabled:bg-gray-100"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                required
                                disabled={!formData.level}
                            >
                                {!formData.level && <option value="">-</option>}
                                {formData.level && GRADES[formData.level as EducationLevel].map((g) => (
                                <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    )}

                    <button
                        type="submit"
                        disabled={!formData.name || !formData.schoolName}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl mt-2 flex justify-center items-center gap-2"
                    >
                        {activeTab === 'STUDENT' ? 'Mulai Belajar' : 'Masuk Dashboard Guru'} <ArrowRight size={20} />
                    </button>
                </form>
            </div>
         </div>
      </div>

      {/* Leaderboard Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
             <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                     <Trophy className="text-gold-500" size={28} />
                     <h2 className="text-xl font-bold">Top Sekolah Paling Jago</h2>
                 </div>
                 <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-300">Update Real-time</span>
             </div>
             
             <div className="p-0">
                 {schoolLeaderboard.length === 0 ? (
                     <div className="p-8 text-center text-gray-400">Belum ada data sekolah.</div>
                 ) : (
                     <table className="w-full text-left">
                         <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                             <tr>
                                 <th className="px-6 py-4">Peringkat</th>
                                 <th className="px-6 py-4">Nama Sekolah</th>
                                 <th className="px-6 py-4 text-center">Siswa Aktif</th>
                                 <th className="px-6 py-4 text-right">Total Poin</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {schoolLeaderboard.slice(0, 5).map((school, index) => (
                                 <tr key={index} className={`hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-yellow-50/50' : ''}`}>
                                     <td className="px-6 py-4">
                                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                             index === 0 ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 
                                             index === 1 ? 'bg-gray-300 text-gray-700' :
                                             index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'
                                         }`}>
                                             {index + 1}
                                         </div>
                                     </td>
                                     <td className="px-6 py-4 font-bold text-gray-800">{school.name}</td>
                                     <td className="px-6 py-4 text-center text-gray-600">{school.studentCount}</td>
                                     <td className="px-6 py-4 text-right font-mono font-bold text-islamic-600">
                                         {school.totalScore.toLocaleString()}
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 )}
             </div>
         </div>
      </div>
      
    </div>
  );
};

export default Home;