import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db } from '../lib/firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useLocation, Link } from 'wouter';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, MapPin, Phone, Percent, 
  Building2, CreditCard, ChevronLeft,
  ArrowRight, Loader2, ShieldCheck,
  Info, Sparkles, Globe, Map
} from 'lucide-react';

const storeSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  razaoSocial: z.string().min(3, 'Razão Social muito curta'),
  cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos'),
  cashbackPct: z.number().min(5, 'O cashback mínimo é 5%'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.object({
    cep: z.string().length(8, 'CEP deve ter 8 dígitos'),
    street: z.string().min(3, 'Rua inválida'),
    number: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(3, 'Cidade inválida'),
  }),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export const MerchantDetailsPage: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      razaoSocial: '',
      cnpj: '',
      cashbackPct: 5,
      phone: '',
      address: {
        cep: '',
        street: '',
        number: '',
        city: '',
      }
    }
  });

  const onSubmit = async (data: StoreFormValues) => {
    if (!profile?.uid) return;
    setLoading(true);
    try {
      const storeId = `store_${profile.uid}`;
      
      await setDoc(doc(db, 'stores', storeId), {
        ...data,
        id: storeId,
        ownerUid: profile.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'users', profile.uid), {
        storeId: storeId,
        status: 'pending',
      });

      setLocation('/merchant/pending');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar detalhes da loja.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body pb-20">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/register" className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-headline font-black text-on-surface">Configurar Loja</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-low p-8 md:p-12 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5">
          <div className="text-center mb-12 space-y-3">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Store size={40} />
            </div>
            <h2 className="text-3xl font-headline font-black text-on-surface">Detalhes do Estabelecimento</h2>
            <p className="text-on-surface-variant max-w-md mx-auto">Complete o cadastro para que nossa equipe possa validar sua loja na plataforma.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Basic Info Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <h3 className="text-lg font-headline font-bold text-on-surface">Informações Gerais</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Nome Fantasia</label>
                  <input 
                    type="text" 
                    placeholder="Minha Loja"
                    {...register('name')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.name ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.name && <p className="text-xs text-error font-bold ml-2">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Razão Social</label>
                  <input 
                    type="text" 
                    placeholder="Empresa LTDA"
                    {...register('razaoSocial')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.razaoSocial ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.razaoSocial && <p className="text-xs text-error font-bold ml-2">{errors.razaoSocial.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">CNPJ (14 dígitos)</label>
                  <input 
                    type="text" 
                    placeholder="00000000000000"
                    {...register('cnpj')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.cnpj ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.cnpj && <p className="text-xs text-error font-bold ml-2">{errors.cnpj.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Telefone Comercial</label>
                  <input 
                    type="text" 
                    placeholder="98999999999"
                    {...register('phone')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.phone ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.phone && <p className="text-xs text-error font-bold ml-2">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Cashback Config Section */}
            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Percent size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface">Configuração de Cashback</h3>
                  <p className="text-xs text-on-surface-variant">Defina a porcentagem de retorno para seus clientes.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Cashback Proposto (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      {...register('cashbackPct', { valueAsNumber: true })}
                      className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 pr-16 text-xl font-black ${errors.cashbackPct ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-on-surface-variant">%</span>
                  </div>
                  {errors.cashbackPct && <p className="text-xs text-error font-bold ml-2">{errors.cashbackPct.message}</p>}
                </div>

                <div className="p-4 rounded-2xl bg-white/50 border border-primary/10 flex gap-4 items-start">
                  <Info size={18} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-on-surface-variant leading-relaxed uppercase tracking-wider">
                    O split será de 4/5 para cashback local (uso exclusivo na sua loja) e 1/5 para o fundo global MaraCash.
                  </p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <h3 className="text-lg font-headline font-bold text-on-surface">Localização</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">CEP</label>
                  <input 
                    type="text" 
                    placeholder="00000000"
                    {...register('address.cep')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.address?.cep ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.address?.cep && <p className="text-xs text-error font-bold ml-2">{errors.address.cep.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Cidade</label>
                  <input 
                    type="text" 
                    placeholder="São Luís"
                    {...register('address.city')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.address?.city ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.address?.city && <p className="text-xs text-error font-bold ml-2">{errors.address.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Rua / Avenida</label>
                  <input 
                    type="text" 
                    placeholder="Av. Litorânea"
                    {...register('address.street')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.address?.street ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.address?.street && <p className="text-xs text-error font-bold ml-2">{errors.address.street.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Número</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    {...register('address.number')}
                    className={`w-full px-6 py-4 rounded-2xl bg-surface border-2 transition-all focus:ring-0 ${errors.address?.number ? 'border-error/50 focus:border-error' : 'border-outline-variant/10 focus:border-primary'}`}
                  />
                  {errors.address?.number && <p className="text-xs text-error font-bold ml-2">{errors.address.number.message}</p>}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-10 space-y-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full premium-gradient text-white py-6 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <ShieldCheck size={24} />
                    Finalizar e Enviar para Análise
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-4 text-on-surface-variant">
                <div className="h-px flex-1 bg-outline-variant/10"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Análise em até 24h</p>
                <div className="h-px flex-1 bg-outline-variant/10"></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
