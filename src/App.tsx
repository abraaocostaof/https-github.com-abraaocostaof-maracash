import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'wouter';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClientDashboard } from './pages/ClientDashboard';
import { ScanReceipt } from './pages/ScanReceipt';
import { MerchantDetailsPage } from './pages/MerchantDetailsPage';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { WalletPage } from './pages/WalletPage';
import { SocialCompleteProfilePage } from './pages/SocialCompleteProfilePage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { TermsOfUse } from './pages/TermsOfUse';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { CookiesPolicy } from './pages/CookiesPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { ContactPage } from './pages/ContactPage';
import { Link } from 'wouter';
import { 
  Store, Mail, Lock, ArrowLeft, 
  CheckCircle, Loader2, AlertCircle,
  ShieldCheck, Zap, MapPin, Search,
  ChevronRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './lib/firebase';

const StoresPage = () => (
  <div className="min-h-screen bg-surface font-body pb-20">
    {/* Header */}
    <div className="bg-surface-container-low border-b border-outline-variant/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Voltar ao início
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-6xl font-headline font-black text-on-surface">Lojas Parceiras</h1>
            <p className="text-on-surface-variant text-lg">Descubra onde ganhar cashback em todo o Maranhão.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou cidade..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border-2 border-outline-variant/10 focus:border-primary focus:ring-0 transition-all"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/5 shadow-xl shadow-primary/5 flex items-center gap-6 group hover:border-primary/20 transition-all"
          >
            <div className="w-20 h-20 bg-surface-container-high rounded-3xl flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Store size={40} />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-headline font-black text-on-surface text-lg">Loja Exemplo {i}</h3>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Zap size={14} fill="currentColor" />
                5% Cashback
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <MapPin size={10} />
                São Luís - MA
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State / Load More */}
      <div className="mt-20 text-center space-y-6">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-on-surface-variant/20">
          <Sparkles size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-headline font-bold text-on-surface">Mais lojas em breve!</h3>
          <p className="text-on-surface-variant">Estamos expandindo nossa rede para todo o estado.</p>
        </div>
        <button className="px-8 py-4 rounded-2xl bg-surface-container-high text-on-surface font-bold hover:bg-primary hover:text-white transition-all">
          Carregar mais lojas
        </button>
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ component: Component, role }: { component: React.FC, role?: string }) => {
  const { user, profile, loading, isProfileComplete } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border-4 border-primary/10 border-t-primary rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          <Zap size={32} fill="currentColor" />
        </div>
      </div>
      <p className="text-on-surface-variant font-bold animate-pulse uppercase tracking-widest text-xs">Carregando MaraCash...</p>
    </div>
  );

  if (!user) return <Redirect to="/login" />;
  
  if (!isProfileComplete && window.location.pathname !== '/complete-profile') {
    return <Redirect to="/complete-profile" />;
  }

  if (role && profile?.role !== role) return <Redirect to="/" />;

  return <Component />;
};

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface">
        <main>
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/stores" component={StoresPage} />
            <Route path="/complete-profile" component={SocialCompleteProfilePage} />
            
            {/* Protected Routes */}
            <Route path="/dashboard">
              <ProtectedRoute component={ClientDashboard} role="client" />
            </Route>
            <Route path="/scan">
              <ProtectedRoute component={ScanReceipt} role="client" />
            </Route>
            <Route path="/wallet">
              <ProtectedRoute component={WalletPage} role="client" />
            </Route>
            
            <Route path="/register/merchant-details">
              <ProtectedRoute component={MerchantDetailsPage} role="merchant" />
            </Route>
            <Route path="/merchant">
              <ProtectedRoute component={MerchantDashboard} role="merchant" />
            </Route>
            
            <Route path="/admin">
              <ProtectedRoute component={AdminDashboard} role="admin" />
            </Route>

            <Route path="/terms" component={TermsOfUse} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/cookies" component={CookiesPolicy} />
            <Route path="/refund" component={RefundPolicy} />
            <Route path="/contact" component={ContactPage} />
            
            <Route>
              <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 text-center">
                <div className="w-32 h-32 bg-error/10 text-error rounded-full flex items-center justify-center">
                  <AlertCircle size={64} />
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-headline font-black text-on-surface">404 - Página não encontrada</h1>
                  <p className="text-on-surface-variant">O link que você seguiu pode estar quebrado ou a página foi removida.</p>
                </div>
                <Link href="/">
                  <button className="premium-gradient text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20">
                    Voltar ao Início
                  </button>
                </Link>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </AuthProvider>
  );
}
