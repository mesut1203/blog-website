import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Science from './pages/Science';
import BuddhismStoicism from './pages/BuddhismStoicism';
import Psychology from './pages/Psychology';
import FunBooks from './pages/FunBooks';
import Languages from './pages/Languages';
import Self from './pages/Self';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-emerald-50/50 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden font-sans flex flex-col">
          <Header />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/science" element={<Science />} />
              <Route path="/buddhism-stoicism" element={<BuddhismStoicism />} />
              <Route path="/psychology" element={<Psychology />} />
              <Route path="/fun-books" element={<FunBooks />} />
              <Route path="/languages" element={<Languages />} />
              <Route path="/self" element={<Self />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
