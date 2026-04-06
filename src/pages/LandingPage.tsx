import React from 'react';
import { Link } from 'wouter';
import { motion } from 'motion/react';
import { 
  ShoppingCart, QrCode, Wallet, Shield, Star, 
  Download, ArrowRight, Instagram, Share2, 
  LogIn, Zap, Sparkles, ShieldCheck, TrendingUp,
  Globe, MapPin, Users, Building2, CheckCircle2,
  CreditCard, Map
} from 'lucide-react';
import { Logo } from '../components/Logo';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-body bg-surface selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Logo size={40} />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Como Funciona</a>
            <a href="#beneficios" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Benefícios</a>
            <a href="#lojas" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Lojas Parceiras</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <button className="flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors px-2 sm:px-4 py-2">
                <LogIn size={18} />
                <span className="hidden xs:inline">Entrar</span>
              </button>
            </Link>
            <Link href="/register">
              <button className="premium-gradient text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all whitespace-nowrap">
                Criar Conta
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20"
            >
              <Sparkles size={14} className="animate-pulse" />
              O Cashback Oficial do Maranhão
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-8xl font-headline font-black text-on-surface leading-[1.1] sm:leading-[1.05] tracking-tight"
            >
              Suas compras no <span className="text-primary italic">Maranhão</span> agora rendem <span className="text-secondary">dinheiro</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
            >
              Transforme cada nota fiscal em saldo real na sua carteira. O MaraCash valoriza o consumo local e devolve parte dos seus impostos direto para você.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/register">
                <button className="w-full sm:w-auto premium-gradient text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Zap size={24} fill="currentColor" />
                  Começar a Ganhar
                </button>
              </Link>
              <Link href="/stores">
                <button className="w-full sm:w-auto bg-surface-container-high text-on-surface px-10 py-5 rounded-2xl font-black text-lg hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3">
                  <MapPin size={24} />
                  Ver Lojas Parceiras
                </button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-12 flex flex-col items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <img 
                    key={i}
                    className="w-10 h-10 rounded-full border-4 border-surface object-cover"
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    alt="User"
                    referrerPolicy="no-referrer"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-surface bg-primary-container text-primary flex items-center justify-center text-xs font-black">
                  +12k
                </div>
              </div>
              <p className="text-sm font-bold text-on-surface-variant">
                <span className="text-primary">+12.000 maranhenses</span> já estão economizando
              </p>
            </motion.div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px]"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-surface-container-low border-y border-outline-variant/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center space-y-2">
              <h3 className="text-4xl lg:text-5xl font-headline font-black text-primary">R$ 2.4M</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Cashback Pago</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl lg:text-5xl font-headline font-black text-on-surface">150k+</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Notas Processadas</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl lg:text-5xl font-headline font-black text-on-surface">850+</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Lojas Parceiras</p>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-4xl lg:text-5xl font-headline font-black text-on-surface">217</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Cidades Atendidas</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="como-funciona" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
            <h2 className="text-4xl lg:text-6xl font-headline font-black text-on-surface">Simples como deve ser.</h2>
            <p className="text-xl text-on-surface-variant">Três passos para transformar suas compras em benefícios reais.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <CreditCard size={32} />,
                title: 'Peça CPF na Nota',
                desc: 'Em qualquer compra no Maranhão, solicite a inclusão do seu CPF na Nota Fiscal eletrônica.',
                color: 'primary'
              },
              {
                step: '02',
                icon: <QrCode size={32} />,
                title: 'Escaneie no App',
                desc: 'Aponte a câmera para o QR Code da nota e veja seu saldo crescer instantaneamente.',
                color: 'secondary'
              },
              {
                step: '03',
                icon: <Wallet size={32} />,
                title: 'Resgate o Saldo',
                desc: 'Use seu cashback para novas compras ou transfira via PIX direto para sua conta.',
                color: 'tertiary'
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-surface-container-low border border-outline-variant/10 group transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${item.color}/10 text-${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-6xl font-headline font-black text-on-surface/5 mb-4 block leading-none">{item.step}</span>
                <h3 className="text-2xl font-headline font-black text-on-surface mb-4">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="beneficios" className="py-32 px-6 bg-surface-container-lowest">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:auto-rows-[240px]">
            <div className="lg:col-span-8 lg:row-span-2 rounded-[3rem] premium-gradient p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white min-h-[400px] lg:min-h-0">
              <div className="relative z-10 max-w-lg space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-4xl lg:text-5xl font-headline font-black leading-tight">Segurança de nível bancário para seus dados.</h3>
                <p className="text-xl text-white/70">Seus dados são protegidos por criptografia de ponta a ponta e nunca são compartilhados com terceiros.</p>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10">
                <Shield size={400} strokeWidth={1} />
              </div>
            </div>

            <div className="lg:col-span-4 lg:row-span-1 rounded-[3rem] bg-secondary-container p-8 sm:p-10 flex flex-col justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-on-secondary-container/10 text-on-secondary-container flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-2xl font-headline font-black text-on-secondary-container">Cashback em Dobro</h4>
              <p className="text-sm text-on-secondary-container/70 font-medium leading-relaxed">Lojas Diamante oferecem recompensas exclusivas todos os fins de semana.</p>
            </div>

            <div className="lg:col-span-4 lg:row-span-1 rounded-[3rem] bg-surface-container-high p-8 sm:p-10 flex flex-col justify-center gap-4 border border-outline-variant/10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users size={24} />
              </div>
              <h4 className="text-2xl font-headline font-black text-on-surface">Indique e Ganhe</h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Ganhe 5% de todo o cashback que seus amigos acumularem para sempre.</p>
            </div>

            <div className="lg:col-span-4 lg:row-span-1 rounded-[3rem] bg-surface-container-high p-8 sm:p-10 flex flex-col justify-center gap-4 border border-outline-variant/10">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <h4 className="text-2xl font-headline font-black text-on-surface">Gestão para Lojistas</h4>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Painel completo para gerenciar fidelidade e atrair novos clientes.</p>
            </div>

            <div className="lg:col-span-8 lg:row-span-1 rounded-[3rem] bg-surface-container-high p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-8 border border-outline-variant/10 overflow-hidden relative group">
              <div className="space-y-4 relative z-10">
                <h4 className="text-3xl font-headline font-black text-on-surface">Disponível em todo o estado.</h4>
                <p className="text-on-surface-variant font-medium">De São Luís a Imperatriz, o MaraCash está com você.</p>
                <div className="flex gap-4 pt-2">
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold">São Luís</div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold">Imperatriz</div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold">Caxias</div>
                </div>
              </div>
              <div className="hidden md:block relative z-10">
                <Map size={180} className="text-primary/10 group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto relative">
          <div className="bg-on-surface rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/10 opacity-50"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-7xl font-headline font-black text-surface leading-tight">
                Pronto para transformar suas notas em dinheiro?
              </h2>
              <p className="text-xl text-surface/60 max-w-2xl mx-auto leading-relaxed">
                Junte-se a milhares de maranhenses e comece a economizar de verdade hoje mesmo. O cadastro é grátis e leva menos de 2 minutos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <Link href="/register">
                  <button className="w-full sm:w-auto bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3">
                    Criar Minha Conta
                    <ArrowRight size={24} />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="w-full sm:w-auto bg-surface/10 text-surface px-12 py-6 rounded-2xl font-black text-xl hover:bg-surface/20 transition-all">
                    Já tenho conta
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-surface border-t border-outline-variant/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                  <Zap size={18} fill="currentColor" />
                </div>
                <span className="text-xl font-headline font-black tracking-tight text-on-surface">
                  Mara<span className="text-primary">Cash</span>
                </span>
              </Link>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                A maior plataforma de cashback do Maranhão. Valorizando o consumo local e devolvendo dinheiro para o seu bolso.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                  <Share2 size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-headline font-black text-on-surface mb-6 uppercase text-xs tracking-widest">Plataforma</h4>
              <ul className="space-y-4">
                <li><Link href="/stores" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Lojas Parceiras</Link></li>
                <li><Link href="/register" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Seja um Parceiro</Link></li>
                <li><Link href="/login" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Área do Cliente</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline font-black text-on-surface mb-6 uppercase text-xs tracking-widest">Suporte</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Fale Conosco</a></li>
                <li><a href="#" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline font-black text-on-surface mb-6 uppercase text-xs tracking-widest">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/terms" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Privacidade (LGPD)</Link></li>
                <li><Link href="/cookies" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Cookies</Link></li>
                <li><Link href="/refund" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Reembolso</Link></li>
                <li><Link href="/contact" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Contato</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              © 2026 MaraCash. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Sistema Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
