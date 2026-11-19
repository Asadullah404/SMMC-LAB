import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-blue-950/20">
      <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md mx-4">
        <h1 className="mb-2 text-5xl font-black text-blue-600 dark:text-blue-400">404</h1>
        <p className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">Page Not Found</p>
        <p className="mb-6 text-sm text-slate-500">The requested page or diagnostic route does not exist.</p>
        <a href="/" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
