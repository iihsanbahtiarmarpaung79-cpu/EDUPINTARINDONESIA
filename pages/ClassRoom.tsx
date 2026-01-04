import React, { useState } from 'react';
import { UserSession } from '../types';
import { useSchool } from '../context/SchoolContext';
import { Users, Plus, Hash, Copy, CheckCircle, BookOpen, AlertCircle } from 'lucide-react';

interface ClassRoomProps {
  session: UserSession;
}

const ClassRoom: React.FC<ClassRoomProps> = ({ session }) => {
  const { classes, addClass, joinClass } = useSchool();
  
  // State Guru
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newLevel, setNewLevel] = useState('SMA');
  const [createdCode, setCreatedCode] = useState('');

  // State Siswa
  const [joinCode, setJoinCode] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [joinError, setJoinError] = useState('');

  if (!session.name) {
    return <div className="p-8 text-center text-red-500">Silakan login terlebih dahulu.</div>;
  }

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const code = addClass(newClassName, newLevel, newSubject, session.name);
    setCreatedCode(code);
    setNewClassName('');
    setNewSubject('');
  };

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    const result = joinClass(joinCode, session.name);
    if (result) {
        setJoinSuccess(`Berhasil bergabung ke kelas ${result.name} (${result.teacherName})`);
        setJoinError('');
        setJoinCode('');
    } else {
        setJoinError('Kode kelas tidak ditemukan!');
        setJoinSuccess('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ruang Kelas Digital</h1>
        <p className="text-gray-500">
            Halo, <span className="font-bold text-islamic-600">{session.role === 'TEACHER' ? 'Bapak/Ibu ' : ''}{session.name}</span>. 
            {session.role === 'TEACHER' ? ' Kelola kelas Anda di sini.' : ' Gabung kelas untuk mendapatkan tugas.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Action Area */}
          <div className="md:col-span-2 space-y-8">
              
              {/* IF TEACHER: CREATE CLASS */}
              {session.role === 'TEACHER' && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-islamic-500">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Plus className="bg-islamic-100 text-islamic-600 p-1 rounded-full" size={24} />
                          Buat Kelas Baru
                      </h2>
                      
                      {createdCode ? (
                          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center">
                              <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
                              <h3 className="font-bold text-green-800 text-lg">Kelas Berhasil Dibuat!</h3>
                              <p className="text-green-600 mb-4">Bagikan kode unik ini kepada siswa Anda:</p>
                              
                              <div className="bg-white border-2 border-dashed border-green-300 py-3 px-6 rounded-lg inline-flex items-center gap-4 cursor-pointer hover:bg-green-50 transition-colors"
                                   onClick={() => {navigator.clipboard.writeText(createdCode); alert('Kode disalin!')}}
                              >
                                  <span className="text-3xl font-mono font-bold tracking-widest text-gray-800">{createdCode}</span>
                                  <Copy size={20} className="text-gray-400" />
                              </div>
                              <button onClick={() => setCreatedCode('')} className="block w-full mt-4 text-sm text-green-700 underline">Buat kelas lagi</button>
                          </div>
                      ) : (
                          <form onSubmit={handleCreateClass} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-bold text-gray-600 mb-1">Nama Kelas</label>
                                      <input 
                                          type="text" 
                                          placeholder="X IPA 1" 
                                          required
                                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                                          value={newClassName}
                                          onChange={e => setNewClassName(e.target.value)}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-bold text-gray-600 mb-1">Jenjang</label>
                                      <select 
                                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                                          value={newLevel}
                                          onChange={e => setNewLevel(e.target.value)}
                                      >
                                          <option value="SD">SD</option>
                                          <option value="SMP">SMP</option>
                                          <option value="SMA">SMA</option>
                                      </select>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-600 mb-1">Mata Pelajaran</label>
                                  <input 
                                      type="text" 
                                      placeholder="Matematika" 
                                      required
                                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
                                      value={newSubject}
                                      onChange={e => setNewSubject(e.target.value)}
                                  />
                              </div>
                              <button type="submit" className="w-full bg-islamic-600 hover:bg-islamic-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors">
                                  Generate Kode Kelas
                              </button>
                          </form>
                      )}
                  </div>
              )}

              {/* IF STUDENT: JOIN CLASS */}
              {session.role === 'STUDENT' && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-gold-500">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Hash className="bg-gold-100 text-gold-600 p-1 rounded-full" size={24} />
                          Gabung Kelas
                      </h2>
                      
                      {joinSuccess ? (
                          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3">
                              <CheckCircle className="text-green-500 shrink-0" />
                              <div>
                                  <p className="font-bold text-green-800">Berhasil!</p>
                                  <p className="text-sm text-green-700">{joinSuccess}</p>
                              </div>
                              <button onClick={() => setJoinSuccess('')} className="ml-auto text-xs text-green-600 underline">Gabung lagi</button>
                          </div>
                      ) : (
                          <form onSubmit={handleJoinClass} className="space-y-4">
                              <div>
                                  <label className="block text-sm font-bold text-gray-600 mb-1">Masukkan Kode Unik</label>
                                  <input 
                                      type="text" 
                                      placeholder="Contoh: 7X8Y9Z" 
                                      required
                                      maxLength={6}
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:ring-0 outline-none text-center text-2xl font-mono tracking-widest uppercase"
                                      value={joinCode}
                                      onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                  />
                              </div>
                              {joinError && (
                                  <div className="text-red-500 text-sm flex items-center gap-1">
                                      <AlertCircle size={14} /> {joinError}
                                  </div>
                              )}
                              <button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors">
                                  Verifikasi Kode
                              </button>
                          </form>
                      )}
                  </div>
              )}

              {/* List Kelas (Umum) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 flex justify-between">
                      <span>Daftar Kelas Aktif di Sistem</span>
                      <span className="text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded border">Total: {classes.length}</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                      {classes.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">Belum ada kelas.</div>
                      ) : (
                          classes.map(cls => (
                              <div key={cls.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                      <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                          {cls.level}
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-gray-800">{cls.name}</h4>
                                          <p className="text-xs text-gray-500">{cls.subject} • {cls.teacherName}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      {session.role === 'TEACHER' && session.name === cls.teacherName && (
                                          <div className="text-xs font-mono bg-yellow-100 text-yellow-800 px-2 py-1 rounded mb-1">
                                              Kode: {cls.code}
                                          </div>
                                      )}
                                      <div className="flex items-center gap-1 text-xs text-gray-400">
                                          <Users size={12} /> {cls.studentCount} Siswa
                                      </div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>

          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
              <div className="bg-gradient-to-br from-islamic-700 to-islamic-900 text-white p-6 rounded-2xl shadow-lg">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <BookOpen size={20} className="text-gold-400" />
                      Info Platform
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                      Gunakan <strong>Kode Unik</strong> untuk menghubungkan Guru dan Siswa.
                  </p>
                  <ul className="text-xs space-y-2 opacity-80 list-disc pl-4">
                      <li>Guru membuat kelas & mendapat kode.</li>
                      <li>Siswa memasukkan kode untuk absen/gabung.</li>
                      <li>Nilai kuis siswa akan masuk ke Leaderboard Sekolah.</li>
                  </ul>
              </div>
          </div>

      </div>
    </div>
  );
};

export default ClassRoom;