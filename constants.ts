import { EducationLevel } from './types';

export const GRADES = {
  [EducationLevel.SD]: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
  [EducationLevel.SMP]: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
  [EducationLevel.SMA]: ['Kelas 10', 'Kelas 11', 'Kelas 12'],
};

export const SUBJECTS_DATA: any = {
  "SD": {
    "Umum": [
      "Pendidikan Pancasila dan Kewarganegaraan (PPKn)",
      "Bahasa Indonesia",
      "Matematika",
      "Ilmu Pengetahuan Alam (IPA)",
      "Ilmu Pengetahuan Sosial (IPS)",
      "Seni Budaya dan Prakarya (SBdP)",
      "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
      "Muatan Lokal"
    ],
    "Agama": [
      "Pendidikan Agama"
    ]
  },
  "SMP": {
    "Umum": [
      "Pendidikan Pancasila dan Kewarganegaraan (PPKn)",
      "Bahasa Indonesia",
      "Matematika",
      "Ilmu Pengetahuan Alam (IPA)",
      "Ilmu Pengetahuan Sosial (IPS)",
      "Bahasa Inggris",
      "Seni Budaya",
      "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
      "Prakarya",
      "Informatika",
      "Muatan Lokal"
    ],
    "Agama": [
      "Pendidikan Agama"
    ]
  },
  "SMA": {
    "Umum": [
      "Pendidikan Pancasila dan Kewarganegaraan (PPKn)",
      "Bahasa Indonesia",
      "Matematika",
      "Bahasa Inggris",
      "Sejarah Indonesia",
      "Seni Budaya",
      "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
      "Informatika",
      "Muatan Lokal"
    ],
    "Agama": [
      "Pendidikan Agama"
    ],
    "Peminatan": {
      "IPA": [
        "Fisika",
        "Kimia",
        "Biologi"
      ],
      "IPS": [
        "Geografi",
        "Sejarah",
        "Sosiologi",
        "Ekonomi"
      ],
      "Bahasa": [
        "Bahasa dan Sastra Indonesia",
        "Bahasa dan Sastra Inggris",
        "Bahasa Asing Lain"
      ]
    }
  }
};

export const ADMIN_CREDENTIALS = {
  username: "FADEL AQRAM MARPAUNG",
  password: "FADEL123"
};

export const CONTACT_INFO = {
  whatsapp: "08822930100",
  copyright: "© 2025 FADEL AQRAM MARPAUNG"
};