import React, { useState } from 'react';
import { ADMIN_CREDENTIALS } from '../constants';
import { Lock, User, Settings, Database, LogOut, Plus, Trash2, Users, BookOpen, School } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { ClassRoom } from '../types';

const Admin: React.FC = () => {
  const { classes, onlineStudents, addClass, removeClass } = useSchool();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'students'>('dashboard');

  // Add Class State
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('SD');
  const [newClassSubject, setNewClassSubject] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Username atau Password salah!');
    }
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
  }

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if(newClassName && newClassSubject) {
      addClass(newClassName, newClassLevel, newClassSubject, username || "Admin");
      setNewClassName('');
      setNewClassSubject('');
      alert('Kelas berhasil ditambahkan!');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-6">
            <div className="bg-islamic-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-islamic-600">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-gray-500 text-sm">Masuk untuk mengelola konten</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                  placeholder="Masukkan username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-islamic-800 hover:bg-islamic-900 text-white font-bold py-2.5 rounded-lg transition-colors"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
           <p className="text-gray-500">Selamat datang, <span className="font-semibold text-islamic-600">{username}</span></p>
        </div>
        <div className="flex gap-2">
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-200">
                <LogOut size={20} />
                Keluar
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div 
             onClick={() => setActiveTab('students')}
             className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all border-l-4 border-l-blue-500"
          >
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-gray-500 text-sm">Siswa Online</p>
                      <h3 className="text-3xl font-bold text-gray-800">{onlineStudents.length}</h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                      <Users size={24} />
                  </div>
              </div>
          </div>
          <div 
             onClick={() => setActiveTab('classes')}
             className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all border-l-4 border-l-islamic-500"
          >
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-gray-500 text-sm">Total Kelas</p>
                      <h3 className="text-3xl font-bold text-gray-800">{classes.length}</h3>
                  </div>
                  <div className="bg-islamic-100 p-3 rounded-full text-islamic-600">
                      <BookOpen size={24} />
                  </div>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b">
         <button 
           className={`px-6 py-2 font-medium transition-all rounded-t-lg ${activeTab === 'classes' ? 'bg-islamic-600 text-white' : 'text-gray-500 hover:text-islamic-600'}`}
           onClick={() => setActiveTab('classes')}
         >
           Kelola Kelas
         </button>
         <button 
           className={`px-6 py-2 font-medium transition-all rounded-t-lg ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-blue-600'}`}
           onClick={() => setActiveTab('students')}
         >
           Siswa Online ({onlineStudents.length})
         </button>
      </div>

      {/* Tab Content: Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-xl text-gray-800">Daftar Kelas Aktif</h3>
                    </div>
                    <div className="p-0">
                        {classes.length === 0 ? (
                           <p className="p-6 text-center text-gray-400">Belum ada kelas yang dibuat.</p>
                        ) : (
                          <table className="w-full">
                            <thead className="bg-gray-50 text-gray-500 text-sm">
                                <tr>
                                    <th className="px-6 py-3 text-left">Nama Kelas</th>
                                    <th className="px-6 py-3 text-left">Jenjang</th>
                                    <th className="px-6 py-3 text-left">Mata Pelajaran</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {classes.map((cls) => (
                                    <tr key={cls.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{cls.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{cls.level}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{cls.subject}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => removeClass(cls.id)}
                                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                          </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Class Form */}
            <div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                        <Plus className="text-islamic-600" />
                        Tambah Kelas Baru
                    </h3>
                    <form onSubmit={handleAddClass} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                                placeholder="Contoh: 10 IPA 1"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang</label>
                            <select 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                                value={newClassLevel}
                                onChange={(e) => setNewClassLevel(e.target.value)}
                            >
                                <option value="SD">SD</option>
                                <option value="SMP">SMP</option>
                                <option value="SMA">SMA</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                                placeholder="Contoh: Fisika"
                                value={newClassSubject}
                                onChange={(e) => setNewClassSubject(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-islamic-600 hover:bg-islamic-700 text-white font-bold py-3 rounded-lg mt-2">
                            Simpan Kelas
                        </button>
                    </form>
                </div>
            </div>
        </div>
      )}

      {/* Tab Content: Online Students */}
      {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-xl text-gray-800">Daftar Siswa Online</h3>
                <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Update
                </span>
             </div>
             <div className="p-0">
                 {onlineStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 bg-gray-50 flex flex-col items-center">
                        <Users size={48} className="mb-2 opacity-20" />
                        <p>Belum ada siswa yang login.</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {onlineStudents.map((student) => (
                            <div key={student.id} className="flex flex-col gap-3 p-5 rounded-xl border border-gray-100 bg-white hover:shadow-lg transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-islamic-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50"></div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="bg-gradient-to-br from-islamic-500 to-islamic-700 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 truncate max-w-[150px]">{student.name}</h4>
                                        <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                            ONLINE
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={14} className="text-gray-400" />
                                        <span>{student.grade} - <strong>{student.className}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <School size={14} className="text-gray-400" />
                                        <span className="truncate">{student.school}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
             </div>
          </div>
      )}

      {/* Default Dashboard View */}
      {activeTab === 'dashboard' && (
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
               <Settings size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Pilih Menu</h3>
            <p className="text-gray-500 mb-6">Silakan pilih menu di atas untuk mengelola Kelas atau melihat Siswa.</p>
            <div className="flex justify-center gap-4">
                <button onClick={() => setActiveTab('classes')} className="bg-islamic-600 text-white px-6 py-2 rounded-lg hover:bg-islamic-700 shadow-md transition-transform hover:-translate-y-0.5">Kelola Kelas</button>
                <button onClick={() => setActiveTab('students')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-transform hover:-translate-y-0.5">Lihat Siswa</button>
            </div>
         </div>
      )}

    </div>
  );
};

export default Admin;