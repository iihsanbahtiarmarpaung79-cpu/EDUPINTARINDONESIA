import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Info, Home, Phone, Menu, X, Lock, Users, School, PartyPopper } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-islamic-700 text-white shadow-lg' : 'text-islamic-50 hover:bg-islamic-700/50 hover:text-white';

  const navItems = [
    { path: '/', label: 'Beranda', icon: <Home size={20} /> },
    { path: '/festival', label: 'Festival', icon: <PartyPopper size={20} className="text-gold-400" /> }, // New Festival Menu
    { path: '/class-room', label: 'Ruang Kelas', icon: <Users size={20} /> },
    { path: '/learning', label: 'Materi', icon: <BookOpen size={20} /> },
    { path: '/quiz', label: 'Latihan', icon: <GraduationCap size={20} /> },
    { path: '/about', label: 'Tentang', icon: <Info size={20} /> },
    { path: '/contact', label: 'Kontak', icon: <Phone size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-islamic-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <School size={32} className="text-gold-500" />
              <span className="font-bold text-xl tracking-tight">EduPintar</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive(item.path)}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/admin')}`}
                >
                    <Lock size={16} />
                    Admin
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-islamic-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-islamic-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-islamic-600 pb-3 px-2 pt-2 space-y-1 sm:px-3 shadow-inner">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive(item.path)}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive('/admin')}`}
            >
                <Lock size={16} />
                Admin
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-islamic-900 text-white py-8 mt-auto border-t-4 border-gold-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold text-gold-500 mb-2">EduPintar Indonesia</h3>
              <p className="text-islamic-200 text-sm max-w-md">
                Platform Sekolah & Kompetisi Digital Terdepan.
                Cetak generasi emas melalui teknologi pendidikan lokal.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
                <div className="text-center md:text-right">
                  <p className="text-sm font-medium">{CONTACT_INFO.copyright}</p>
                  <p className="text-xs text-islamic-300 mt-1">Sistem FMA v3.0 (Classroom Edition)</p>
                </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;