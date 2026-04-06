import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Link, useLocation } from 'wouter';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin, isMerchant, isClient } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    setLocation('/');
  };

  return (
    <nav className="bg-white border-b border-gray-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-primary-dark tracking-tight">
                Mara<span className="text-accent-gold">Cash</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isClient && (
                  <>
                    <Link href="/dashboard" className="text-gray-dark hover:text-primary-medium px-3 py-2 text-sm font-medium flex items-center space-x-1">
                      <i className="ri-home-4-line"></i>
                      <span>Início</span>
                    </Link>
                    <Link href="/wallet" className="text-gray-dark hover:text-primary-medium px-3 py-2 text-sm font-medium flex items-center space-x-1">
                      <i className="ri-wallet-3-line"></i>
                      <span>Carteira</span>
                    </Link>
                    <Link href="/scan" className="bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-primary-medium transition-colors">
                      <i className="ri-qr-code-line"></i>
                      <span>Escanear Nota</span>
                    </Link>
                  </>
                )}
                {isMerchant && (
                  <>
                    <Link href="/merchant" className="text-gray-dark hover:text-primary-medium px-3 py-2 text-sm font-medium flex items-center space-x-1">
                      <i className="ri-store-2-line"></i>
                      <span>Painel Lojista</span>
                    </Link>
                    <Link href="/merchant/validate" className="text-gray-dark hover:text-primary-medium px-3 py-2 text-sm font-medium flex items-center space-x-1">
                      <i className="ri-checkbox-circle-line"></i>
                      <span>Validar Notas</span>
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link href="/admin" className="text-gray-dark hover:text-primary-medium px-3 py-2 text-sm font-medium flex items-center space-x-1">
                    <i className="ri-settings-3-line"></i>
                    <span>Admin Master</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-3 ml-4 border-l pl-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-dark">{profile?.displayName}</span>
                    <span className="text-[10px] text-gray-400 capitalize">{profile?.role}</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-error transition-colors">
                    <i className="ri-logout-box-r-line text-xl"></i>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-dark hover:text-primary-medium px-3 py-2 text-sm font-medium">Entrar</Link>
                <Link href="/register" className="bg-primary-dark text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-medium transition-colors">
                  Criar Conta Grátis
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-dark hover:text-primary-medium focus:outline-none"
            >
              <i className={isOpen ? "ri-close-line text-2xl" : "ri-menu-line text-2xl"}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-light pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-dark hover:bg-gray-light">Início</Link>
                <Link href="/wallet" className="block px-3 py-2 rounded-md text-base font-medium text-gray-dark hover:bg-gray-light">Carteira</Link>
                <Link href="/scan" className="block px-3 py-2 rounded-md text-base font-medium text-primary-dark hover:bg-gray-light">Escanear Nota</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-gray-light">Sair</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-dark hover:bg-gray-light">Entrar</Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary-dark hover:bg-gray-light">Criar Conta</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
