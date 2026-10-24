import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll to top on page change, or to the #anchor if the URL has one. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // wait a tick so lazy-loaded pages have rendered the target
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
