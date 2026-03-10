import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { session, loading } = useAuth();

    // Optionally show a loading spinner while Supabase checks the session
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50/50">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent flex rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        // If not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If logged in, render the child routes (e.g., Dashboard)
    return <Outlet />;
}
