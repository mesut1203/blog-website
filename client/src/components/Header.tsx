import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf as LeafIcon, LogOut as LogOutIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

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
        <Link to="/" className={`font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${isActive('/') ? 'text-emerald-600 after:w-full after:bg-emerald-600' : 'text-emerald-800 hover:text-emerald-600 after:w-0 hover:after:w-full after:bg-emerald-600'}`}>Home</Link>
        <Link to="/blog" className={`font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${isActive('/blog') ? 'text-emerald-600 after:w-full after:bg-emerald-600' : 'text-emerald-800 hover:text-emerald-600 after:w-0 hover:after:w-full after:bg-emerald-600'}`}>Blog</Link>
        <Link to="/contact" className={`font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${isActive('/contact') ? 'text-emerald-600 after:w-full after:bg-emerald-600' : 'text-emerald-800 hover:text-emerald-600 after:w-0 hover:after:w-full after:bg-emerald-600'}`}>Contact</Link>

        {session ? (
          <>
            <Link to="/dashboard" className={`font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 pb-1 ${isActive('/dashboard') ? 'text-emerald-600 after:w-full after:bg-emerald-300' : 'text-emerald-800 hover:text-emerald-600 after:w-0 hover:after:w-full after:bg-emerald-600'}`}>Dashboard</Link>
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
        <button 
          className="md:hidden text-emerald-950 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-emerald-50 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <Link 
            to="/" 
            className={`font-semibold text-lg py-2 transition-colors ${isActive('/') ? 'text-emerald-600 pl-2 border-l-2 border-emerald-600 bg-emerald-50/50' : 'text-emerald-900 hover:text-emerald-600'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/blog" 
            className={`font-semibold text-lg py-2 transition-colors ${isActive('/blog') ? 'text-emerald-600 pl-2 border-l-2 border-emerald-600 bg-emerald-50/50' : 'text-emerald-900 hover:text-emerald-600'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link 
            to="/contact" 
            className={`font-semibold text-lg py-2 transition-colors ${isActive('/contact') ? 'text-emerald-600 pl-2 border-l-2 border-emerald-600 bg-emerald-50/50' : 'text-emerald-900 hover:text-emerald-600'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          <div className="h-px bg-emerald-100 my-2 w-full"></div>

          {session ? (
            <>
              <Link 
                to="/dashboard" 
                className={`font-semibold text-lg py-2 transition-colors ${isActive('/dashboard') ? 'text-emerald-600 pl-2 border-l-2 border-emerald-600 bg-emerald-50/50' : 'text-emerald-900 hover:text-emerald-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-3 px-4 justify-center text-sm font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors shadow-sm mt-2"
              >
                <LogOutIcon className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="py-3 px-4 text-center text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all shadow-md mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
