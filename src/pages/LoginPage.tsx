import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, ArrowRight, Chrome, 
  AlertCircle, Loader2, CheckCircle,
  ChevronLeft, Sparkles, ShieldCheck
} from 'lucide-react';
import { Logo } from '../components/Logo';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onEmailLogin = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (!userCredential.user.emailVerified) {
        setError('Por favor, verifique seu e-mail antes de acessar o sistema. Enviamos um link para sua caixa de entrada.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      setLocation('/dashboard');
    } catch (err: any) {
      setError('E-mail ou senha incorretos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'client',
          status: 'active',
          level: 'bronze',
          availableCashback: 0,
          totalCashback: 0,
          referralCode,
          createdAt: serverTimestamp(),
        });
      }
      setLocation('/dashboard');
    } catch (err: any) {
      setError('Erro ao entrar com Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 premium-gradient relative items-center justify-center p-12 overflow-hidden">
        <div className="relative z-10 max-w-lg text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Logo size={60} textColor="text-white" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-headline font-black mb-6 leading-tight"
          >
            Sua economia inteligente começa aqui.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-primary-fixed/80 mb-10 leading-relaxed"
          >
            Junte-se a milhares de maranhenses que já estão transformando suas notas fiscais em dinheiro de verdade.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold mb-1">100% Seguro</h4>
              <p className="text-xs text-white/60">Seus dados protegidos pela LGPD.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h4 className="font-bold mb-1">Cashback Real</h4>
              <p className="text-xs text-white/60">Dinheiro direto na sua carteira.</p>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-medium/30 rounded-full blur-[120px]"></div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center p-6 lg:p-20 bg-surface">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-xs mb-6 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Voltar ao início
            </Link>
            <div className="flex justify-center mb-4">
              <Logo size={50} showText={false} />
            </div>
            <h1 className="text-4xl font-headline font-black text-primary leading-none">MARACASH</h1>
            <div className="text-[10px] tracking-[0.2em] uppercase font-black text-secondary mt-1">Cashback do Maranhão</div>
            <h2 className="text-2xl font-headline font-black text-on-surface mt-8">Bem-vindo!</h2>
            <p className="text-sm text-on-surface-variant mt-2">Entre na sua conta para gerenciar seu cashback.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error/10 text-error p-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2 border border-error/20"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onEmailLogin)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">E-mail</label>
              <input 
                type="email" 
                placeholder="seuemail@exemplo.com"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.email ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              {errors.email && <p className="text-[10px] text-error font-bold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70">Senha</label>
                <Link href="/forgot-password" title="Esqueci minha senha" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
                  Esqueceu?
                </Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.password ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              {errors.password && <p className="text-[10px] text-error font-bold ml-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-black text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  ENTRAR NA CONTA
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-surface px-4 text-on-surface-variant/50">Ou entre com</span>
            </div>
          </div>

          <button 
            onClick={onGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-surface-container-high border border-outline-variant/10 font-bold text-sm flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-all active:scale-[0.98]"
          >
            <Chrome size={18} className="text-primary" />
            Continuar com Google
          </button>

          <p className="text-center mt-8 text-on-surface-variant font-bold text-sm">
            Ainda não tem conta?{' '}
            <Link href="/register" className="text-primary font-black hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
