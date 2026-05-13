import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRightOnRectangleIcon, 
  UserPlusIcon, 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Synchronisation de la session avec le localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    
    // Écouteur pour mettre à jour la Navbar instantanément lors d'une connexion/déconnexion
    const handleAuthChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
      setCurrentUser(updatedUser);
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jwtToken');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* ZONE GAUCHE : Logo stylisé */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-600 p-2.5 rounded-xl shadow-lg shadow-brand-500/20 group-hover:bg-brand-700 transition-all">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tighter">
                Zak<span className="text-brand-600">Blog</span>
              </span>
            </Link>
          </div>

          {/* ZONE CENTRALE : Barre de recherche (Masquée sur mobile) */}
          <div className="hidden md:block flex-grow max-w-sm mx-4">
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="search" 
                placeholder="Rechercher un article..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* ZONE DROITE : Actions dynamiques */}
          <div className="flex items-center">
            {currentUser ? (
              // Actions si connecté
              <div className="flex items-center gap-3 sm:gap-4">
                <Link 
                  to="/create-post" 
                  className="hidden sm:block text-slate-700 font-semibold hover:text-brand-600 transition-colors text-sm"
                >
                  Rédiger
                </Link>
                
                {/* Avatar utilisateur (Responsive : nom masqué sur mobile) */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 sm:pl-3 rounded-full border border-slate-200">
                  <span className="hidden sm:block text-sm font-bold text-slate-900">
                    {currentUser.username}
                  </span>
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-base sm:text-lg ring-2 ring-white shadow-sm">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Bouton de déconnexion */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 font-bold p-2.5 sm:p-3 rounded-xl hover:bg-red-100 transition-all hover:scale-105"
                  title="Déconnexion"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              // Actions si déconnecté (Landing Page)
              <div className="flex items-center gap-2 sm:gap-3">
                <Link 
                  to="/login" 
                  className="text-slate-700 font-bold px-3 py-2 sm:px-5 sm:py-3 hover:text-brand-600 transition-colors flex items-center gap-2 rounded-xl hover:bg-brand-50 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Connexion</span>
                  <ArrowRightOnRectangleIcon className="h-5 w-5 sm:hidden" />
                </Link>
                <Link 
                  to="/register" 
                  className="bg-brand-600 text-white font-extrabold px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center gap-2 text-sm sm:text-base"
                >
                  <UserPlusIcon className="h-5 w-5 hidden sm:block" />
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}