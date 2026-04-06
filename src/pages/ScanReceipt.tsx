import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, Keyboard, ArrowLeft, Camera, 
  CheckCircle, AlertCircle, Loader2, Info,
  ShieldCheck, Zap, Sparkles, History, Plus
} from 'lucide-react';

export const ScanReceipt: React.FC = () => {
  const { profile } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'scan' | 'manual' | 'success' | 'error'>('scan');
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (mode === 'scan') {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      );

      scanner.render((decodedText) => {
        const keyMatch = decodedText.match(/\d{44}/);
        if (keyMatch) {
          scanner.clear();
          handleProcessKey(keyMatch[0]);
        }
      }, (error) => {
        // console.warn(error);
      });

      return () => {
        scanner.clear().catch(err => console.error("Failed to clear scanner", err));
      };
    }
  }, [mode]);

  const handleProcessKey = async (key: string) => {
    if (key.length !== 44) {
      setErrorMessage('A chave deve ter exatamente 44 dígitos.');
      setMode('error');
      return;
    }

    // RN-01: MA = 21
    if (!key.startsWith('21')) {
      setErrorMessage('Esta nota não pertence ao Maranhão (Código 21).');
      setMode('error');
      return;
    }

    setLoading(true);
    try {
      // RN-03: Unique Key
      const q = query(collection(db, 'invoices'), where('accessKey', '==', key));
      const existing = await getDocs(q);
      if (!existing.empty) {
        setErrorMessage('Esta nota fiscal já foi cadastrada anteriormente.');
        setMode('error');
        return;
      }

      // RN-04: CNPJ Check
      const cnpj = key.substring(6, 20);
      const storeQ = query(collection(db, 'stores'), where('cnpj', '==', cnpj));
      const storeSnap = await getDocs(storeQ);
      
      if (storeSnap.empty) {
        setErrorMessage('Esta loja ainda não é parceira do MaraCash.');
        setMode('error');
        return;
      }

      const storeData = storeSnap.docs[0].data();
      const storeId = storeSnap.docs[0].id;

      // Simulated value extraction (In a real app, this would call a SEFAZ API)
      const simulatedValue = Math.random() * 500 + 10;
      const cashbackPct = storeData.cashbackPct || 5;
      const cashbackAmount = simulatedValue * (cashbackPct / 100);
      
      await addDoc(collection(db, 'invoices'), {
        accessKey: key,
        value: simulatedValue,
        clientUid: profile?.uid,
        clientName: profile?.displayName,
        clientCpf: profile?.cpf,
        storeId: storeId,
        storeName: storeData.name,
        status: 'pending',
        cashbackPct: cashbackPct,
        amount: cashbackAmount,
        submissionDate: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });

      setMode('success');
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao processar nota. Tente novamente.');
      setMode('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body pb-20">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-2xl mx-auto">
        <button 
          onClick={() => setLocation('/dashboard')}
          className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-headline font-black text-on-surface">Cadastrar Nota</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {mode === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Camera size={32} />
                </div>
                <h2 className="text-2xl font-headline font-black text-on-surface">Escanear QR Code</h2>
                <p className="text-on-surface-variant">Aponte a câmera para o código na sua nota fiscal.</p>
              </div>

              <div className="relative aspect-square max-w-sm mx-auto rounded-[2.5rem] overflow-hidden border-4 border-primary/10 bg-surface-container-low shadow-2xl">
                <div id="reader" className="w-full h-full"></div>
                {/* Scanner Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20">
                  <div className="w-full h-full border-2 border-primary/50 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_15px_rgba(0,106,62,0.8)]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setMode('manual')}
                  className="w-full py-5 rounded-2xl bg-surface-container-high text-on-surface font-bold flex items-center justify-center gap-3 hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                >
                  <Keyboard size={22} />
                  Digitar chave manualmente
                </button>
                
                <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/10 text-secondary flex items-center justify-center shrink-0">
                    <Info size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-on-surface">Dica Importante</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      A nota deve ser do estado do Maranhão e emitida nos últimos 5 dias.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {mode === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Keyboard size={32} />
                </div>
                <h2 className="text-2xl font-headline font-black text-on-surface">Digitar Chave</h2>
                <p className="text-on-surface-variant">Insira os 44 dígitos da chave de acesso.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Chave de Acesso</label>
                  <textarea 
                    rows={3}
                    placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value.replace(/\D/g, '').substring(0, 44))}
                    className="w-full p-6 rounded-3xl bg-surface-container-low border-2 border-outline-variant/20 focus:border-primary focus:ring-0 transition-all font-mono text-lg text-center tracking-wider placeholder:opacity-20 resize-none"
                  />
                  <div className="flex justify-end px-2">
                    <span className={`text-[10px] font-bold ${accessKey.length === 44 ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {accessKey.length}/44 dígitos
                    </span>
                  </div>
                </div>

                <button 
                  disabled={accessKey.length !== 44 || loading}
                  onClick={() => handleProcessKey(accessKey)}
                  className="w-full premium-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={22} />
                      Validar Nota Fiscal
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setMode('scan')}
                  className="w-full py-4 text-on-surface-variant font-bold flex items-center justify-center gap-2 hover:text-primary transition-all"
                >
                  <Camera size={20} />
                  Voltar para o Scanner
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'success' && (
            <motion.div
              key="success"
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
                  <CheckCircle size={64} />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 rounded-full -z-10"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-black text-on-surface">Nota Enviada!</h2>
                <p className="text-on-surface-variant max-w-xs mx-auto">
                  Sua nota foi cadastrada com sucesso e está em processamento.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-surface-container-low border border-primary/20 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Cashback Estimado</span>
                  <span className="font-headline font-black text-primary text-lg">R$ 12,50</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/5 p-3 rounded-xl">
                  <Zap size={14} />
                  O SALDO SERÁ LIBERADO APÓS APROVAÇÃO DA LOJA
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setLocation('/dashboard')}
                  className="w-full premium-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Ir para o Painel
                </button>
                <button 
                  onClick={() => { setAccessKey(''); setMode('scan'); }}
                  className="w-full py-4 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 rounded-2xl transition-all"
                >
                  <Plus size={20} />
                  Cadastrar Outra Nota
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-10"
            >
              <div className="w-32 h-32 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={64} />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-black text-on-surface">Ops! Algo deu errado</h2>
                <p className="text-on-surface-variant max-w-xs mx-auto">
                  {errorMessage || 'Não foi possível processar sua nota fiscal no momento.'}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setMode('scan')}
                  className="w-full bg-on-surface text-surface py-5 rounded-2xl font-bold text-lg active:scale-95 transition-all"
                >
                  Tentar Novamente
                </button>
                <button 
                  onClick={() => setLocation('/dashboard')}
                  className="w-full py-4 text-on-surface-variant font-bold hover:text-on-surface transition-all"
                >
                  Voltar ao Início
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Section */}
      <div className="max-w-2xl mx-auto px-6 mt-10">
        <div className="p-8 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 space-y-6">
          <h3 className="text-lg font-headline font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-secondary" />
            Como funciona?
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">1</div>
              <p className="text-sm text-on-surface-variant">Escaneie o QR Code ou digite a chave de 44 dígitos da sua NFC-e.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">2</div>
              <p className="text-sm text-on-surface-variant">Nossa equipe valida a nota junto à loja parceira.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">3</div>
              <p className="text-sm text-on-surface-variant">O cashback é liberado no seu saldo para uso futuro.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
