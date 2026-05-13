import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  GlobeAltIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // LA CORRECTION EST ICI : On extrait l'ID qui est un simple texte/nombre
  // Cela empêche React de croire que l'objet change à chaque fois.
  const currentUserId = currentUser ? currentUser.id : null;

  useEffect(() => {
    // On utilise currentUserId pour la vérification
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les articles pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
    
  // LA DEUXIÈME CORRECTION EST ICI : On surveille uniquement l'ID
  }, [currentUserId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  // ==========================================
  // ÉTAT 1 : LANDING PAGE (Utilisateur non connecté)
  // ==========================================
  if (!currentUser) {
    return (
      <main className="bg-white">
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-slate-50 overflow-hidden border-b border-slate-200">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>

          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-8 leading-tight">
              L'espace d'expression des <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Développeurs</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-8 text-slate-600 font-medium max-w-2xl mx-auto">
              Rejoignez DevBlog. Partagez vos connaissances, lisez des articles techniques de qualité et interagissez avec une communauté de passionnés.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 w-full px-4 sm:px-0">
              <Link 
                to="/register" 
                className="w-full sm:w-auto rounded-xl bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-brand-700 transition-all duration-300 text-center"
              >
                Créer un compte gratuit
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto text-base font-bold leading-6 text-slate-900 flex items-center justify-center gap-2 hover:text-brand-600 transition-colors py-4 sm:py-0"
              >
                Se connecter <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-brand-600 tracking-wide uppercase">Tout pour réussir</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Une plateforme conçue pour vous
              </p>
            </div>
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div className="rounded-lg bg-brand-600 p-3 mb-6 shadow-sm">
                  <PencilSquareIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Rédigez facilement</h3>
                <p className="text-slate-600 leading-relaxed">Publiez vos articles et retours d'expérience avec notre éditeur intuitif.</p>
              </div>
              <div className="flex flex-col items-start bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div className="rounded-lg bg-indigo-600 p-3 mb-6 shadow-sm">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Échangez des idées</h3>
                <p className="text-slate-600 leading-relaxed">Laissez des commentaires et débattez sur les publications des autres membres.</p>
              </div>
              <div className="flex flex-col items-start bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div className="rounded-lg bg-emerald-600 p-3 mb-6 shadow-sm">
                  <CodeBracketIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Progressez ensemble</h3>
                <p className="text-slate-600 leading-relaxed">Montez en compétences grâce aux bonnes pratiques partagées par la communauté.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ÉTAT 2 : DASHBOARD (Utilisateur connecté)
  // ==========================================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-20 bg-red-50 p-6 rounded-2xl border border-red-100 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  const myPosts = posts.filter(post => post.author?.id === currentUser.id);
  const otherPosts = posts.filter(post => post.author?.id !== currentUser.id);

  const PostCard = ({ post, isMine }) => (
    <Link 
      to={`/post/${post.id}`} 
      className="group block bg-white rounded-3xl border border-slate-200/80 p-6 h-full hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 hover:border-brand-300 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {isMine && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm z-10">
            Mon Article
          </div>
        )}

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-100 to-indigo-50 text-brand-600 flex items-center justify-center font-bold text-lg ring-2 ring-white shadow-sm">
            {post.author?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              {post.author?.username || 'Anonyme'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 mb-3 leading-tight line-clamp-2">
          {post.title}
        </h2>
        <p className="text-slate-600 text-sm mb-8 line-clamp-3 flex-grow leading-relaxed">
          {post.content}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100/80 flex items-center justify-between">
          <span className="text-brand-600 font-bold text-sm flex items-center gap-1.5 transition-colors group-hover:text-indigo-600">
            Lire l'article <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
          <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-slate-100">
            DevBlog
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Tableau de bord</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          Ravi de vous revoir, {currentUser.username} !
        </p>
      </div>

      {myPosts.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl font-bold">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Mes Publications</h2>
              <span className="bg-slate-100 text-slate-600 text-xs font-extrabold px-2.5 py-1 rounded-full border border-slate-200">
                {myPosts.length}
              </span>
            </div>
            <Link to="/create-post" className="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95 text-sm">
              + Créer
            </Link>
          </div>
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {myPosts.map(post => <PostCard key={post.id} post={post} isMine={true} />)}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
            <GlobeAltIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Fil d'actualité</h2>
        </div>

        {otherPosts.length === 0 ? (
          <div className="text-center bg-slate-50/50 rounded-3xl p-12 border border-dashed border-slate-200">
            <UserCircleIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun article pour le moment</h3>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map(post => <PostCard key={post.id} post={post} isMine={false} />)}
          </div>
        )}
      </section>

    </main>
  );
}