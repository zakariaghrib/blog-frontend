import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate();

  // Vérification de la session au chargement de la page
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      // Si non connecté, on le renvoie vers le login
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // On utilise le VRAI ID de l'utilisateur connecté !
      await api.post('/posts', {
        title: title,
        content: content,
        author: { id: currentUser.id } 
      });

      navigate('/'); // Retour à l'accueil après le succès
      
    } catch (err) {
      console.error("Erreur lors de la création de l'article :", err);
      setError("Impossible de publier l'article. Vérifiez la connexion au serveur.");
      setIsSubmitting(false);
    }
  };

  // On ne rend rien tant qu'on n'a pas vérifié l'utilisateur
  if (!currentUser) return null; 

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 font-medium transition-colors group">
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        Annuler et retourner aux articles
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <header className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="bg-brand-50 p-3 rounded-lg">
            <DocumentTextIcon className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Écrire un nouvel article</h1>
            <p className="text-sm text-slate-500">Publié en tant que <span className="font-bold text-brand-600">{currentUser.username}</span></p>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">Titre de l'article</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Comment bien débuter avec Vue 3 et Tailwind..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2">Contenu</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez le contenu de votre article ici..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all min-h-[300px] resize-y"
              required
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 active:scale-95 transition-all shadow-sm shadow-brand-500/30 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Publier l\'article'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}