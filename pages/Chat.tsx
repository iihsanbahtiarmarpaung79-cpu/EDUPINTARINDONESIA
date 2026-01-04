import React, { useState, useRef, useEffect } from 'react';
import { UserSession } from '../types';
import { chatWithAI } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Loader2, User, Trash2, MessageSquare, AlertCircle } from 'lucide-react';

interface ChatProps {
  session: UserSession;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  if (!session.name) {
    return (
        <div className="flex items-center justify-center min-h-[50vh] text-center p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r shadow-md">
                <h3 className="text-lg font-bold text-yellow-800">Akses Dibatasi</h3>
                <p className="text-yellow-700">Silakan login di Beranda terlebih dahulu.</p>
                <a href="/" className="text-islamic-600 font-bold underline mt-2 inline-block">Kembali ke Beranda</a>
            </div>
        </div>
    );
  }

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    
    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAI(
          userMsg, 
          session.grade, 
          session.selectedSubject || 'Umum'
      );
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch(e) {
       setChatHistory(prev => [...prev, { role: 'model', text: "Maaf, sirkuit FMA sedang sibuk atau error. Silakan coba lagi." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
       
       {/* Header */}
       <div className="bg-white p-4 rounded-t-2xl shadow-sm border border-gray-200 border-b-0 flex items-center justify-between">
           <div className="flex items-center gap-3">
               <div className="bg-islamic-100 p-2 rounded-full text-islamic-600">
                   <Bot size={24} />
               </div>
               <div>
                   <h1 className="font-bold text-gray-800 text-lg">FMA Chatbot</h1>
                   <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       <p className="text-xs text-gray-500">Selalu Online • {session.name}</p>
                   </div>
               </div>
           </div>
           {chatHistory.length > 0 && (
               <button 
                   onClick={() => setChatHistory([])} 
                   className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-50 rounded-full" 
                   title="Hapus Percakapan"
               >
                   <Trash2 size={20} />
               </button>
           )}
       </div>

       {/* Chat Area */}
       <div className="flex-1 bg-gray-50 border border-gray-200 overflow-y-auto p-4 space-y-6 relative">
           
           {/* Background Watermark */}
           <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <MessageSquare size={200} />
           </div>

           {chatHistory.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4 z-10 relative">
                   <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-islamic-600 mb-2">
                       <Bot size={40} />
                   </div>
                   <h2 className="text-xl font-bold text-gray-800">Halo, {session.name}! 👋</h2>
                   <p className="text-gray-500 max-w-md">
                       Saya FMA Intelligence. Kamu bisa bertanya tentang PR, tugas sekolah, atau curhat soal pelajaran.
                   </p>
                   {!session.selectedSubject && (
                        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg text-sm">
                            <AlertCircle size={16} />
                            <span>Tips: Pilih Mapel di menu Pembelajaran agar saya lebih pintar!</span>
                        </div>
                   )}
               </div>
           ) : (
               chatHistory.map((msg, idx) => (
                   <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
                       <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                           {/* Avatar */}
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                               msg.role === 'user' ? 'bg-islamic-600 text-white' : 'bg-white text-islamic-600 border border-islamic-100'
                           }`}>
                               {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                           </div>

                           {/* Bubble */}
                           <div className={`rounded-2xl p-4 text-sm shadow-sm ${
                               msg.role === 'user' 
                               ? 'bg-islamic-600 text-white rounded-tr-none' 
                               : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                           }`}>
                               <ReactMarkdown>{msg.text}</ReactMarkdown>
                           </div>
                       </div>
                   </div>
               ))
           )}
           
           {loading && (
               <div className="flex justify-start relative z-10">
                   <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-islamic-600 border border-islamic-100 flex items-center justify-center shrink-0 shadow-sm">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                             <Loader2 size={16} className="animate-spin text-islamic-600" />
                             <span className="text-xs text-gray-500 font-medium">FMA sedang mengetik...</span>
                        </div>
                   </div>
               </div>
           )}
           <div ref={chatEndRef} />
       </div>

       {/* Input Area */}
       <div className="bg-white p-4 rounded-b-2xl shadow-lg border border-gray-200 border-t-0 z-20">
           <div className="relative flex items-center gap-2">
               <input 
                 type="text" 
                 className="flex-1 pl-6 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-800 focus:ring-2 focus:ring-islamic-500 focus:bg-white focus:border-transparent outline-none transition-all shadow-inner"
                 placeholder="Tulis pertanyaanmu di sini..."
                 value={chatMessage}
                 onChange={(e) => setChatMessage(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleChat()}
               />
               <button 
                 onClick={handleChat}
                 disabled={loading || !chatMessage}
                 className="absolute right-2 top-2 bottom-2 bg-islamic-600 hover:bg-islamic-700 text-white w-10 h-10 rounded-full transition-all disabled:opacity-50 disabled:scale-90 flex items-center justify-center shadow-md"
               >
                 <Send size={18} />
               </button>
           </div>
           <p className="text-center text-[10px] text-gray-400 mt-2">
               FMA Intelligence dapat membuat kesalahan. Periksa info penting.
           </p>
       </div>

    </div>
  );
};

export default Chat;