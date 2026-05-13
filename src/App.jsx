import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * App.jsx - Architecture Globale
 * Gère le routage et le layout principal de l'application.
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-brand-100 selection:text-brand-700">
        {/* Barre de navigation persistante */}
        <Navbar />

        {/* Zone de contenu dynamique */}
        <div className="flex-grow">
          <Routes>
            {/* Flux principal */}
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            
            {/* Gestion du contenu (Protégé par logique interne aux composants) */}
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            
            {/* Authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        {/* Pied de page professionnel */}
        <footer className="bg-white border-t border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} ZakBlog. Développé avec React et Spring Boot par Zakaria Ghrib.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;