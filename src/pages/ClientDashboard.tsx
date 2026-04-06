import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, QrCode, History, Gift, Settings, LogOut, 
  ChevronRight, Bell, Star, TrendingUp, ArrowUpRight,
  User, LayoutDashboard, Store, HelpCircle
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

export const ClientDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [location] = useLocation();
  const [activities, setActivities] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!profile?.uid) return;

    const q = query(
      collection(db, 'cashbacks'),
      where('clientUid', '==', profile.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(docs);
    }, (error) => {
      console.error("Error fetching cashbacks:", error);
    });

    return () => unsubscribe();
  }, [profile?.uid]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Início', href: '/dashboard' },
    { icon: QrCode, label: 'Escanear Nota', href: '/scan' },
    { icon: Wallet, label: 'Minha Carteira', href: '/wallet' },
    { icon: Store, label: 'Lojas Parceiras', href: '/stores' },
    { icon: Gift, label: 'Recompensas', href: '/rewards' },
  ];

  const levels = {
    bronze: { color: 'text-[#CD7F32]', bg: 'bg-[#CD7F32]/10', next: 'Prata', goal: 100 },
    prata: { color: 'text-gray-400', bg: 'bg-gray-400/10', next: 'Ouro', goal: 500 },
    ouro: { color: 'text-accent-gold', bg: 'bg-accent-gold/10', next: 'Diamante', goal: 1000 },
  };

  const currentLevel = (profile?.level as keyof typeof levels) || 'bronze';
  const levelData = levels[currentLevel];
  const progress = Math.min(((profile?.totalCashback || 0) / levelData.goal) * 100, 100);

  return (
    <div className="flex min-h-screen bg-surface font-body">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sidebar-gradient transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 px-2">
            <span className="text-2xl font-headline font-black text-primary tracking-tight">
              Mara<span className="text-secondary">Cash</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-label font-bold transition-all ${location === item.href ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}>
                  <item.icon size={22} />
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>

          <div className="pt-6 mt-6 border-t border-outline-variant/10 space-y-2">
            <Link href="/profile">
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-label font-bold text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                <Settings size={22} />
                Configurações
              </button>
            </Link>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-label font-bold text-error hover:bg-error/5 transition-all"
            >
              <LogOut size={22} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface">Olá, {profile?.displayName?.split(' ')[0] || 'Viajante'}</h1>
            <p className="text-on-surface-variant">Bem-vindo de volta ao seu tesouro.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant relative">
              <Bell size={24} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-error rounded-full border-2 border-surface-container-high"></span>
            </button>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/10">
              <img 
                src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&background=006a3e&color=fff`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Wallet Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="premium-gradient rounded-[2.5rem] p-8 text-white relative overflow-hidden editorial-shadow">
              <div className="relative z-10 flex justify-between items-start mb-12">
                <div>
                  <p className="font-label text-primary-fixed/60 uppercase text-xs font-bold tracking-widest mb-2">Saldo Disponível</p>
                  <h2 className="text-5xl font-headline font-black tracking-tighter">R$ {(profile?.availableCashback || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                  <Wallet size={32} />
                </div>
              </div>
              <div className="relative z-10 flex gap-4">
                <Link href="/scan" className="flex-1">
                  <button className="w-full bg-white text-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <QrCode size={20} />
                    Escanear Nota
                  </button>
                </Link>
                <Link href="/wallet" className="flex-1">
                  <button className="w-full bg-primary-container text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <ArrowUpRight size={20} />
                    Resgatar PIX
                  </button>
                </Link>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Star size={120} strokeWidth={1} />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="card-premium p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <TrendingUp size={24} />
                </div>
                <p className="text-on-surface-variant text-sm font-bold mb-1">Economia Total</p>
                <h4 className="text-2xl font-headline font-black text-on-surface">R$ {(profile?.totalCashback || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
              </div>
              <div className="card-premium p-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/10 text-secondary flex items-center justify-center mb-4">
                  <Star size={24} />
                </div>
                <p className="text-on-surface-variant text-sm font-bold mb-1">Nível Atual</p>
                <h4 className="text-2xl font-headline font-black text-on-surface">{profile?.level || 'Bronze'}</h4>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-premium p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-bold">Atividade Recente</h3>
                <Link href="/wallet" className="text-primary font-bold text-sm flex items-center gap-1">
                  Ver tudo <ChevronRight size={16} />
                </Link>
              </div>
              <div className="space-y-6">
                {activities.length > 0 ? activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.type === 'cashback' ? 'bg-primary/10 text-primary' : 'bg-secondary-container/10 text-secondary'}`}>
                        {activity.type === 'cashback' ? <QrCode size={20} /> : <Wallet size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{activity.description || 'Cashback Recebido'}</p>
                        <p className="text-xs text-on-surface-variant">{activity.createdAt?.toDate ? activity.createdAt.toDate().toLocaleDateString('pt-BR') : new Date(activity.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <p className={`font-headline font-black ${activity.type === 'cashback' ? 'text-primary' : 'text-error'}`}>
                      {activity.type === 'cashback' ? '+' : '-'} R$ {activity.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <p className="text-on-surface-variant">Nenhuma atividade encontrada.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Level Progress */}
            <div className="card-premium p-8 bg-surface-container-low border-none">
              <h3 className="text-lg font-headline font-bold mb-6">Progresso de Nível</h3>
              <div className="flex justify-between items-end mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black mx-auto mb-2 shadow-lg shadow-primary/20">B</div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter">Bronze</p>
                </div>
                <div className="flex-1 h-1 bg-outline-variant/20 mb-8 mx-2 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-center opacity-40">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center font-black mx-auto mb-2">P</div>
                  <p className="text-[10px] font-bold uppercase tracking-tighter">Prata</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant text-center">Faltam <strong>R$ {(levelData.goal - (profile?.totalCashback || 0)).toFixed(2)}</strong> para o nível {levelData.next}</p>
            </div>

            {/* Referral Card */}
            <div className="rounded-[2rem] bg-secondary-container p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-headline font-black text-on-secondary-container mb-4">Indique e Ganhe</h3>
                <p className="text-on-secondary-container/80 text-sm mb-6">Ganhe R$ 5,00 por cada amigo que escanear a primeira nota.</p>
                <button className="w-full bg-on-secondary-container text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all">
                  Copiar Link de Indicação
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Gift size={120} />
              </div>
            </div>

            {/* Help Center */}
            <div className="card-premium p-8">
              <h3 className="text-lg font-headline font-bold mb-4">Precisa de ajuda?</h3>
              <p className="text-sm text-on-surface-variant mb-6">Nossa equipe de suporte está pronta para te ajudar com qualquer dúvida.</p>
              <button className="w-full border-2 border-outline-variant/20 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
                <HelpCircle size={18} />
                Central de Ajuda
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
