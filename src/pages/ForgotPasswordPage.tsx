import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, ArrowRight, AlertCircle, 
  Loader2, CheckCircle, ChevronLeft
} from 'lucide-react';
import { Logo } from '../components/Logo';

const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onReset = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setSuccess(true);
    } catch (err: any) {
      setError('Erro ao enviar e-mail de recuperação. Verifique se o e-mail está correto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-surface-container-low p-8 sm:p-10 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5">
          <div className="text-center mb-8">
            <Link href="/login" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-xs mb-6 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Voltar ao login
            </Link>
            <div className="flex justify-center mb-4">
              <Logo size={50} showText={false} />
            </div>
            <h1 className="text-4xl font-headline font-black text-primary leading-none">MARACASH</h1>
            <div className="text-[10px] tracking-[0.2em] uppercase font-black text-secondary mt-1">Cashback do Maranhão</div>
            <h2 className="text-2xl font-headline font-black text-on-surface mt-8">Recuperar Senha</h2>
            <p className="text-sm text-on-surface-variant mt-2">Enviaremos um link para você redefinir sua senha.</p>
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

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/10 text-primary p-6 rounded-3xl text-center space-y-4 border border-primary/20"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-headline font-black text-lg">E-mail Enviado!</h3>
                <p className="text-xs text-primary/70 leading-relaxed">
                  Verifique sua caixa de entrada e siga as instruções para criar uma nova senha.
                </p>
                <button 
                  onClick={() => setLocation('/login')}
                  className="w-full bg-primary text-white py-3 rounded-xl font-black text-sm"
                >
                  Ir para o Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <form onSubmit={handleSubmit(onReset)} className="space-y-4">
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-black text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    ENVIAR LINK
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
