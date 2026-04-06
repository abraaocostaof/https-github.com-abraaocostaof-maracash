import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Store, Users, Settings, LogOut, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Search, 
  Filter, MoreVertical, CheckCircle, XCircle, Clock,
  Database, Mail, ShieldCheck, Download, ExternalLink,
  Plus, Trash2, Edit3, AlertCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDocs, getDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { seedDatabase } from '../lib/seed';

export const AdminDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'stores' | 'clients'>('stats');
  const [pendingStores, setPendingStores] = useState<any[]>([]);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, stores: 0, invoices: 0, cashback: 0 });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch pending stores
    const qPending = query(collection(db, 'stores'), where('status', '==', 'pending'));
    const unsubscribePending = onSnapshot(qPending, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingStores(docs);
    });

    // Fetch all stores
    const unsubscribeStores = onSnapshot(collection(db, 'stores'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllStores(docs);
    });

    // Fetch all clients
    const qClients = query(collection(db, 'users'), where('role', '==', 'client'));
    const unsubscribeClients = onSnapshot(qClients, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllClients(docs);
    });

    // Fetch stats
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const storesSnap = await getDocs(collection(db, 'stores'));
      const invoicesSnap = await getDocs(collection(db, 'invoices'));
      
      setStats({
        users: usersSnap.size,
        stores: storesSnap.size,
        invoices: invoicesSnap.size,
        cashback: 12500, // Simulated
      });
      setLoading(false);
    };
    fetchStats();

    return () => {
      unsubscribePending();
      unsubscribeStores();
      unsubscribeClients();
    };
  }, []);

  const handleApproveStore = async (store: any) => {
    try {
      await updateDoc(doc(db, 'stores', store.id), { 
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'users', store.ownerUid), { 
        status: 'active',
        updatedAt: serverTimestamp()
      });
      alert('Loja aprovada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao aprovar loja.');
    }
  };

  const handleRejectStore = async (storeId: string) => {
    const reason = prompt('Motivo da rejeição:');
    if (!reason) return;
    try {
      await updateDoc(doc(db, 'stores', storeId), { 
        status: 'rejected', 
        rejectionReason: reason,
        rejectedAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeed = async () => {
    if (!confirm('Deseja popular o banco de dados com dados de teste?')) return;
    setSeeding(true);
    try {
      await seedDatabase();
      alert('Banco de dados populado com sucesso!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao popular banco de dados.');
    } finally {
      setSeeding(false);
    }
  };

  const navItems = [
    { id: 'stats', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'stores', icon: Store, label: 'Lojas' },
  ];

  return (
    <div className="flex min-h-screen bg-surface font-body">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 sidebar-gradient transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 px-2">
            <span className="text-2xl font-headline font-black text-primary tracking-tight">
              Mara<span className="text-secondary">Cash</span>
            </span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-1">Admin Master</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-label font-bold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'}`}
              >
                <item.icon size={22} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 mt-6 border-t border-outline-variant/10 space-y-4">
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-label font-bold text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              <Database size={22} />
              {seeding ? 'Populando...' : 'Popular Banco'}
            </button>
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-label font-bold text-error hover:bg-error/5 transition-all"
            >
              <LogOut size={22} />
              Sair do Admin
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface">
              {activeTab === 'stats' ? 'Visão Geral' : activeTab === 'clients' ? 'Gerenciar Clientes' : 'Gerenciar Lojas'}
            </h1>
            <p className="text-on-surface-variant">Controle total da plataforma MaraCash.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-on-surface-variant font-bold text-sm">
              <ShieldCheck size={18} className="text-primary" />
              Modo Administrador
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              AD
            </div>
          </div>
        </header>

        {activeTab === 'stats' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-premium p-6 bg-primary text-white border-none shadow-xl shadow-primary/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-primary-fixed/60 text-xs font-bold uppercase tracking-widest mb-1">Volume Total</p>
                <h4 className="text-2xl font-headline font-black">R$ 124.500</h4>
              </div>
              <div className="card-premium p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/10 text-secondary flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-secondary-container/20 text-secondary px-2 py-1 rounded-full">+8%</span>
                </div>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Total Usuários</p>
                <h4 className="text-2xl font-headline font-black text-on-surface">{stats.users}</h4>
              </div>
              <div className="card-premium p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Store size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-1 rounded-full">+5</span>
                </div>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Lojas Parceiras</p>
                <h4 className="text-2xl font-headline font-black text-on-surface">{stats.stores}</h4>
              </div>
              <div className="card-premium p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                    <AlertCircle size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-error/20 text-error px-2 py-1 rounded-full">{pendingStores.length}</span>
                </div>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Lojas Pendentes</p>
                <h4 className="text-2xl font-headline font-black text-on-surface">{pendingStores.length}</h4>
              </div>
            </div>

            {/* Pending Stores Section */}
            <div className="card-premium p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-bold">Aprovações Pendentes</h3>
                <Link href="/admin/stores">
                  <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                    Ver todas <ArrowUpRight size={16} />
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingStores.length > 0 ? pendingStores.map((store) => (
                  <div key={store.id} className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-xl">
                        {store.name?.substring(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{store.name}</h4>
                        <p className="text-xs text-on-surface-variant">CNPJ: {store.cnpj}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApproveStore(store)}
                        className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                      >
                        Aprovar
                      </button>
                      <button 
                        onClick={() => handleRejectStore(store.id)}
                        className="px-4 bg-error/10 text-error py-3 rounded-xl font-bold text-sm hover:bg-error hover:text-white transition-all"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/20">
                    <p className="text-on-surface-variant font-medium">Nenhuma loja aguardando aprovação.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="card-premium p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h3 className="text-xl font-headline font-bold">Lista de Clientes</h3>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar cliente..." 
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
                <button className="p-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-outline-variant/10">
                    <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Cliente</th>
                    <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">CPF</th>
                    <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Saldo</th>
                    <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Total Ganho</th>
                    <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {allClients.map((client) => (
                    <tr key={client.id} className="group hover:bg-surface-container-low transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-sm">
                            {client.displayName?.substring(0, 1)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface">{client.displayName}</span>
                            <span className="text-[10px] text-on-surface-variant">{client.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-on-surface-variant">{client.cpf || 'N/A'}</td>
                      <td className="py-4 font-bold text-primary">R$ {client.availableCashback?.toFixed(2) || '0,00'}</td>
                      <td className="py-4 font-bold text-on-surface">R$ {client.totalCashback?.toFixed(2) || '0,00'}</td>
                      <td className="py-4 text-right">
                        <button className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="card-premium p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h3 className="text-xl font-headline font-bold">Lojas Parceiras</h3>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all">
                  <Plus size={18} /> Nova Loja
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allStores.map((store) => (
                <div key={store.id} className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-xl overflow-hidden">
                        {store.logoURL ? (
                          <img src={store.logoURL} alt={store.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : store.name?.substring(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{store.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${store.status === 'approved' ? 'bg-primary' : 'bg-warning'}`}></span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {store.status === 'approved' ? 'Ativa' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 rounded-lg hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-error/5 text-on-surface-variant hover:text-error transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Cashback</p>
                      <p className="font-headline font-black text-primary">{store.cashbackPct}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">CNPJ</p>
                      <p className="text-xs font-bold text-on-surface">{store.cnpj}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
