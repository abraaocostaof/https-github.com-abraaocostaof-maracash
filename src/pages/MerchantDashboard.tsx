import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, QrCode, History, Settings, LogOut, 
  ChevronRight, Bell, Star, TrendingUp, ArrowUpRight,
  User, LayoutDashboard, CheckCircle, XCircle, Clock,
  Search, Filter, MoreVertical, Download, HelpCircle
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, getDoc, increment } from 'firebase/firestore';

export const MerchantDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [location] = useLocation();
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState({ type: '', text: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!profile?.storeId) return;

    const q = query(
      collection(db, 'invoices'),
      where('storeId', '==', profile.storeId),
      where('status', '==', 'pending'),
      orderBy('submissionDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingInvoices(docs);
    });

    return () => unsubscribe();
  }, [profile?.storeId]);

  const handleApprove = async (invoice: any) => {
    try {
      await updateDoc(doc(db, 'invoices', invoice.id), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });

      const cashbackAmount = invoice.value * (invoice.cashbackPct / 100);
      const localAmount = cashbackAmount * 0.8;

      await updateDoc(doc(db, 'users', invoice.clientUid), {
        availableCashback: increment(localAmount),
        totalCashback: increment(cashbackAmount)
      });

      // Add activity for client
      await addDoc(collection(db, 'activities'), {
        userId: invoice.clientUid,
        type: 'cashback',
        amount: localAmount,
        description: `Cashback aprovado: ${profile?.storeName}`,
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error("Error approving invoice:", error);
    }
  };

  const handleReject = async (invoiceId: string) => {
    const reason = prompt('Motivo da rejeição:');
    if (!reason) return;

    try {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error rejecting invoice:", error);
    }
  };

  const handleValidateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setOtpLoading(true);
    setOtpMessage({ type: '', text: '' });

    try {
      const q = query(
        collection(db, 'otps'),
        where('code', '==', otp),
        where('used', '==', false)
      );

      const snapshot = await onSnapshot(q, (snap) => {
        if (snap.empty) {
          setOtpMessage({ type: 'error', text: 'Código inválido ou já utilizado.' });
          setOtpLoading(false);
          return;
        }

        const otpDoc = snap.docs[0];
        const otpData = otpDoc.data();

        if (new Date(otpData.expiresAt) < new Date()) {
          setOtpMessage({ type: 'error', text: 'Código expirado.' });
          setOtpLoading(false);
          return;
        }

        updateDoc(doc(db, 'otps', otpDoc.id), { used: true }).then(() => {
          updateDoc(doc(db, 'users', otpData.clientUid), {
            availableCashback: increment(-otpData.amount)
          }).then(() => {
            setOtpMessage({ type: 'success', text: `Resgate de R$ ${otpData.amount.toFixed(2)} validado com sucesso!` });
            setOtp('');
            setOtpLoading(false);
          });
        });
      });

    } catch (error) {
      console.error("Error validating OTP:", error);
      setOtpMessage({ type: 'error', text: 'Erro ao validar código. Tente novamente.' });
      setOtpLoading(false);
    }
  };

  if (profile?.status === 'pending') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface p-4 font-body">
        <div className="card-premium p-12 max-w-md text-center bg-surface-container-low">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Clock size={40} />
          </div>
          <h1 className="text-3xl font-headline font-black text-on-surface mb-4">Cadastro em Análise</h1>
          <p className="text-on-surface-variant mb-8">
            Sua loja está sendo revisada por nossa equipe. Você receberá um e-mail assim que for aprovado.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full premium-gradient text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20"
          >
            Atualizar Status
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Painel', href: '/merchant/dashboard' },
    { icon: Clock, label: 'Notas Pendentes', href: '/merchant/pending' },
    { icon: History, label: 'Histórico', href: '/merchant/history' },
    { icon: Settings, label: 'Configurações', href: '/merchant/settings' },
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-1">Lojista Parceiro</p>
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

          <div className="pt-6 mt-6 border-t border-outline-variant/10">
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-label font-bold text-error hover:bg-error/5 transition-all"
            >
              <LogOut size={22} />
              Sair da Loja
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-on-surface">{profile?.storeName || 'Minha Loja'}</h1>
            <p className="text-on-surface-variant">Gerencie suas recompensas e fidelize seus clientes.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl text-on-surface-variant font-bold text-sm">
              <Clock size={18} />
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/10">
              <img 
                src={profile?.logoURL || `https://ui-avatars.com/api/?name=${profile?.storeName || 'Store'}&background=006a3e&color=fff`} 
                alt="Store Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats and OTP Validation */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-premium p-6 bg-primary text-white border-none shadow-xl shadow-primary/20">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <TrendingUp size={20} />
                </div>
                <p className="text-primary-fixed/60 text-xs font-bold uppercase tracking-widest mb-1">Vendas com Cashback</p>
                <h4 className="text-2xl font-headline font-black">R$ 12.450,00</h4>
              </div>
              <div className="card-premium p-6">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/10 text-secondary flex items-center justify-center mb-4">
                  <User size={20} />
                </div>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Clientes Ativos</p>
                <h4 className="text-2xl font-headline font-black text-on-surface">142</h4>
              </div>
              <div className="card-premium p-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Star size={20} />
                </div>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Avaliação Média</p>
                <h4 className="text-2xl font-headline font-black text-on-surface">4.9</h4>
              </div>
            </div>

            {/* OTP Validation Card */}
            <div className="card-premium p-8 bg-surface-container-low border-none">
              <div className="max-w-md mx-auto text-center">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <QrCode size={32} />
                </div>
                <h3 className="text-2xl font-headline font-black text-on-surface mb-2">Validar Resgate</h3>
                <p className="text-on-surface-variant mb-8">Insira o código de 6 dígitos gerado pelo cliente para confirmar o resgate em loja.</p>
                
                <form onSubmit={handleValidateOtp} className="space-y-6">
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                    placeholder="000000"
                    className="w-full text-center text-4xl font-headline font-black tracking-[0.5em] py-6 rounded-3xl bg-surface-container-lowest border-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all placeholder:opacity-20"
                  />
                  <button 
                    disabled={otp.length !== 6 || otpLoading}
                    className="w-full premium-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                  >
                    {otpLoading ? 'Validando...' : 'Confirmar Resgate'}
                  </button>
                </form>

                <AnimatePresence>
                  {otpMessage.text && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-6 p-4 rounded-2xl font-bold text-sm ${otpMessage.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}
                    >
                      {otpMessage.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Pending Invoices Table */}
            <div className="card-premium p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-headline font-bold">Notas Pendentes ({pendingInvoices.length})</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                    <Filter size={20} />
                  </button>
                  <button className="p-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                    <Search size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-outline-variant/10">
                      <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Chave / Cliente</th>
                      <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Data</th>
                      <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Valor Nota</th>
                      <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Cashback</th>
                      <th className="pb-4 font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {pendingInvoices.length > 0 ? pendingInvoices.map((invoice) => (
                      <tr key={invoice.id} className="group hover:bg-surface-container-low transition-colors">
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-on-surface-variant">{invoice.accessKey?.substring(0, 20)}...</span>
                            <span className="font-bold text-on-surface">{invoice.clientName || 'Cliente'}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-on-surface-variant">
                          {invoice.submissionDate ? new Date(invoice.submissionDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="py-4 font-bold text-on-surface">R$ {invoice.value?.toFixed(2)}</td>
                        <td className="py-4 font-headline font-black text-primary">R$ {(invoice.value * (invoice.cashbackPct / 100)).toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleApprove(invoice)}
                              className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button 
                              onClick={() => handleReject(invoice.id)}
                              className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                          Nenhuma nota pendente de aprovação.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Store Health */}
            <div className="card-premium p-8 bg-surface-container-low border-none">
              <h3 className="text-lg font-headline font-bold mb-6">Saúde da Loja</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-on-surface-variant">Fidelização</span>
                    <span className="text-primary">85%</span>
                  </div>
                  <div className="h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-on-surface-variant">Novos Clientes</span>
                    <span className="text-secondary">+12%</span>
                  </div>
                  <div className="h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-container w-[65%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-premium p-8">
              <h3 className="text-lg font-headline font-bold mb-6">Ações Rápidas</h3>
              <div className="grid grid-cols-1 gap-4">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-container-high hover:bg-primary/5 hover:text-primary transition-all group">
                  <div className="flex items-center gap-3">
                    <Download size={20} className="text-on-surface-variant group-hover:text-primary" />
                    <span className="font-bold text-sm">Relatório Mensal</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface-container-high hover:bg-primary/5 hover:text-primary transition-all group">
                  <div className="flex items-center gap-3">
                    <Star size={20} className="text-on-surface-variant group-hover:text-primary" />
                    <span className="font-bold text-sm">Criar Promoção</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="rounded-[2rem] bg-primary p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-headline font-black mb-4">Suporte Lojista</h3>
                <p className="text-primary-fixed/80 text-sm mb-6">Dúvidas sobre integração ou pagamentos? Fale com nosso gerente de contas.</p>
                <button className="w-full bg-white text-primary py-3 rounded-xl font-bold text-sm active:scale-95 transition-all">
                  Abrir Chamado
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <HelpCircle size={120} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
