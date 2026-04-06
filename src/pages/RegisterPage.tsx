import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Lock, ArrowRight, ShieldCheck, 
  Store, ChevronLeft, AlertCircle, Loader2,
  CheckCircle, CreditCard, Building2, Info,
  Calendar
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { cpf, cnpj } from 'cpf-cnpj-validator';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  cep: z.string().min(8, 'CEP inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['client', 'merchant']),
  birthDate: z.string().min(10, 'Data de nascimento inválida (DD/MM/AAAA)'),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  referralCodeInput: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'Você deve aceitar os Termos de Uso'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'client') {
    return data.cpf ? cpf.isValid(data.cpf) : false;
  }
  return true;
}, {
  message: "CPF inválido",
  path: ["cpf"],
}).refine((data) => {
  if (data.role === 'merchant') {
    return data.cnpj ? cnpj.isValid(data.cnpj) : false;
  }
  return true;
}, {
  message: "CNPJ inválido",
  path: ["cnpj"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'client' | 'merchant'>('client');
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'client', termsAccepted: false, city: 'Chapadinha' }
  });

  const password = watch('password', '');
  const passwordStrength = Math.min((password.length / 8) * 100, 100);

  const onRegister = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      await updateProfile(user, { displayName: data.name });

      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: data.name,
        role: data.role,
        status: data.role === 'client' ? 'active' : 'pending',
        level: data.role === 'client' ? 'bronze' : null,
        availableCashback: 0,
        totalCashback: 0,
        referralCode,
        referredBy: data.referralCodeInput || null,
        birthDate: data.birthDate,
        whatsapp: data.whatsapp,
        cep: data.cep,
        city: data.city,
        cpf: data.role === 'client' ? data.cpf : null,
        cnpj: data.role === 'merchant' ? data.cnpj : null,
        termsAcceptedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      if (data.role === 'merchant') {
        setLocation('/register/merchant-details');
      } else {
        setLocation('/dashboard');
      }
    } catch (err: any) {
      console.error("Erro detalhado no cadastro:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/3 premium-gradient relative items-center justify-center p-12 overflow-hidden">
        <div className="relative z-10 max-w-sm text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Logo size={50} textColor="text-white" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-headline font-black mb-6 leading-tight"
          >
            Comece a economizar hoje mesmo.
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold">Cadastro Rápido</h4>
                <p className="text-sm text-white/60">Menos de 2 minutos para começar.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold">Privacidade Total</h4>
                <p className="text-sm text-white/60">Seus dados estão seguros conosco.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Right Side: Register Form */}
      <div className="flex-1 flex flex-col justify-center p-4 lg:p-12 bg-surface overflow-y-auto">
        <div className="max-w-lg w-full mx-auto py-6">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-xs mb-4 group">
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Voltar ao início
            </Link>
            <div className="flex justify-center mb-4">
              <Logo size={40} showText={false} />
            </div>
            <h1 className="text-3xl font-headline font-black text-primary leading-none">MARACASH</h1>
            <div className="text-[10px] tracking-[0.2em] uppercase font-black text-secondary mt-1">Cashback do Maranhão</div>
          </div>

          {/* Role Selection - More compact */}
          <div className="flex p-1 bg-surface-container-high rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setRole('client'); setValue('role', 'client'); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                role === 'client' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <User size={14} />
              Sou Cliente
            </button>
            <button
              type="button"
              onClick={() => { setRole('merchant'); setValue('role', 'merchant'); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${
                role === 'merchant' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Store size={14} />
              Sou Lojista
            </button>
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

          <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
            <input type="hidden" value={role} {...register('role')} />
            
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Nome Completo</label>
              <input 
                type="text" 
                placeholder="Como no seu RG"
                {...register('name')}
                className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.name ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              {errors.name && <p className="text-[10px] text-error font-bold ml-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">
                  {role === 'client' ? 'CPF' : 'CNPJ'}
                </label>
                <input 
                  type="text" 
                  placeholder={role === 'client' ? "000.000.000-00" : "00.000.000/0000-00"}
                  {...register(role === 'client' ? 'cpf' : 'cnpj')}
                  className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.cpf || errors.cnpj ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {(errors.cpf || errors.cnpj) && <p className="text-[10px] text-error font-bold ml-1">{(errors.cpf?.message || errors.cnpj?.message)}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Nascimento</label>
                <input 
                  type="text" 
                  placeholder="DD/MM/AAAA"
                  {...register('birthDate')}
                  maxLength={10}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 8) value = value.slice(0, 8);
                    if (value.length > 4) {
                      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
                    } else if (value.length > 2) {
                      value = `${value.slice(0, 2)}/${value.slice(2)}`;
                    }
                    e.target.value = value;
                    setValue('birthDate', value);
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.birthDate ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.birthDate && <p className="text-[10px] text-error font-bold ml-1">{errors.birthDate.message}</p>}
              </div>
            </div>

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
              <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">WhatsApp</label>
              <input 
                type="tel" 
                placeholder="(98) 9 0000-0000"
                {...register('whatsapp')}
                className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.whatsapp ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              {errors.whatsapp && <p className="text-[10px] text-error font-bold ml-1">{errors.whatsapp.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">CEP</label>
                <input 
                  type="text" 
                  placeholder="65000-000"
                  {...register('cep')}
                  className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.cep ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.cep && <p className="text-[10px] text-error font-bold ml-1">{errors.cep.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Cidade</label>
                <input 
                  type="text" 
                  readOnly
                  {...register('city')}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-high border-2 border-outline-variant/10 text-on-surface-variant/50 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Criar Senha</label>
              <input 
                type="password" 
                placeholder="Mínimo 8 caracteres"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 transition-all focus:ring-0 text-sm ${errors.password ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              <div className="h-1 bg-surface-container-high mt-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength}%` }}
                  className={`h-full transition-colors ${
                    passwordStrength < 40 ? 'bg-error' : passwordStrength < 80 ? 'bg-secondary' : 'bg-primary'
                  }`}
                />
              </div>
              {errors.password && <p className="text-[10px] text-error font-bold ml-1">{errors.password.message}</p>}
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Código de Indicação (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ex: MARA-123"
                {...register('referralCodeInput')}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-primary/20 focus:border-primary focus:ring-0 text-sm transition-all"
              />
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <input 
                type="checkbox" 
                id="terms"
                {...register('termsAccepted')}
                className="mt-0.5 w-4 h-4 rounded border-outline-variant/20 text-primary focus:ring-primary/20"
              />
              <label htmlFor="terms" className="text-[10px] text-on-surface-variant leading-tight">
                Eu aceito os <Link href="/terms" className="text-primary font-bold hover:underline">Termos de Uso</Link> e a <Link href="/privacy" className="text-primary font-bold hover:underline">Política de Privacidade</Link>.
              </label>
            </div>
            {errors.termsAccepted && <p className="text-[10px] text-error font-bold ml-1">{errors.termsAccepted.message}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-black text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  CRIAR MINHA CONTA
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-on-surface-variant font-bold text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-black hover:underline">
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
