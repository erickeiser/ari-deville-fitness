import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CMSProvider } from './contexts/CMSContext';

// Public components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import PublicServices from './components/public/PublicServices';
import PublicTestimonials from './components/public/PublicTestimonials';
import IntakeForm from './components/IntakeForm';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import Login from './components/admin/Login';
import Register from './components/admin/Register';
import Dashboard from './components/admin/Dashboard';
import ServicesManager from './components/admin/ServicesManager';
import TestimonialsManager from './components/admin/TestimonialsManager';
import MediaLibrary from './components/admin/MediaLibrary';
import UserManager from './components/admin/UserManager';
import IntakeManager from './components/admin/IntakeManager';
import ContentManager from './components/admin/ContentManager';
import MessagesManager from './components/admin/MessagesManager';
import ProtectedRoute from './components/admin/ProtectedRoute';

const PublicSite = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <Hero />
    <About />
    <PublicServices />
    <PublicTestimonials />
    <IntakeForm />
    <Contact />
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicSite />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="users" element={<UserManager />} />
              <Route path="intake" element={<IntakeManager />} />
              <Route path="messages" element={<MessagesManager />} />
              <Route path="content" element={<ContentManager />} />
            </Route>
          </Routes>
        </Router>
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;