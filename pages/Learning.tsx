import React, { useState, useEffect, useRef } from 'react';
import { UserSession } from '../types';
import { SUBJECTS_DATA } from '../constants';
import { generateLearningMaterial } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Loader2, ArrowRight, Book, FileText, Volume2, PauseCircle, StopCircle, PlayCircle, Search } from 'lucide-react';

interface LearningProps {
  session: UserSession;
  setSession: (session: UserSession) => void;
}

const Learning: React.FC<LearningProps> = ({ session, setSession }) => {
  const [bookName, setBookName] = useState('');
  const [pageInfo, setPageInfo] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Audio State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Subject Selection State (Category String)
  const [tempCategory, setTempCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<{id: string, label: string, subjects: string[]}[]>([]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

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

  const handleAudioPlay = () => {
    if (!content) return;

    if (isPaused && isSpeaking) {
      synth.resume();
      setIsPaused(false);
    } else {
      // Stop previous if any
      synth.cancel();

      // Clean text for speech (remove markdown symbols mostly)
      const textToRead = content.replace(/[*#_]/g, '');

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID'; // Bahasa Indonesia
      utterance.rate = 1; // Normal speed
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    }
  };

  const handleAudioPause = () => {
    if (synth.speaking && !isPaused) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleAudioStop = () => {
    if (synth.speaking || isPaused) {
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  // Auth Check
  if (!session.name) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center p-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-md">
            <h3 className="text-lg font-bold text-yellow-800">Akses Dibatasi</h3>
            <p className="text-yellow-700">Silakan isi identitas diri di Beranda terlebih dahulu.</p>
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Pilih Mata Pelajaran</h1>
                <p className="text-gray-500">Halo <span className="font-bold text-islamic-600">{session.name}</span>, mau bedah buku apa hari ini?</p>
                <div className="inline-block mt-2 bg-islamic-50 text-islamic-700 px-3 py-1 rounded-full text-sm font-bold border border-islamic-200">
                    Jenjang: {session.level || 'Umum'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
                        <span className="bg-islamic-100 text-islamic-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Pilih Kategori
                    </h3>
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
                            <p className="text-gray-400 italic">Tidak ada data kategori untuk jenjang ini.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                     <h3 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
                        <span className="bg-islamic-100 text-islamic-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Pilih Mapel
                    </h3>
                    {tempCategory ? (
                        <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                            {availableCategories.find(c => c.id === tempCategory)?.subjects.map((sub) => (
                                <button
                                    key={sub}
                                    onClick={() => setSession({ ...session, selectedSubjectCategory: tempCategory, selectedSubject: sub })}
                                    className="text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-islamic-300 hover:bg-islamic-50 hover:text-islamic-700 transition-colors flex justify-between items-center group"
                                >
                                    {sub}
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-islamic-500" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-10">
                            <BookOpen size={40} className="mb-2 opacity-20" />
                            <p>Pilih kategori di sebelah kiri terlebih dahulu.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )
  }

  const handleGenerate = async () => {
    if (!bookName.trim() || !pageInfo.trim()) return;
    setLoading(true);
    setContent(null);
    handleAudioStop(); // Stop any playing audio
    
    try {
      const result = await generateLearningMaterial(session.grade, session.selectedSubject, bookName, pageInfo);
      setContent(result);
    } catch (e) {
      alert("Gagal membuat materi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSubject = () => {
      setSession({ ...session, selectedSubject: '', selectedSubjectCategory: '' });
      setContent(null);
      setBookName('');
      setPageInfo('');
      handleAudioStop();
      setTempCategory('');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4">
             <div className="flex items-center gap-3">
                 <div className="bg-islamic-100 p-2 rounded-lg text-islamic-600">
                    <BookOpen size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{session.selectedSubject}</h2>
                    <p className="text-gray-500 text-sm">{session.level} - {session.grade}</p>
                 </div>
             </div>
             <button onClick={handleChangeSubject} className="text-xs text-islamic-600 hover:underline">Ganti Mapel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Book size={16} className="text-islamic-600" /> Judul Buku / Sumber
                </label>
                <input 
                    type="text" 
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    placeholder="Contoh: Buku Paket IPA Erlangga, LKS Intan Pariwara..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-islamic-600" /> Fokus Halaman/Bab
                </label>
                <input 
                    type="text" 
                    value={pageInfo}
                    onChange={(e) => setPageInfo(e.target.value)}
                    placeholder="Contoh: Hal 45 - 50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-500 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
             <div className="text-xs text-gray-400 italic hidden sm:block">
                 *FMA akan mencari poin penting yang wajib dibaca.
             </div>
             <button 
                onClick={handleGenerate}
                disabled={loading || !bookName || !pageInfo}
                className="bg-islamic-600 hover:bg-islamic-700 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Search size={20} /> Cari Yang Penting Saja</>}
              </button>
          </div>
      </div>

      {/* Content Area */}
      {content ? (
        <div className="relative animate-fade-in">
             {/* Audio Floating Controls */}
             <div className="sticky top-20 z-10 flex justify-end mb-4 pointer-events-none">
                 <div className="bg-white/90 backdrop-blur border border-gray-200 shadow-xl rounded-full p-2 pointer-events-auto flex items-center gap-2">
                    <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wide">FMA Voice</div>
                    {!isSpeaking || isPaused ? (
                        <button 
                            onClick={handleAudioPlay}
                            className="bg-islamic-600 hover:bg-islamic-700 text-white p-2 rounded-full transition-colors"
                            title="Putar Suara"
                        >
                            <PlayCircle size={24} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleAudioPause}
                            className="bg-gold-500 hover:bg-gold-600 text-white p-2 rounded-full transition-colors"
                            title="Jeda"
                        >
                            <PauseCircle size={24} />
                        </button>
                    )}
                    {(isSpeaking || isPaused) && (
                        <button 
                            onClick={handleAudioStop}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                            title="Berhenti"
                        >
                            <StopCircle size={24} />
                        </button>
                    )}
                 </div>
             </div>

             <div className="bg-white p-8 md:p-12 rounded-xl shadow-md border border-gray-100 prose prose-islamic max-w-none">
                <div className="flex items-center gap-2 text-islamic-600 font-bold mb-4 bg-islamic-50 p-3 rounded-lg inline-block">
                     <Volume2 size={20} />
                     <span>AI Audio Reader Tersedia</span>
                </div>
                <ReactMarkdown>{content}</ReactMarkdown>
             </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-400 flex flex-col items-center justify-center min-h-[300px]">
             <BookOpen size={48} className="mb-4 opacity-20" />
             <p className="text-lg font-medium text-gray-600">Belum ada materi yang ditampilkan.</p>
             <p className="text-sm">Masukkan judul buku & halaman agar FMA bisa merangkumkan <br/> <strong>"Apa yang penting untuk dibaca"</strong>.</p>
        </div>
      )}

    </div>
  );
};

export default Learning;