import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // CORRECTION : On récupère l'utilisateur à l'intérieur du useEffect
    // Ainsi, il ne déclenchera plus de boucle infinie à chaque fois qu'on tape au clavier.
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await api.get('/posts');
        const post = res.data.find(p => p.id === parseInt(id));

        if (!post) {
          setError("Cet article n'existe pas.");
          setIsLoading(false); 
          return;
        }

        // On vérifie les droits avec l'utilisateur qu'on vient de récupérer
        if (user.id !== post.author?.id) {
          setError("Vous n'avez pas l'autorisation de modifier cet article.");
          setIsLoading(false); 
          return;
        }

        // On pré-remplit les champs
        setTitle(post.title);
        setContent(post.content);
        setIsLoading(false);
      } catch (err) {
        setError("Erreur de récupération des données.");
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id, navigate]); // <-- CORRECTION : currentUser a été retiré d'ici !

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSaving(true);
      
      // Envoi de la requête PUT au contrôleur Spring Boot
      await api.put(`/posts/${id}`, {
        title: title,
        content: content
      });

      // Retour à l'article après modification
      window.location.href = `/post/${id}`;
      
    } catch (err) {
      console.error("Erreur HTTP:", err);
      setError("Impossible de sauvegarder les modifications.");
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center mt-20 text-slate-500 font-medium">Chargement des données...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link to={`/post/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 font-medium">
        <ArrowLeftIcon className="w-4 h-4" /> Annuler et retourner à l'article
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <header className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="bg-brand-50 p-3 rounded-lg">
            <PencilSquareIcon className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Modifier l'article</h1>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">Titre</label>
            <input
              type="text" 
              id="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2">Contenu</label>
            <textarea
              id="content"
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all min-h-[300px] resize-y"
              required
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="submit" 
              disabled={isSaving || !title.trim() || !content.trim()} 
              className="bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}