import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserPlusIcon 
} from '@heroicons/react/24/outline';
import api from '../services/api';

/**
 * Page Register - Version Professionnelle
 * Design centré, formulaire dans une carte élégante (style SaaS), icônes intégrées, animations au survol.
 */
export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Appel POST vers la route sécurisée de ton backend
      await api.post('/users/register', {
        username: username,
        email: email,
        password: password,
        role: "USER" // Rôle par défaut
      });

      // Si ça marche, on redirige vers la page de connexion
      navigate('/login');
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      // Gestion de l'erreur (ex: email déjà utilisé)
      setError("Impossible de créer le compte. Cet email est peut-être déjà utilisé.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Centre le contenu horizontalement et verticalement avec une hauteur minimale
    <main className="max-w-7xl mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-200px)] py-12 md:py-16">
      
      {/* Carte élégante du formulaire (même style que Login) */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        
        {/* Décoration en arrière-plan (cercle flouté) */}
        <div className="absolute -top-10 -right-10 bg-brand-50 h-32 w-32 rounded-full blur-2xl opacity-70"></div>

        {/* En-tête du formulaire stylisé */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex bg-brand-50 p-3 rounded-2xl mb-4 border border-brand-100 shadow-sm">
            <UserPlusIcon className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">Registre</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Rejoignez notre communauté de développeurs.</p>
        </div>

        {/* Zone de message d'erreur stylisée */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm text-center font-semibold animate-pulse">
            {error}
          </div>
        )}

        {/* Le formulaire d'inscription */}
        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* Champ Nom d'utilisateur */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-800 mb-2">Nom d'utilisateur</label>
            <div className="relative group">
              {/* Icône Utilisateur intégrée */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: ZakariaDev"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">Adresse Email</label>
            <div className="relative group">
              {/* Icône Enveloppe intégrée */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: zakaria.ghrib@email.ma"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">Mot de passe</label>
            <div className="relative group">
              {/* Icône Cadenas intégrée */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Bouton d'inscription moderne */}
          <button
            type="submit" 
            disabled={isLoading || !username.trim() || !email.trim() || !password.trim()}
            className="w-full bg-brand-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 flex justify-center items-center gap-2 text-base"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "S'inscrire"}
          </button>
        </form>

        {/* Lien vers la connexion épuré */}
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">Vous avez déjà un compte ? <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">J'ai déjà un compte</Link></p>
        </div>
      </div>
    </main>
  );
}