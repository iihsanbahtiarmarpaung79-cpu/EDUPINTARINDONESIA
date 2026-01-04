import React from 'react';
import { CONTACT_INFO } from '../constants';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Hubungi Kami</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Informasi Kontak</h2>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                     <Phone size={24} />
                  </div>
                  <div>
                     <p className="text-sm text-gray-500">WhatsApp</p>
                     <p className="font-bold text-lg text-gray-800">{CONTACT_INFO.whatsapp}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                     <Mail size={24} />
                  </div>
                  <div>
                     <p className="text-sm text-gray-500">Email</p>
                     <p className="font-bold text-lg text-gray-800">support@edupintar.id</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full text-red-600">
                     <MapPin size={24} />
                  </div>
                  <div>
                     <p className="text-sm text-gray-500">Alamat</p>
                     <p className="font-bold text-lg text-gray-800">Jakarta, Indonesia</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-gold-500">
             <h2 className="text-xl font-bold mb-6 text-gray-800">Kirim Pesan</h2>
             <form className="space-y-4">
                <input type="text" placeholder="Nama Lengkap" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                <input type="email" placeholder="Alamat Email" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" />
                <textarea rows={4} placeholder="Pesan Anda" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"></textarea>
                <button type="button" className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-lg transition-colors">
                   Kirim Pesan
                </button>
             </form>
         </div>
      </div>
    </div>
  );
};

export default Contact;
