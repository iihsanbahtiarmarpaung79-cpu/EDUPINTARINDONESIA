import React, { useState, useEffect } from 'react';
import { UserSession, QuizQuestion } from '../types';
import { SUBJECTS_DATA } from '../constants';
import { generateQuiz } from '../services/geminiService';
import { useSchool } from '../context/SchoolContext'; // Import Context
import { GraduationCap, CheckCircle, XCircle, RefreshCw, Loader2, Play, Clock, BookOpen, Trophy } from 'lucide-react';

interface QuizProps {
  session: UserSession;
  setSession: (session: UserSession) => void;
}

const Quiz: React.FC<QuizProps> = ({ session, setSession }) => {
  const { addSchoolPoints } = useSchool(); // Use Context
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); 

  // Subject Selection for Quiz
  const [tempCategory, setTempCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<{id: string, label: string, subjects: string[]}[]>([]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (questions.length > 0 && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && questions.length > 0 && !showResults) {
      calculateScore();
    }
    return () => clearInterval(timer);
  }, [questions, showResults, timeLeft]);

   // Update available categories based on session level
   useEffect(() => {
    if (session.level && SUBJECTS_DATA[session.level]) {
        const data = SUBJECTS_DATA[session.level];
        const cats: { id: string, label: string, subjects: string[] }[] = [];
        
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                cats.push({ id: key, label: key, subjects: data[key] });
            } else {
                 // Handle Nested (e.g. Peminatan)
                 Object.keys(data[key]).forEach(subKey => {
                     cats.push({ id: `${key} - ${subKey}`, label: `${key} - ${subKey}`, subjects: data[key][subKey] });
                 });
            }
        });
        setAvailableCategories(cats);
    }
  }, [session.level]);

  // Auth Check
  if (!session.name) {
     return (
        <div className="flex items-center justify-center min-h-[50vh] text-center p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-md">
                <h3 className="text-lg font-bold text-yellow-800">Akses Ditolak</h3>
                <p className="text-yellow-700">Silakan login di Beranda terlebih dahulu.</p>
                <a href="/" className="text-islamic-600 font-bold underline mt-2 inline-block">Kembali ke Beranda</a>
            </div>
        </div>
     );
  }

  // Subject Selection Logic
  if (!session.selectedSubject) {
      return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Kompetisi & Ujian</h1>
                <p className="text-gray-500">Pilih mata pelajaran, kerjakan soal, dan <span className="text-gold-600 font-bold">tambah poin untuk sekolahmu!</span></p>
                <div className="inline-block mt-2 bg-islamic-50 text-islamic-700 px-3 py-1 rounded-full text-sm font-bold border border-islamic-200">
                    Jenjang: {session.level || 'Umum'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">1. Pilih Kategori</h3>
                    <div className="space-y-2">
                        {availableCategories.length > 0 ? (
                             availableCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setTempCategory(cat.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                                        tempCategory === cat.id 
                                        ? 'bg-islamic-50 border-islamic-500 text-islamic-700 font-bold shadow-sm' 
                                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))
                        ) : (
                             <p className="text-gray-400 italic">Tidak ada data kategori.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                     <h3 className="font-bold text-lg mb-4 text-gray-700">2. Pilih Mapel</h3>
                    {tempCategory ? (
                        <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                            {availableCategories.find(c => c.id === tempCategory)?.subjects.map((sub) => (
                                <button
                                    key={sub}
                                    onClick={() => setSession({ ...session, selectedSubjectCategory: tempCategory, selectedSubject: sub })}
                                    className="text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-islamic-300 hover:bg-islamic-50 hover:text-islamic-700 transition-colors flex justify-between items-center group"
                                >
                                    {sub}
                                    <ArrowRight size={16} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-10">
                            <BookOpen size={40} className="mb-2 opacity-20" />
                            <p>Pilih kategori di sebelah kiri.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )
  }

  const handleCreateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]);
    setShowResults(false);
    setCurrentQIndex(0);
    setAnswers([]);
    setTimeLeft(30 * 60); 
    
    try {
      const qs = await generateQuiz(session.grade, session.selectedSubject, topic, 10);
      setQuestions(qs);
    } catch (e) {
      alert("Gagal membuat kuis. Silakan coba topik lain.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) correct++;
    });
    setScore(correct);
    setShowResults(true);

    // INTEGRASI POIN SEKOLAH
    const points = correct * 10; // 1 soal benar = 10 poin
    if (session.schoolName && points > 0) {
        addSchoolPoints(session.schoolName, points);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setTopic('');
    setShowResults(false);
    setCurrentQIndex(0);
    setAnswers([]);
    setTimeLeft(30 * 60);
  };

  const handleChangeSubject = () => {
      setSession({ ...session, selectedSubject: '', selectedSubjectCategory: '' });
      setQuestions([]);
      setTopic('');
      setShowResults(false);
      setTempCategory('');
  }

  // Start Screen
  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-islamic-500 text-center relative">
          <button onClick={handleChangeSubject} className="absolute top-4 right-4 text-xs text-gray-400 hover:text-islamic-600 underline">Ganti Mapel</button>
          
          <div className="flex justify-center mb-6">
             <div className="bg-islamic-100 p-4 rounded-full text-islamic-600">
                <GraduationCap size={48} />
             </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Kompetisi FMA</h2>
          <p className="text-gray-500 mb-8">
            Uji pemahamanmu tentang <span className="font-semibold text-islamic-600">{session.selectedSubject}</span>. 
            Setiap jawaban benar akan menyumbang <strong>10 Poin</strong> untuk sekolahmu!
          </p>

          <div className="space-y-4 text-left max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700">Topik Spesifik (Opsional)</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Pecahan, Kerajaan Majapahit, Rantai Makanan..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none"
            />
            <button 
              onClick={handleCreateQuiz}
              disabled={loading || !topic}
              className="w-full bg-islamic-600 hover:bg-islamic-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Play size={20} /> Mulai (10 Soal)</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const earnedPoints = score * 10;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-islamic-600 p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Hasil Akhir</h2>
                <div className="text-6xl font-extrabold mb-2">{percentage}</div>
                <div className="inline-flex items-center gap-2 bg-gold-500 text-islamic-900 px-4 py-1 rounded-full font-bold shadow-lg animate-bounce mt-2">
                    <Trophy size={16} />
                    +{earnedPoints} Poin untuk {session.schoolName}
                </div>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className={`border rounded-lg p-4 ${answers[idx] === q.correctAnswerIndex ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex gap-3">
                  <span className="font-bold text-gray-500">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-3">{q.question}</p>
                    <div className="space-y-2">
                       {q.options.map((opt, optIdx) => {
                          const isSelected = answers[idx] === optIdx;
                          const isCorrect = q.correctAnswerIndex === optIdx;
                          let styleClass = "text-gray-600 border-gray-200";
                          
                          if (isCorrect) styleClass = "bg-green-100 border-green-500 text-green-800 font-bold";
                          else if (isSelected && !isCorrect) styleClass = "bg-red-100 border-red-500 text-red-800";

                          return (
                              <div key={optIdx} className={`px-3 py-2 border rounded text-sm flex justify-between items-center ${styleClass}`}>
                                 {opt}
                                 {isCorrect && <CheckCircle size={16} className="text-green-600" />}
                                 {isSelected && !isCorrect && <XCircle size={16} className="text-red-600" />}
                              </div>
                          )
                       })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={resetQuiz}
              className="w-full bg-islamic-600 hover:bg-islamic-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <RefreshCw size={20} />
              Coba Mapel Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Interface
  const currentQ = questions[currentQIndex];
  const isUrgent = timeLeft < 60; 

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col justify-start">
      <div className={`sticky top-20 z-40 mb-6 rounded-xl shadow-md p-4 flex justify-between items-center transition-colors ${isUrgent ? 'bg-red-50 border border-red-200 animate-pulse' : 'bg-white border border-gray-100'}`}>
          <div className="flex items-center gap-3">
             <div className="bg-islamic-100 text-islamic-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                 Soal {currentQIndex + 1}/{questions.length}
             </div>
             <span className="text-sm text-gray-500 hidden sm:inline truncate max-w-[200px]">{topic}</span>
          </div>
          
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
              <Clock size={24} />
              {formatTime(timeLeft)}
          </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="w-full bg-gray-200 h-2">
          <div 
            className="bg-gold-500 h-2 transition-all duration-300" 
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 group ${
                  answers[currentQIndex] === idx 
                    ? 'border-islamic-500 bg-islamic-50 text-islamic-800 shadow-md' 
                    : 'border-gray-200 hover:border-islamic-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors shrink-0 ${
                   answers[currentQIndex] === idx ? 'bg-islamic-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-islamic-200'
                }`}>
                   {String.fromCharCode(65 + idx)}
                </div>
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
             <div className="text-xs text-gray-400 italic">
                {isUrgent ? 'Waktu hampir habis!' : 'Fokus & Teliti'}
             </div>
             <button
               onClick={nextQuestion}
               disabled={answers[currentQIndex] === undefined}
               className="bg-islamic-600 hover:bg-islamic-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
             >
               {currentQIndex === questions.length - 1 ? 'Selesai' : 'Lanjut'}
               <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({size}:{size:number}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
)

export default Quiz;