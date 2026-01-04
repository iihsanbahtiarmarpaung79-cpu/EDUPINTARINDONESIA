import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-islamic-800 mb-6 text-center">Tentang EduPintar Indonesia</h1>
        
        <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
          <p>
            <strong>EduPintar Indonesia</strong> adalah platform pembelajaran digital yang dirancang khusus untuk memenuhi kebutuhan siswa di Indonesia, mulai dari jenjang Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), hingga Sekolah Menengah Atas (SMA).
          </p>
          
          <p>
            Kami menggabungkan kurikulum nasional dengan teknologi kecerdasan buatan buatan anak bangsa, yaitu **FMA (Fadel Aqram Marpaung) Intelligence**, untuk memberikan pengalaman belajar yang personal, interaktif, dan mudah diakses di mana saja.
          </p>

          <h3 className="text-xl font-bold text-islamic-700">Visi Kami</h3>
          <p>
            Mencerdaskan kehidupan bangsa dengan menyediakan akses pendidikan berkualitas yang mengintegrasikan ilmu pengetahuan umum dan nilai-nilai agama yang luhur melalui teknologi mandiri.
          </p>

          <h3 className="text-xl font-bold text-islamic-700">Fitur Unggulan FMA</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>FMA Engine:</strong> Materi pelajaran disusun secara algoritmik menyesuaikan topik yang diminta.</li>
            <li><strong>Kuis Cerdas:</strong> Sistem evaluasi otomatis yang dibuat oleh logika pemrograman FMA.</li>
            <li><strong>Chatbot Interaktif:</strong> Teman belajar virtual yang selalu siap menyapa.</li>
          </ul>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="font-medium text-gray-500">
              Dikembangkan oleh FADEL AQRAM MARPAUNG &copy; 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;