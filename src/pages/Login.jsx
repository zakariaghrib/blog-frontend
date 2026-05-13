import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import api from '../services/api';

/**
 * Page Login - Version Professionnelle
 * Design centré, formulaire dans une carte élégante, icônes intégrées, animations au survol.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/users/login', {
        email: email,
        password: password
      });

      const { token, user } = response.data;

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
      
    } catch (err) {
      console.error("Erreur:", err);
      if (err.response && err.response.status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError('Impossible de se connecter. Le serveur ne répond pas.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Centre le contenu horizontalement et verticalement avec une hauteur minimale
    <main className="max-w-7xl mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-200px)] py-12 md:py-16">
      
      {/* Carte élégante du formulaire */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        
        {/* Décoration en arrière-plan (cercle flouté) */}
        <div className="absolute -top-10 -right-10 bg-brand-50 h-32 w-32 rounded-full blur-2xl opacity-70"></div>

        {/* En-tête du formulaire */}
        <div className="text-center mb-10 relative">
          <div className="inline-flex bg-brand-50 p-3 rounded-2xl mb-4 border border-brand-100 shadow-sm">
            <ArrowRightOnRectangleIcon className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight">Bonjour !</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Connectez-vous pour gérer vos articles techniques.</p>
        </div>

        {/* Zone de message d'erreur stylisée */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm text-center font-semibold animate-pulse">
            {error}
          </div>
        )}

        {/* Le formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">Adresse Email</label>
            <div className="relative group">
              {/* Icône intégrée */}
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
              {/* Icône intégrée */}
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

          {/* Bouton de connexion moderne */}
          <button
            type="submit" 
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full bg-brand-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 flex justify-center items-center gap-2 text-base"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Se connecter'}
          </button>
        </form>

        {/* Lien vers l'inscription épuré */}
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">Pas encore de compte ? <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">Créer un compte</Link></p>
        </div>
      </div>
    </main>
  );
}