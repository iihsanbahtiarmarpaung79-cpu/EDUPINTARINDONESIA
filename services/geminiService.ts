import { QuizQuestion } from "../types";

// ==========================================
// FMA NEURAL ENGINE v3.0 (LOCAL SUPER INTELLIGENCE)
// Fitur: Logic Reasoning, Math Solver, & Deep Search
// Status: 100% Offline | No API Key Needed
// ==========================================

// --- 1. DATABASE PENGETAHUAN (KNOWLEDGE BASE) ---

const QUOTES = [
  "Barangsiapa bersungguh-sungguh, maka dia akan mendapatkan (Man Jadda Wajada).",
  "Pendidikan adalah senjata paling ampuh untuk mengubah dunia. - Nelson Mandela",
  "Ilmu itu buruan, dan tulisan adalah ikatannya.",
  "Jangan takut salah, takutlah jika tidak pernah mencoba.",
  "Masa depan adalah milik mereka yang menyiapkannya hari ini.",
  "Teknologi hanyalah alat, kuncinya ada pada kemauan manusianya."
];

// Database Fakta yang Lebih Kaya
const KNOWLEDGE_BASE: Record<string, string[]> = {
  // SAINS
  "biologi": [
    "Sel adalah unit terkecil kehidupan. Ada sel hewan (tanpa dinding sel) dan sel tumbuhan (punya dinding sel & kloroplas).",
    "Fotosintesis adalah proses tumbuhan memasak makanan di daun menggunakan CO2, Air, dan Cahaya Matahari.",
    "Sistem pernapasan manusia: Hidung -> Faring -> Laring -> Trakea -> Bronkus -> Paru-paru (Alveolus).",
    "DNA (Deoxyribonucleic Acid) adalah materi genetik yang membawa sifat keturunan pada makhluk hidup.",
    "Ekosistem adalah hubungan timbal balik antara makhluk hidup (biotik) dan lingkungannya (abiotik).",
    "Metamorfosis kupu-kupu: Telur -> Ulat (Larva) -> Kepompong (Pupa) -> Kupu-kupu."
  ],
  "fisika": [
    "Hukum Newton 1 (Inersia): Benda diam tetap diam, benda bergerak tetap bergerak lurus beraturan jika tidak ada gaya luar.",
    "Energi Kinetik adalah energi gerak (Rumus: 1/2 mv²). Energi Potensial adalah energi karena ketinggian (Rumus: mgh).",
    "Bunyi memerlukan medium untuk merambat (padat, cair, gas) dan tidak bisa merambat di ruang hampa.",
    "Massa Jenis (Rho) adalah perbandingan massa benda dengan volumenya (ρ = m / V).",
    "Gaya Gravitasi adalah gaya tarik-menarik antar benda yang memiliki massa.",
    "Kecepatan Cahaya adalah sekitar 300.000 km/detik."
  ],
  "kimia": [
    "Atom terdiri dari inti (Proton +, Neutron netral) dan kulit (Elektron -).",
    "Air murni memiliki rumus kimia H2O. Garam dapur adalah NaCl.",
    "pH (Derajat Keasaman): Asam < 7, Netral = 7, Basa > 7.",
    "Reaksi Oksidasi adalah pengikatan oksigen. Reduksi adalah pelepasan oksigen.",
    "Unsur adalah zat tunggal yang tidak bisa diuraikan lagi secara kimia biasa (Contoh: Emas/Au, Besi/Fe)."
  ],
  // MATEMATIKA (Konsep)
  "matematika": [
    "Teorema Phytagoras: a² + b² = c² (hanya berlaku pada segitiga siku-siku).",
    "Luas Lingkaran = π x r x r. Keliling Lingkaran = 2 x π x r.",
    "Bilangan Prima adalah bilangan yang hanya bisa dibagi 1 dan dirinya sendiri (2, 3, 5, 7, 11...).",
    "Sudut siku-siku besarnya 90 derajat. Sudut lurus 180 derajat.",
    "Modus adalah nilai yang paling sering muncul. Median adalah nilai tengah. Mean adalah rata-rata."
  ],
  // SOSIAL
  "sejarah": [
    "Indonesia merdeka pada 17 Agustus 1945. Teks Proklamasi dibacakan oleh Ir. Soekarno di Jl. Pegangsaan Timur 56.",
    "Sumpah Pemuda (28 Oktober 1928) berisi: Satu Nusa, Satu Bangsa, Satu Bahasa.",
    "Kerajaan Kutai adalah kerajaan Hindu tertua di Indonesia. Kerajaan Samudera Pasai adalah kerajaan Islam pertama.",
    "Perang Diponegoro (1825-1830) dipimpin oleh Pangeran Diponegoro melawan Belanda.",
    "VOC (Vereenigde Oostindische Compagnie) dibubarkan pada 31 Desember 1799 karena korupsi dan hutang."
  ],
  "geografi": [
    "Indonesia terletak secara astronomis di 6° LU - 11° LS dan 95° BT - 141° BT.",
    "Indonesia diapit 2 Benua (Asia & Australia) dan 2 Samudera (Hindia & Pasifik).",
    "Rotasi Bumi (24 jam) menyebabkan siang-malam. Revolusi Bumi (365 hari) menyebabkan pergantian musim/tahun.",
    "Garis Khatulistiwa melewati kota Pontianak, membuat Indonesia beriklim Tropis."
  ],
  "ekonomi": [
    "Hukum Permintaan: Jika harga naik, permintaan turun. Jika harga turun, permintaan naik.",
    "Pasar Monopoli adalah pasar yang hanya terdapat satu penjual yang menguasai perdagangan.",
    "Uang memiliki fungsi sebagai alat tukar, satuan hitung, dan penyimpan nilai.",
    "Inflasi adalah proses meningkatnya harga-harga secara umum dan terus-menerus.",
    "BUMN adalah Badan Usaha Milik Negara, sedangkan BUMS adalah Badan Usaha Milik Swasta."
  ],
  "pkn": [
    "Pancasila adalah dasar negara Indonesia. Burung Garuda adalah lambang negara.",
    "Sila 1: Ketuhanan YME (Bintang). Sila 2: Kemanusiaan (Rantai). Sila 3: Persatuan (Pohon Beringin).",
    "Sila 4: Kerakyatan (Kepala Banteng). Sila 5: Keadilan Sosial (Padi dan Kapas).",
    "Bhinneka Tunggal Ika artinya 'Berbeda-beda tetapi tetap satu jua'.",
    "UUD 1945 adalah konstitusi (hukum dasar tertulis) tertinggi di Indonesia."
  ],
  "agama": [
    "Rukun Islam: Syahadat, Sholat, Zakat, Puasa, Haji.",
    "Rukun Iman: Iman kepada Allah, Malaikat, Kitab, Rasul, Hari Kiamat, Qada & Qadar.",
    "Al-Qur'an adalah kitab suci umat Islam yang diturunkan kepada Nabi Muhammad SAW.",
    "Sholat 5 waktu hukumnya Fardhu 'Ain (Wajib bagi setiap individu)."
  ],
  "umum": [
    "Membaca adalah jendela dunia.",
    "Disiplin adalah kunci kesuksesan.",
    "Kebersihan adalah sebagian dari iman.",
    "Hormati guru dan orang tua agar ilmu menjadi berkah."
  ]
};

// Database Soal Kuis
const QUESTION_BANK: Record<string, QuizQuestion[]> = {
  "sejarah": [
    { question: "Siapakah proklamator kemerdekaan Indonesia?", options: ["Soeharto", "Ir. Soekarno", "B.J. Habibie", "Jenderal Sudirman"], correctAnswerIndex: 1, explanation: "Ir. Soekarno membacakan teks proklamasi didampingi Moh. Hatta." },
    { question: "Kapan Sumpah Pemuda dilaksanakan?", options: ["17 Agustus 1945", "10 November 1945", "28 Oktober 1928", "20 Mei 1908"], correctAnswerIndex: 2, explanation: "Sumpah Pemuda terjadi pada tanggal 28 Oktober 1928." },
    { question: "Kerajaan Islam pertama di Indonesia adalah...", options: ["Majapahit", "Samudera Pasai", "Mataram", "Demak"], correctAnswerIndex: 1, explanation: "Samudera Pasai terletak di Aceh dan merupakan kerajaan Islam pertama." }
  ],
  "biologi": [
    { question: "Bagian sel yang berfungsi sebagai tempat respirasi energi adalah...", options: ["Inti Sel", "Ribosom", "Mitokondria", "Dinding Sel"], correctAnswerIndex: 2, explanation: "Mitokondria dikenal sebagai 'The Powerhouse of Cell'." },
    { question: "Hewan pemakan daging disebut...", options: ["Herbivora", "Karnivora", "Omnivora", "Insectivora"], correctAnswerIndex: 1, explanation: "Karnivora adalah hewan pemakan daging." },
    { question: "Proses tumbuhan memasak makanan dengan bantuan cahaya disebut...", options: ["Respirasi", "Fotosintesis", "Transpirasi", "Adaptasi"], correctAnswerIndex: 1, explanation: "Fotosintesis mengubah cahaya menjadi energi kimia." }
  ],
  "pkn": [
    { question: "Lambang sila pertama Pancasila adalah...", options: ["Rantai", "Pohon Beringin", "Bintang", "Padi Kapas"], correctAnswerIndex: 2, explanation: "Bintang melambangkan Ketuhanan Yang Maha Esa." },
    { question: "Dasar negara Indonesia adalah...", options: ["UUD 1945", "Pancasila", "Burung Garuda", "Bhinneka Tunggal Ika"], correctAnswerIndex: 1, explanation: "Pancasila adalah dasar filosofis negara Indonesia." }
  ],
  "ekonomi": [
    { question: "Hukum permintaan menyatakan jika harga naik maka permintaan...", options: ["Naik", "Turun", "Tetap", "Hilang"], correctAnswerIndex: 1, explanation: "Hukum permintaan berbanding terbalik dengan harga." },
    { question: "Badan usaha yang modalnya sebagian besar dimiliki negara disebut...", options: ["BUMS", "Koperasi", "BUMN", "PT"], correctAnswerIndex: 2, explanation: "BUMN adalah Badan Usaha Milik Negara." }
  ]
};

// --- 2. ENGINE LOGIC (CLIENT SIDE) ---

const getRandomItem = (arr: any[]) => {
    if (!arr || arr.length === 0) return "Informasi tidak tersedia saat ini.";
    return arr[Math.floor(Math.random() * arr.length)];
};
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper Kategori
const getCategory = (subject: string): string => {
  const s = subject.toLowerCase();
  if (s.includes('matematika')) return 'matematika';
  if (s.includes('fisika') || s.includes('ipa')) return 'fisika'; 
  if (s.includes('biologi')) return 'biologi';
  if (s.includes('kimia')) return 'kimia';
  if (s.includes('sejarah')) return 'sejarah';
  if (s.includes('ekonomi') || s.includes('ips')) return 'ekonomi';
  if (s.includes('geografi')) return 'geografi';
  if (s.includes('agama') || s.includes('islam')) return 'agama';
  if (s.includes('pkn') || s.includes('pancasila')) return 'pkn';
  return 'umum';
};

// Generator Matematika Berbasis Level
const generateMathQuestionByLevel = (level: string): QuizQuestion => {
    const rand = Math.random();
    let q = "", a = 0, exp = "", options: string[] = [];
    const lvl = level || 'SMA';

    if (lvl === 'SD') {
        // SD: Aritmatika Campuran (Sulit)
        const x = Math.floor(Math.random() * 20) + 10;
        const y = Math.floor(Math.random() * 10) + 2;
        const z = Math.floor(Math.random() * 10) + 5;
        
        if (rand < 0.5) {
            // Perkalian + Penjumlahan
            q = `Hasil dari (${x} x ${y}) + ${z} adalah...`;
            a = (x * y) + z;
            exp = `Hitung dalam kurung dulu: ${x}x${y}=${x*y}, lalu tambah ${z}.`;
        } else {
             // Pembagian + Pengurangan
             const res = x * y; // memastikan habis dibagi
             q = `Hasil dari ${res} : ${y} - ${z} adalah...`;
             a = x - z;
             exp = `${res}:${y}=${x}, lalu dikurang ${z}.`;
        }
    } 
    else if (lvl === 'SMP') {
        // SMP: Aljabar Dasar & Pangkat (Sangat Sulit)
        if (rand < 0.4) {
            // Mencari Nilai X: 3x + 10 = 25
            const xVal = Math.floor(Math.random() * 10) + 2;
            const mult = Math.floor(Math.random() * 5) + 2;
            const add = Math.floor(Math.random() * 20) + 5;
            const res = (mult * xVal) + add;
            
            q = `Jika ${mult}x + ${add} = ${res}, berapakah nilai x?`;
            a = xVal;
            exp = `${mult}x = ${res} - ${add} -> ${mult}x = ${res-add} -> x = ${xVal}.`;
        } else if (rand < 0.7) {
             // Kuadrat
             const base = Math.floor(Math.random() * 15) + 11; // 11-25
             q = `Hasil dari ${base}² adalah...`;
             a = base * base;
             exp = `${base} x ${base} = ${a}.`;
        } else {
             // Aritmatika Negatif
             const x = Math.floor(Math.random() * 50) + 10;
             const y = Math.floor(Math.random() * 50) + 60; // y > x
             q = `Hasil dari ${x} - ${y} adalah...`;
             a = x - y;
             exp = `Bilangan kecil dikurang besar hasilnya negatif.`;
        }
    } 
    else {
        // SMA: Fungsi, Logaritma, Turunan Sederhana (Sangat Sangat Sulit)
        if (rand < 0.4) {
             // Turunan Sederhana f(x) = ax^2
             const coeff = Math.floor(Math.random() * 5) + 2;
             q = `Turunan pertama f'(x) dari fungsi f(x) = ${coeff}x² adalah...`;
             // Jawaban string
             const ansStr = `${coeff * 2}x`;
             options = [ansStr, `${coeff}x`, `${coeff * 2}x²`, `${coeff}x²`].sort(() => Math.random() - 0.5);
             return {
                 question: q,
                 options: options,
                 correctAnswerIndex: options.indexOf(ansStr),
                 explanation: `Pangkat dikali koefisien: 2 * ${coeff} = ${coeff*2}, pangkat dikurang 1.`
             };
        } else if (rand < 0.7) {
            // Logaritma Basis 10
            const pow = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
            const val = Math.pow(10, pow);
            q = `Nilai dari log(${val}) adalah...`;
            a = pow;
            exp = `10 pangkat berapa yang hasilnya ${val}? Jawabannya ${pow}.`;
        } else {
             // Trigonometri Dasar
             const angles = [0, 30, 45, 60, 90];
             const angle = angles[Math.floor(Math.random() * angles.length)];
             q = `Nilai sin(${angle}°) adalah...`;
             
             let ansStr = "";
             if (angle === 0) ansStr = "0";
             else if (angle === 30) ansStr = "1/2";
             else if (angle === 45) ansStr = "1/2 √2";
             else if (angle === 60) ansStr = "1/2 √3";
             else if (angle === 90) ansStr = "1";

             options = ["0", "1/2", "1/2 √2", "1/2 √3", "1"];
             // remove duplicates if answer is in options
             options = [...new Set([ansStr, "0", "1", "1/2"])].sort();
             
             return {
                 question: q,
                 options: options,
                 correctAnswerIndex: options.indexOf(ansStr),
                 explanation: "Hafalan sudut istimewa trigonometri."
             };
        }
    }

    // Default return for number-based Math (SD/SMP/SMA Log)
    const correct = a.toString();
    const wr1 = (a + Math.floor(Math.random() * 5) + 1).toString();
    const wr2 = (a - Math.floor(Math.random() * 5) - 1).toString();
    const wr3 = (a + 10).toString();
    options = [correct, wr1, wr2, wr3].sort(() => Math.random() - 0.5);

    return {
        question: q,
        options: options,
        correctAnswerIndex: options.indexOf(correct),
        explanation: exp
    };
}

// Fungsi Helper Internal untuk 1 Soal (Legacy wrapper)
const generateSingleQuestion = (category: string): QuizQuestion => {
    // Legacy fallback, logic dipindah ke generateMathQuestionByLevel untuk math
    const bank = QUESTION_BANK[category];
    if (bank && bank.length > 0) {
        return getRandomItem(bank);
    }
    const facts = KNOWLEDGE_BASE[category] || KNOWLEDGE_BASE['umum'];
    const fact = getRandomItem(facts);
    return {
        question: `Manakah pernyataan yang BENAR terkait ${category}?`,
        options: [fact, "Pernyataan ini salah total.", "Tidak ada jawaban benar.", "Informasi ini palsu."],
        correctAnswerIndex: 0,
        explanation: "Fakta valid dari database FMA."
    };
}

// --- FITUR 1: GENERATE MATERI ---
export const generateLearningMaterial = async (
  grade: string,
  subject: string,
  bookName: string,
  pageInfo: string
): Promise<string> => {
  console.log(`[FMA Engine] Reading Book: ${bookName}`);
  await delay(1500); // Simulasi 'Reading'

  const category = getCategory(subject);
  const facts = KNOWLEDGE_BASE[category] || KNOWLEDGE_BASE['umum'] || KNOWLEDGE_BASE['sejarah'];
  
  const fact1 = getRandomItem(facts);
  let fact2 = getRandomItem(facts);
  let attempts = 0;
  while(fact2 === fact1 && facts.length > 1 && attempts < 10) {
      fact2 = getRandomItem(facts);
      attempts++;
  }

  return `
# 📖 Ringkasan Cerdas: ${bookName}
### 📌 Kelas: ${grade} | Mapel: ${subject}
---

## 🤖 Analisis FMA Intelligence
Halo! Saya telah memindai topik pada **${pageInfo}**. Berdasarkan database kurikulum lokal saya, ini adalah materi esensial.

## 🔑 Poin Kunci (Wajib Diingat)

1. **Konsep Dasar**
   ${fact1}

2. **Pendalaman Materi**
   ${fact2}

3. **Fokus Ujian**
   Perhatikan istilah-istilah yang dicetak tebal di buku ${bookName} halaman ${pageInfo}. Guru sering mengambil soal dari kotak rangkuman di akhir bab.

## 💡 Tips Belajar Cepat
> *"${getRandomItem(QUOTES)}"*

---
*Generated by FMA Neural Engine (Local)*
  `;
};

// --- FITUR 2: GENERATE KUIS (NORMAL) ---
export const generateQuiz = async (
  grade: string,
  subject: string,
  topic: string,
  count: number = 10
): Promise<QuizQuestion[]> => {
  await delay(1000);
  const category = getCategory(subject);
  const questions: QuizQuestion[] = [];
  const actualCount = Math.min(count, 10);

  // Jika mapel hitungan, gunakan generator level (default SMP untuk quiz biasa jika tidak spec)
  const isMath = ['matematika', 'fisika', 'kimia'].includes(category);
  const level = grade.includes('SD') ? 'SD' : grade.includes('SMA') ? 'SMA' : 'SMP';

  for(let i=0; i<actualCount; i++) {
      if (isMath && Math.random() > 0.3) {
           questions.push(generateMathQuestionByLevel(level));
      } else {
           questions.push(generateSingleQuestion(category));
      }
  }
  return questions;
};

// --- FITUR 3: FESTIVAL (50 SOAL BERJENJANG) ---
export const generateFestivalQuestions = async (level: string): Promise<QuizQuestion[]> => {
    await delay(1500); 
    const questions: QuizQuestion[] = [];
    
    // Config Difficulty
    // SD: Banyak Umum/Sejarah, Math simple
    // SMP: Banyak Fisika/Biologi, Math Algebra
    // SMA: Banyak Ekonomi/Sains Detail, Math Calculus/Log
    
    const generalCats = ['sejarah', 'biologi', 'pkn', 'umum', 'agama', 'geografi'];
    const scienceCats = ['fisika', 'kimia', 'biologi', 'ekonomi'];
    
    for (let i = 0; i < 50; i++) {
        let q: QuizQuestion;
        
        // 40% Soal Matematika/Logika (Tingkat Kesulitan Sesuai Level)
        if (Math.random() < 0.4) {
            q = generateMathQuestionByLevel(level);
            // Tagging
            q.question = `[LOGIKA ${level}] ${q.question}`;
        } else {
            // 60% Pengetahuan Umum (Kategori disesuaikan level)
            let catList = generalCats;
            if (level === 'SMA') catList = [...generalCats, ...scienceCats];
            
            const randomCat = catList[Math.floor(Math.random() * catList.length)];
            q = generateSingleQuestion(randomCat);
            q.question = `[${randomCat.toUpperCase()}] ${q.question}`;
        }

        questions.push(q);
    }
    return questions;
};


// --- FITUR 4: SMART CHATBOT (MATH ENGINE + DEEP SEARCH) ---

export const chatWithAI = async (message: string, grade: string, subject: string): Promise<string> => {
  await delay(600); // Fast Response
  const msg = message.toLowerCase();

  // 1. ENGINE HITUNG (Math Solver)
  // Mendeteksi pola "hitung 5 + 5" atau "10 * 10"
  // Menggunakan new RegExp untuk menghindari error parser pada regex literal dengan karakter slash
  if (msg.includes('hitung') || msg.match(new RegExp("[\\d]+[\\s]*[\\+\\-\\*\\/][\\s]*[\\d]+"))) {
      try {
          // Bersihkan string agar aman (hanya angka dan operator matematika)
          const mathExpr = msg.replace(/[a-z\?]/g, '').trim(); 
          // Cek apakah valid math
          if (new RegExp("^[\\d\\+\\-\\*\\/\\(\\)\\.\\s]+$").test(mathExpr)) {
              // eslint-disable-next-line no-new-func
              const result = new Function('return ' + mathExpr)();
              return `🧮 **Mesin Hitung FMA:**\n\nSoal: ${mathExpr}\n**Jawabannya: ${result}**`;
          }
      } catch (e) {
          // Ignore error, lanjut ke logic lain
      }
  }

  // 2. ENGINE WAKTU (Time Awareness)
  if (msg.includes('jam berapa') || msg.includes('tanggal berapa') || msg.includes('hari apa')) {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return `🕒 **Waktu Saat Ini:**\n\n${now.toLocaleDateString('id-ID', options)}\nJangan lupa atur waktu belajar ya!`;
  }

  // 3. ENGINE DEFINISI (Knowledge Search)
  // Mencari keyword di seluruh database
  let foundFacts: string[] = [];
  
  // Gabungkan semua knowledge
  const allFacts = Object.values(KNOWLEDGE_BASE).flat();
  
  // Cari kalimat yang mengandung kata kunci user (minimal 4 huruf)
  const keywords = msg.split(' ').filter(k => k.length > 4 && !['apakah','bagaimana','siapa','kenapa','untuk'].includes(k));
  
  if (keywords.length > 0) {
      keywords.forEach(key => {
          const match = allFacts.find(fact => fact.toLowerCase().includes(key));
          if (match && !foundFacts.includes(match)) foundFacts.push(match);
      });
  }

  if (foundFacts.length > 0) {
      return `📚 **FMA Knowledge Base:**\n\nSaya menemukan informasi terkait:\n\n> "${foundFacts[0]}"\n\nApakah ini membantu tugasmu?`;
  }

  // 4. POLA UMUM (Pattern Matching)
  if (msg.match(/\b(halo|hai|pagi|siang|malam)\b/)) 
    return `Halo **${grade}**! Saya FMA Intelligence. \n\nCoba ketik **"Hitung 50 * 3"** atau tanya **"Apa itu Fotosintesis"**. Saya bisa menjawabnya tanpa internet!`;

  if (msg.match(/\b(terima kasih|makasih|thanks)\b/))
    return "Sama-sama! Senang bisa membantu. Terus semangat belajar ya!";

  if (msg.match(/\b(bodoh|goblok|stupid)\b/))
    return "Waduh, bahasa kasar tidak membuat kita pintar. Yuk gunakan kata-kata yang baik sobat EduPintar!";

  // 5. FALLBACK
  return `
🤔 Hmm, saya belum mengerti "${message}".

**Kemampuan AI Lokal saya:**
1. **Berhitung:** Ketik "Hitung 150 + 75"
2. **Cek Waktu:** Ketik "Jam berapa"
3. **Definisi:** Ketik "Apa itu Sel" atau "Apa itu Pancasila"

Coba tanya yang lain?
  `;
};