import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import AppTool from './pages/AppTool';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import TrustPage from './pages/TrustPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* New Content-First Landing Page */}
        <Route index element={<Landing />} />
        
        {/* The actual SaaS Tool */}
        <Route path="app" element={<AppTool />} />
        
        {/* Blog Routes */}
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        
        {/* Trust Pages Routes */}
        <Route path="privacy-policy" element={<TrustPage title="Privacy Policy" />} />
        <Route path="terms-of-service" element={<TrustPage title="Terms of Service" />} />
        <Route path="about" element={<TrustPage title="About Us" />} />
        <Route path="contact" element={<TrustPage title="Contact Us" />} />
      </Route>
    </Routes>
  );
}

export default App;
