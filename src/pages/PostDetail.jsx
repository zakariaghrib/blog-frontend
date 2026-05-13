import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserCircleIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  TrashIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const postRes = await api.get('/posts');
        const currentPost = postRes.data.find(p => p.id === parseInt(id));
        
        if (!currentPost) {
          setError("Cet article n'existe pas.");
          setLoading(false);
          return;
        }
        setPost(currentPost);

        const commentsRes = await api.get(`/comments/post/${id}`);
        setComments(commentsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
        setLoading(false);
      }
    };
    fetchPostData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      setIsSubmitting(true);
      const response = await api.post('/comments', {
        content: newComment,
        author: { id: currentUser.id },
        post: { id: parseInt(id) }
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      alert("Erreur lors de l'envoi du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      try {
        setIsDeleting(true);
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        alert("Erreur lors de la suppression.");
        setIsDeleting(false);
      }
    }
  };

  if (loading) return <div className="text-center mt-20">Chargement...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const isAuthor = currentUser && post.author && currentUser.id === post.author.id;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 font-medium">
        <ArrowLeftIcon className="w-4 h-4" /> Retour aux articles
      </Link>

      <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <header className="p-6 md:p-12 border-b border-slate-50 bg-slate-50/30 relative">
          
          {isAuthor && (
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <Link 
                to={`/edit-post/${id}`} 
                className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 p-2 rounded-lg transition-colors flex items-center gap-2"
                title="Modifier l'article"
              >
                <PencilSquareIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Modifier</span>
              </Link>
              
              <button 
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-2"
                title="Supprimer l'article"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Supprimer</span>
              </button>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-6 pr-32">
            {post.title}
          </h1>
          
          <div className="flex gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2 font-semibold text-slate-700">
              <UserCircleIcon className="w-5 h-5 text-brand-500" /> {post.author?.username || 'Anonyme'}
            </span>
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-400" /> {formattedDate}
            </span>
          </div>
        </header>

        <div className="p-6 md:p-12">
          <div className="prose prose-slate max-w-none text-slate-700 text-lg leading-relaxed mb-12">
            {post.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() !== "" && <p key={idx} className="mb-6">{paragraph}</p>
            ))}
          </div>

          <section className="mt-12 pt-12 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-8">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-brand-600" />
              <h3 className="text-xl font-bold text-slate-900">Commentaires ({comments.length})</h3>
            </div>

            {/* FORMULAIRE D'AJOUT DE COMMENTAIRE */}
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mb-10 relative">
                <textarea
                  value={newComment} onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrivez un commentaire..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-16 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 resize-none"
                  rows="3" required
                />
                <button type="submit" disabled={isSubmitting || !newComment.trim()} className="absolute bottom-4 right-4 bg-brand-600 text-white p-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors">
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="mb-10 bg-slate-50 rounded-xl p-6 text-center border border-dashed border-slate-200">
                <p className="text-slate-600 mb-4 text-sm">Connectez-vous pour laisser un commentaire.</p>
                <Link to="/login" className="text-sm bg-brand-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors">Se connecter</Link>
              </div>
            )}

            {/* AFFICHAGE DE LA LISTE DES COMMENTAIRES */}
            {comments.length === 0 ? (
              <div className="text-center text-slate-500 italic p-4">
                Aucun commentaire pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] uppercase font-bold">
                          {comment.author?.username?.charAt(0) || 'U'}
                        </div>
                        {comment.author?.username || 'Utilisateur'}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-medium">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </section>
        </div>
      </article>
    </main>
  );
}