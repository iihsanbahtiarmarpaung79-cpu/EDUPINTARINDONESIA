import React, { useState, useEffect } from 'react';
import { UserSession, QuizQuestion } from '../types';
import { generateFestivalQuestions } from '../services/geminiService';
import { useSchool } from '../context/SchoolContext';
import { PartyPopper, Trophy, Loader2, Play, Timer, CheckCircle, XCircle, AlertTriangle, Zap } from 'lucide-react';

interface FestivalProps {
  session: UserSession;
}

const Festival: React.FC<FestivalProps> = ({ session }) => {
  const { addSchoolPoints } = useSchool();
  
  // State
  const [status, setStatus] = useState<'intro' | 'playing' | 'result'>('intro');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<string>('');

  // Month Name
  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  // Difficulty Label
  const getDifficultyLabel = () => {
      const lvl = session.level || 'Umum';
      if (lvl === 'SD') return { label: 'SULIT', color: 'bg-orange-500' };
      if (lvl === 'SMP') return { label: 'SANGAT SULIT', color: 'bg-red-500' };
      if (lvl === 'SMA') return { label: 'EXTREME', color: 'bg-purple-600' };
      return { label: 'NORMAL', color: 'bg-blue-500' };
  }

  const difficulty = getDifficultyLabel();

  // Auth Check
  if (!session.name) {
    return (
       <div className="flex items-center justify-center min-h-[50vh] text-center p-8">
           <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r shadow-md max-w-lg">
               <h3 className="text-xl font-bold text-red-800 flex items-center justify-center gap-2">
                   <AlertTriangle /> Akses Dibatasi
               </h3>
               <p className="text-red-700 mt-2">Festival ini hanya untuk siswa terdaftar. Silakan login di Beranda terlebih dahulu.</p>
               <a href="/" className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4 inline-block font-bold">Kembali ke Beranda</a>
           </div>
       </div>
    );
  }

  const startFestival = async () => {
      setLoading(true);
      try {
          // Generate 50 Soal Campuran Berdasarkan Level
          const lvl = session.level || 'SMA';
          const qs = await generateFestivalQuestions(lvl);
          setQuestions(qs);
          setStatus('playing');
          setScore(0);
          setCurrentQIndex(0);
          setStartTime(Date.now());
      } catch(e) {
          alert('Gagal memuat soal festival. Coba lagi.');
      } finally {
          setLoading(false);
      }
  }

  const handleAnswer = (selectedIndex: number) => {
      const isCorrect = selectedIndex === questions[currentQIndex].correctAnswerIndex;
      if (isCorrect) {
          setScore(prev => prev + 1);
      }

      if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
      } else {
          finishFestival(isCorrect ? score + 1 : score);
      }
  }

  const finishFestival = (finalScore: number) => {
      const endTime = Date.now();
      const timeTakenSec = Math.floor((endTime - startTime) / 1000);
      const mins = Math.floor(timeTakenSec / 60);
      const secs = timeTakenSec % 60;
      setFinalTime(`${mins}m ${secs}d`);
      
      // Calculate Festival Points (Higher Multiplier based on Level)
      // Base: 20 points
      let multiplier = 20;
      if (session.level === 'SMP') multiplier = 25;
      if (session.level === 'SMA') multiplier = 30;

      const festivalPoints = finalScore * multiplier;
      
      if (session.schoolName && festivalPoints > 0) {
          addSchoolPoints(session.schoolName, festivalPoints);
      }

      setStatus('result');
  }

  // --- VIEW: INTRO ---
  if (status === 'intro') {
      return (
          <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-islamic-900 p-4">
              <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative border-4 border-gold-500">
                  {/* Decor */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-gold-500 to-green-500 animate-pulse"></div>
                  
                  <div className="p-10 text-center space-y-6">
                      <div className="flex flex-col items-center gap-2">
                         <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-700 px-4 py-1 rounded-full text-sm font-extrabold uppercase tracking-widest border border-gold-300">
                             <PartyPopper size={16} /> Festival Bulanan
                         </div>
                         <div className={`inline-flex items-center gap-2 ${difficulty.color} text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg animate-bounce`}>
                             <Zap size={14} fill="currentColor" /> LEVEL: {difficulty.label}
                         </div>
                      </div>
                      
                      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-red-600 leading-tight">
                          FESTIVAL CERDAS CERMAT <br/>
                          <span className="text-3xl text-gray-800">{currentMonth}</span>
                      </h1>

                      <p className="text-gray-600 text-lg max-w-xl mx-auto">
                          Tantangan khusus untuk jenjang <strong>{session.level}</strong>. 
                          Jawab <strong>50 Soal</strong> Matematika, Sains, & Logika dalam waktu sesingkat mungkin.
                      </p>

                      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-4">
                          <div className="bg-gray-50 p-4 rounded-xl border">
                              <div className="text-3xl font-bold text-gray-800">50</div>
                              <div className="text-xs text-gray-500 uppercase">Soal</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl border">
                              <div className="text-3xl font-bold text-gray-800">{session.level}</div>
                              <div className="text-xs text-gray-500 uppercase">Jenjang</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-xl border">
                              <div className="text-3xl font-bold text-gray-800">XP++</div>
                              <div className="text-xs text-gray-500 uppercase">Poin</div>
                          </div>
                      </div>

                      <button 
                        onClick={startFestival}
                        disabled={loading}
                        className="w-full max-w-sm mx-auto bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 rounded-xl text-xl shadow-lg transform transition hover:scale-105 flex justify-center items-center gap-2"
                      >
                          {loading ? <Loader2 className="animate-spin" /> : <><Play fill="currentColor" /> MULAI TANTANGAN</>}
                      </button>
                      
                      <p className="text-xs text-gray-400 mt-4">Waktu akan dicatat. Kecepatan & Ketepatan adalah kunci.</p>
                  </div>
              </div>
          </div>
      )
  }

  // --- VIEW: RESULT ---
  if (status === 'result') {
      return (
          <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
              <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 text-center border-t-8 border-gold-500">
                  <div className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-600 animate-bounce">
                      <Trophy size={48} />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Tantangan Selesai!</h2>
                  <p className="text-gray-500">Hebat! Kamu menaklukkan level <strong className="text-red-500">{difficulty.label}</strong>.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
                      <div className="p-6 bg-islamic-50 rounded-2xl border border-islamic-100">
                          <p className="text-sm text-gray-500 uppercase font-bold">Skor Benar</p>
                          <p className="text-4xl font-black text-islamic-600">{score} / 50</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                          <p className="text-sm text-gray-500 uppercase font-bold">Waktu</p>
                          <p className="text-4xl font-black text-blue-600">{finalTime}</p>
                      </div>
                  </div>

                  <div className="bg-gold-50 p-4 rounded-xl border border-gold-200 mb-8">
                      <p className="font-bold text-gold-800">Total Poin Disumbangkan</p>
                      <p className="text-xs text-gold-700">Poin sekolah {session.schoolName} telah diperbarui.</p>
                  </div>

                  <button 
                     onClick={() => setStatus('intro')}
                     className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-bold"
                  >
                      Kembali ke Menu
                  </button>
              </div>
          </div>
      )
  }

  // --- VIEW: PLAYING ---
  const currentQ = questions[currentQIndex];
  const progress = ((currentQIndex) / 50) * 100;

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Bar */}
          <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg font-bold flex items-center gap-2">
                      <Timer size={20} />
                      <span className="hidden md:inline">Mode Cepat</span>
                  </div>
                  <span className="font-mono text-xl font-bold text-gray-700">Soal {currentQIndex + 1}/50</span>
              </div>
              <div className={`text-sm font-black text-white ${difficulty.color} px-4 py-1 rounded-full shadow-md`}>
                  {difficulty.label}
              </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-gold-500 h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">
              <div className="p-8 md:p-12">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                    {currentQ.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQ.options.map((opt, idx) => (
                          <button
                             key={idx}
                             onClick={() => handleAnswer(idx)}
                             className="p-4 text-left border-2 border-gray-100 hover:border-islamic-500 hover:bg-islamic-50 rounded-xl transition-all font-medium text-gray-700 flex items-center gap-3 group"
                          >
                              <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-islamic-200 flex items-center justify-center text-xs font-bold shrink-0">
                                  {String.fromCharCode(65 + idx)}
                              </span>
                              {opt}
                          </button>
                      ))}
                  </div>
              </div>
              
              {/* Footer hint */}
              <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
                  Konsentrasi! Level ini dirancang untuk {session.level}.
              </div>
          </div>
      </div>
  );
};

export default Festival;