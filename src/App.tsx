import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/admin.functions";

// Import page components
import Home from "./routes/index";
import About from "./routes/about";
import ArticlesIndex from "./routes/articles.index";
import ArticleView from "./routes/articles.$slug";
import Auth from "./routes/auth";
import Membership from "./routes/membership";
import Newsletter from "./routes/newsletter";
import Predictions from "./routes/predictions";
import AdminDashboard from "./routes/_authenticated/admin.index";
import AdminArticles from "./routes/_authenticated/admin.articles";
import AdminPredictions from "./routes/_authenticated/admin.predictions";
import AdminSubscribers from "./routes/_authenticated/admin.subscribers";
import AdminLayout from "./components/AdminLayout";

// Protected Route wrapper for Admin panel
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        const roles = await getMyRoles();
        const staff = roles.includes("admin") || roles.includes("editor");
        setIsStaff(staff);
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-mono text-sm tracking-widest text-muted-foreground">LOADING...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="font-serif text-3xl">Access Denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">You do not have permission to access the admin panel.</p>
        <a href="/" className="mt-6 inline-flex items-center justify-center border border-ink px-4 py-2 text-xs font-mono uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">
          Go Home
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<ArticlesIndex />} />
        <Route path="/articles/:slug" element={<ArticleView />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/predictions" element={<Predictions />} />

        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/articles" element={<ProtectedRoute><AdminLayout><AdminArticles /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/predictions" element={<ProtectedRoute><AdminLayout><AdminPredictions /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/subscribers" element={<ProtectedRoute><AdminLayout><AdminSubscribers /></AdminLayout></ProtectedRoute>} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
