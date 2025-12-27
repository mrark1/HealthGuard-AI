
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MEDICAL_DISCLAIMER } from '../constants';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Chatbot', path: '/', icon: '💬' },
    { label: 'Symptoms', path: '/symptoms', icon: '🩺' },
    { label: 'Health Hub', path: '/hub', icon: '🏥' },
    { label: 'Quiz', path: '/quiz', icon: '🏆' },
    { label: 'Offline', path: '/offline', icon: '📶' },
    { label: 'Stats', path: '/admin', icon: '📊' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold tracking-tight">HealthGuard AI</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path ? 'bg-emerald-700' : 'hover:bg-emerald-500'
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="border-l border-emerald-500 pl-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-bold border border-emerald-400 group-hover:bg-emerald-900">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-sm font-medium">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={logout} className="text-xs font-bold text-emerald-200 hover:text-white uppercase tracking-wider">Logout</button>
                </div>
              ) : (
                <Link to="/auth" className="bg-white text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-50 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-amber-500 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 font-medium">
                {MEDICAL_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
        {children}
      </main>

      {/* Mobile Footer Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 z-50">
        {navItems.slice(0, 4).map(item => (
          <Link key={item.path} to={item.path} className={`flex flex-col items-center p-2 ${location.pathname === item.path ? 'text-emerald-600' : 'text-slate-500'}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] uppercase font-bold">{item.label}</span>
          </Link>
        ))}
        <Link to="/dashboard" className="flex flex-col items-center p-2 text-slate-500">
          <span className="text-xl">👤</span>
          <span className="text-[10px] uppercase font-bold">Me</span>
        </Link>
      </nav>

      {/* Project Team & Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
            {/* Branding & Mission */}
            <div className="md:col-span-4">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-3xl">🛡️</span>
                <h3 className="text-white text-xl font-bold">HealthGuard AI</h3>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                A social-impact driven AI solution designed to bridge the healthcare gap in rural communities through language-accessible intelligence and preventive awareness.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold uppercase tracking-widest text-emerald-500 border border-emerald-900/30">React 19</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold uppercase tracking-widest text-emerald-500 border border-emerald-900/30">Gemini 3.0</span>
                <span className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold uppercase tracking-widest text-emerald-500 border border-emerald-900/30">Tailwind CSS</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Resources</h4>
              <ul className="text-sm space-y-3">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🌍</span> WHO Guidelines
                </li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">🇮🇳</span> ICMR Research
                </li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">💉</span> CoWIN Portal
                </li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center">
                  <span className="mr-2">📄</span> Privacy & Ethics
                </li>
              </ul>
            </div>

            {/* Team Details Section */}
            <div className="md:col-span-5 bg-slate-800/40 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
              
              <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.2em] flex items-center">
                <span className="mr-2 text-emerald-500">◆</span> Developed By
              </h4>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="relative">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-emerald-500/50 p-1 shadow-2xl shadow-emerald-900/40 group-hover:border-emerald-400 transition-colors bg-slate-900">
                    <img 
                      src="arpit.jpg" 
                      alt="Arpit Raj Katiyar" 
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        // Fallback in case the image isn't found during initial setup
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200";
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl uppercase shadow-xl border border-emerald-400/30">
                    CS-AIML
                  </div>
                </div>
                
                <div className="text-center sm:text-left">
                  <h5 className="text-white text-xl font-bold mb-1">Arpit Raj Katiyar</h5>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.15em] mb-4">Team Leader & AI Architect</p>
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-6 max-w-xs">
                    "Driving innovation in public health technology through AI-driven community-focused design."
                  </p>
                  
                  <div className="flex justify-center sm:justify-start space-x-4">
                    <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">LinkedIn</a>
                    <span className="text-slate-700">|</span>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">GitHub</a>
                    <span className="text-slate-700">|</span>
                    <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Portfolio</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-slate-600">
              © 2025 HealthGuard AI • Empowering Communities
            </p>
            <div className="flex space-x-6 text-[10px] font-bold uppercase tracking-widest text-slate-700">
              <span className="hover:text-slate-500 cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-slate-500 cursor-pointer transition-colors">Github Repo</span>
              <span className="hover:text-slate-500 cursor-pointer transition-colors">Contact Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
