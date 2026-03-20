import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestore(isLoading: boolean) {
    const { pathname } = useLocation();

    // Save scroll position on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!isLoading) {
                sessionStorage.setItem(`scroll-pos-${pathname}`, window.scrollY.toString());
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname, isLoading]);

    // Restore scroll position after loading completes
    useEffect(() => {
        if (!isLoading) {
            const savedScroll = sessionStorage.getItem(`scroll-pos-${pathname}`);
            if (savedScroll) {
                // Slight delay to ensure DOM renderer has painted the fetched items
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScroll, 10));
                }, 50);
            } else {
                window.scrollTo(0, 0);
            }
        }
    }, [pathname, isLoading]);
}
