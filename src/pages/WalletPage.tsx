import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, increment, getDocs, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, QrCode, ArrowLeft, CheckCircle, 
  Clock, AlertCircle, ShieldCheck, Zap,
  TrendingUp, History, ArrowUpRight, ArrowDownLeft,
  Info, Sparkles, CreditCard, DollarSign,
  ChevronRight, Plus, Loader2
} from 'lucide-react';
import { useLocation } from 'wouter';

export const WalletPage: React.FC = () => {
  const { profile } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'view' | 'redeem' | 'success'>('view');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [otp, setOtp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.uid) return;

    const q = query(
      collection(db, 'invoices'),
      where('clientUid', '==', profile.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(docs.sort((a: any, b: any) => 
        new Date(b.createdAt?.toDate?.() || b.createdAt).getTime() - 
        new Date(a.createdAt?.toDate?.() || a.createdAt).getTime()
      ));
    });

    return () => unsubscribe();
  }, [profile?.uid]);

  const handleGenerateOTP = async () => {
    const amount = parseFloat(redeemAmount);
    if (isNaN(amount) || amount <= 0 || amount > (profile?.availableCashback || 0)) {
      alert('Valor inválido ou saldo insuficiente.');
      return;
    }

    setLoading(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

      const otpDoc = await addDoc(collection(db, 'otps'), {
        clientUid: profile?.uid,
        code,
        amount,
        expiresAt,
        used: false,
        createdAt: serverTimestamp(),
      });

      setOtp({ id: otpDoc.id, code, amount, expiresAt });
      setMode('redeem');
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body pb-24">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-2xl mx-auto">
        <button 
          onClick={() => setLocation('/dashboard')}
          className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-headline font-black text-on-surface">Minha Carteira</h1>
        <button className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
          <History size={24} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {mode === 'view' && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Main Balance Card */}
              <div className="premium-gradient p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden text-white">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white/70 uppercase tracking-widest">Saldo Disponível</p>
                      <h2 className="text-5xl font-headline font-black">
                        R$ {profile?.availableCashback?.toFixed(2) || '0,00'}
                      </h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Wallet size={28} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Total Acumulado</p>
                      <p className="text-lg font-headline font-black">R$ {profile?.totalCashback?.toFixed(2) || '0,00'}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Nível Atual</p>
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-secondary" />
                        <p className="text-lg font-headline font-black capitalize">{profile?.level || 'Bronze'}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setMode('redeem')}
                    className="w-full bg-white text-primary py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Zap size={22} fill="currentColor" />
                    Resgatar Cashback
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/10 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <TrendingUp size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Rendimento</p>
                  <p className="text-sm font-black text-on-surface">+12%</p>
                </div>
                <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/10 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
                    <History size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Notas</p>
                  <p className="text-sm font-black text-on-surface">{transactions.length}</p>
                </div>
                <div className="p-4 rounded-3xl bg-surface-container-low border border-outline-variant/10 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mx-auto">
                    <CreditCard size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Resgates</p>
                  <p className="text-sm font-black text-on-surface">0</p>
                </div>
              </div>

              {/* Rules Section */}
              <div className="p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 space-y-6">
                <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-on-surface">
                  <Info size={20} className="text-primary" />
                  Regras de Resgate
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      <CheckCircle size={16} />
                    </div>
                    <p className="text-sm text-on-surface-variant">O cashback local só pode ser usado na mesma loja que o gerou.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      <CheckCircle size={16} />
                    </div>
                    <p className="text-sm text-on-surface-variant">O código gerado expira em 5 minutos por segurança.</p>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-lg font-headline font-black text-on-surface">Atividades Recentes</h3>
                  <button className="text-xs font-bold text-primary hover:underline">Ver Tudo</button>
                </div>
                
                <div className="space-y-3">
                  {transactions.length > 0 ? transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/5 flex items-center justify-between group hover:bg-surface-container-high transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.status === 'approved' ? 'bg-primary/10 text-primary' : 'bg-on-surface-variant/10 text-on-surface-variant'}`}>
                          {tx.status === 'approved' ? <ArrowDownLeft size={24} /> : <Clock size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{tx.storeName}</h4>
                          <p className="text-xs text-on-surface-variant">
                            {new Date(tx.createdAt?.toDate?.() || tx.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-headline font-black ${tx.status === 'approved' ? 'text-primary' : 'text-on-surface-variant'}`}>
                          + R$ {tx.amount?.toFixed(2) || '0,00'}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{tx.status === 'approved' ? 'Confirmado' : 'Pendente'}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-on-surface-variant/30">
                        <History size={32} />
                      </div>
                      <p className="text-on-surface-variant font-medium">Nenhuma atividade encontrada.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'redeem' && !otp && (
            <motion.div
              key="redeem-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={32} />
                </div>
                <h2 className="text-2xl font-headline font-black text-on-surface">Resgatar Cashback</h2>
                <p className="text-on-surface-variant">Quanto você deseja usar nesta compra?</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Valor do Resgate</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-headline font-black text-on-surface-variant">R$</span>
                    <input 
                      type="number" 
                      placeholder="0,00"
                      value={redeemAmount}
                      onChange={(e) => setRedeemAmount(e.target.value)}
                      className="w-full pl-16 pr-6 py-8 rounded-[2.5rem] bg-surface-container-low border-2 border-outline-variant/10 focus:border-primary focus:ring-0 transition-all font-headline font-black text-4xl text-center placeholder:opacity-10"
                    />
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-bold flex items-center gap-2">
                      <Wallet size={14} />
                      Saldo disponível: R$ {profile?.availableCashback?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 50].map(val => (
                    <button 
                      key={val}
                      onClick={() => setRedeemAmount(val.toString())}
                      className="py-4 rounded-2xl bg-surface-container-high text-on-surface font-bold hover:bg-primary hover:text-white transition-all active:scale-95"
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={loading || !redeemAmount || parseFloat(redeemAmount) <= 0 || parseFloat(redeemAmount) > (profile?.availableCashback || 0)}
                  onClick={handleGenerateOTP}
                  className="w-full premium-gradient text-white py-6 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      <ShieldCheck size={24} />
                      Gerar Código de Resgate
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setMode('view')}
                  className="w-full py-4 text-on-surface-variant font-bold hover:text-on-surface transition-all"
                >
                  Cancelar resgate
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'redeem' && otp && (
            <motion.div
              key="otp-display"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-10"
            >
              <div className="relative w-32 h-32 mx-auto">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-full h-full bg-primary/10 text-primary rounded-full flex items-center justify-center"
                >
                  <ShieldCheck size={64} />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 rounded-full -z-10"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-black text-on-surface">Código Gerado!</h2>
                <p className="text-on-surface-variant max-w-xs mx-auto">
                  Informe este código ao lojista para validar o desconto de <span className="font-bold text-primary">R$ {otp.amount.toFixed(2)}</span>
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 premium-gradient rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-surface-container-low p-10 rounded-[2.5rem] border border-outline-variant/10">
                  <p className="text-6xl font-headline font-black tracking-[0.4em] text-primary ml-4">
                    {otp.code}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-warning/10 text-warning font-bold text-sm mx-auto w-fit">
                <Clock size={18} className="animate-pulse" />
                Expira em 05:00
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setMode('view')}
                  className="w-full premium-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Concluído
                </button>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  O VALOR SERÁ DESCONTADO APÓS A VALIDAÇÃO DO LOJISTA
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
