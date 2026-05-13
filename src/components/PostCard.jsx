import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function PostCard({ id, title, content, authorName, date }) {
  // Formatage de la date pour un rendu professionnel
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Extraction de l'initiale pour l'avatar
  const initial = authorName ? authorName.charAt(0).toUpperCase() : 'A';

  return (
    <Link to={`/post/${id}`} className="group block h-full">
      <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between h-full relative overflow-hidden">
        {/* Effet décoratif en arrière-plan au survol */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500 opacity-50"></div>

        <div>
          {/* Header de la carte : Auteur et Date */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {initial}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 leading-tight">
                {authorName || 'Anonyme'}
              </span>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <CalendarIcon className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Titre de l'article */}
          <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
            {title}
          </h2>
          
          {/* Aperçu du contenu */}
          <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-6">
            {content}
          </p>
        </div>

        {/* Footer de la carte */}
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-brand-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
            Lire l'article
            <ArrowRightIcon className="w-4 h-4" />
          </span>
          <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Blog Post
          </div>
        </div>
      </article>
    </Link>
  );
}