
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import EntranceAnimation from './components/EntranceAnimation';

// 路由懒加载
const Home = lazy(() => import('./pages/Home'));
const WikiPage = lazy(() => import('./pages/WikiPage'));
const AdminReview = lazy(() => import('./pages/AdminReview'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 简单的加载占位组件
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin dark:border-slate-800 dark:border-t-white" />
  </div>
);

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Router>
      {!isLoaded && <EntranceAnimation onComplete={() => setIsLoaded(true)} />}
      <div className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0 scale-95'}`}>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wiki/:slug" element={<WikiPage />} />
              <Route path="/admin/review" element={<AdminReview />} />
              <Route path="/admin" element={<Navigate to="/admin/review" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
