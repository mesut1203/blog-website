import { Link, useNavigate } from 'react-router-dom';
import { Leaf as LeafIcon, LogOut as LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-emerald-50 shadow-sm transition-all duration-300">
      <div className="w-full py-4 md:py-6 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
        <div className="bg-emerald-600 p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-emerald-600/20">
          <LeafIcon className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-emerald-950">SoulTrees</span>
      </Link>
      <nav className="hidden md:flex gap-8 items-center">
        <Link to="/" className="text-emerald-800 font-medium hover:text-emerald-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300 pb-1">Home</Link>
        <a href="#blog" className="text-emerald-800 font-medium hover:text-emerald-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300 pb-1">Blog</a>
        <a href="#contact" className="text-emerald-800 font-medium hover:text-emerald-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300 pb-1">Contact</a>

        {session ? (
          <>
            <Link to="/dashboard" className="text-emerald-800 font-medium hover:text-emerald-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300 pb-1">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-emerald-600/20">
            Login
          </Link>
        )}
      </nav>
        <button className="md:hidden text-emerald-950">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
