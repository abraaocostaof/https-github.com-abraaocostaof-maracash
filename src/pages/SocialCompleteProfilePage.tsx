import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { useLocation, Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, CreditCard, Calendar, Phone, 
  MapPin, Lock, ShieldCheck, ArrowRight,
  Loader2, AlertCircle, CheckCircle,
  Building2, Map, Sparkles
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

const completeProfileSchema = z.object({
  cpf: z.string().refine((val) => cpfValidator.isValid(val), 'CPF inválido'),
  birthDate: z.string().min(10, 'Data de nascimento inválida'),
  phone: z.string().min(10, 'Telefone inválido'),
  zipCode: z.string().min(8, 'CEP inválido'),
  street: z.string().min(3, 'Rua inválida'),
  number: z.string().min(1, 'Número obrigatório'),
  neighborhood: z.string().min(2, 'Bairro inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  termsAccepted: z.boolean().refine(val => val === true, 'Você deve aceitar os Termos de Uso'),
});

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const SocialCompleteProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
  });

  const onComplete = async (data: CompleteProfileFormValues) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        cpf: data.cpf,
        birthDate: data.birthDate,
        phone: data.phone,
        address: {
          zipCode: data.zipCode,
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
        },
        termsAcceptedAt: serverTimestamp(),
        status: 'active',
      });
      
      setLocation('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-surface-container-low p-8 sm:p-10 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size={50} showText={false} />
            </div>
            <h1 className="text-3xl font-headline font-black text-primary leading-none">MARACASH</h1>
            <div className="text-[10px] tracking-[0.2em] uppercase font-black text-secondary mt-1">Cashback do Maranhão</div>
            <h2 className="text-xl font-headline font-black text-on-surface mt-6">Complete seu Perfil</h2>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto mt-2">Para sua segurança e conformidade, precisamos de mais alguns dados.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error/10 text-error p-4 rounded-2xl text-sm font-bold mb-8 flex items-center gap-3 border border-error/20"
              >
                <AlertCircle size={20} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onComplete)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">CPF</label>
                <input 
                  type="text" 
                  placeholder="000.000.000-00"
                  {...register('cpf')}
                  className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.cpf ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.cpf && <p className="text-[10px] text-error font-bold ml-1">{errors.cpf.message}</p>}
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
                  className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.birthDate ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.birthDate && <p className="text-[10px] text-error font-bold ml-1">{errors.birthDate.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">WhatsApp</label>
              <input 
                type="text" 
                placeholder="(98) 9 0000-0000"
                {...register('phone')}
                className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.phone ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              {errors.phone && <p className="text-[10px] text-error font-bold ml-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">CEP</label>
                <input 
                  type="text" 
                  placeholder="65000-000"
                  {...register('zipCode')}
                  className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.zipCode ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.zipCode && <p className="text-[10px] text-error font-bold ml-1">{errors.zipCode.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Cidade</label>
                <input 
                  type="text" 
                  placeholder="Chapadinha"
                  {...register('city')}
                  className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.city ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.city && <p className="text-[10px] text-error font-bold ml-1">{errors.city.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Rua / Avenida</label>
              <input 
                type="text" 
                placeholder="Av. Litorânea, 123"
                {...register('street')}
                className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.street ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              {errors.street && <p className="text-[10px] text-error font-bold ml-1">{errors.street.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Número</label>
                <input 
                  type="text" 
                  placeholder="123"
                  {...register('number')}
                  className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.number ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.number && <p className="text-[10px] text-error font-bold ml-1">{errors.number.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Bairro</label>
                <input 
                  type="text" 
                  placeholder="Calhau"
                  {...register('neighborhood')}
                  className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.neighborhood ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                />
                {errors.neighborhood && <p className="text-[10px] text-error font-bold ml-1">{errors.neighborhood.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant/70 ml-1">Criar Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-xl bg-surface border-2 transition-all focus:ring-0 text-sm ${errors.password ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
              />
              {errors.password && <p className="text-[10px] text-error font-bold ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-outline-variant/10">
              <input 
                type="checkbox" 
                id="terms"
                {...register('termsAccepted')}
                className="mt-0.5 w-4 h-4 rounded border-outline-variant/20 text-primary focus:ring-primary/20"
              />
              <label htmlFor="terms" className="text-[10px] text-on-surface-variant leading-tight">
                Eu aceito os <Link href="/terms" className="text-primary font-bold hover:underline">Termos de Uso</Link>.
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
                  FINALIZAR CADASTRO
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
