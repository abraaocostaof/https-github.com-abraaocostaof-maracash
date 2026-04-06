import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-surface font-body pb-20">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-headline font-black text-on-surface">Contato</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-low p-8 md:p-16 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5 space-y-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={40} />
            </div>
            <h2 className="text-4xl font-headline font-black text-on-surface">Fale Conosco</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">Estamos aqui para ajudar. Escolha o canal de sua preferência.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-surface border border-outline-variant/10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Mail size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-black text-on-surface text-xl">E-mail</h3>
                <p className="text-on-surface-variant text-sm">Para dúvidas gerais e suporte:</p>
                <p className="font-bold text-primary">contato@maracash.com.br</p>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-surface border border-outline-variant/10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Phone size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline font-black text-on-surface text-xl">WhatsApp</h3>
                <p className="text-on-surface-variant text-sm">Atendimento rápido via chat:</p>
                <p className="font-bold text-secondary">(98) 99999-9999</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-surface border border-outline-variant/10 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <MapPin size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-black text-on-surface text-xl">Endereço</h3>
              <p className="text-on-surface-variant text-sm">São Luís, Maranhão - Brasil</p>
            </div>
          </div>

          <form className="space-y-6 pt-10 border-t border-outline-variant/10">
            <h3 className="text-2xl font-headline font-black text-on-surface text-center">Envie uma mensagem</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Nome</label>
                <input type="text" placeholder="Seu nome" className="w-full px-6 py-4 rounded-2xl bg-surface border-2 border-outline-variant/10 focus:border-primary focus:ring-0 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">E-mail</label>
                <input type="email" placeholder="seu@email.com" className="w-full px-6 py-4 rounded-2xl bg-surface border-2 border-outline-variant/10 focus:border-primary focus:ring-0 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-2">Mensagem</label>
              <textarea rows={4} placeholder="Como podemos ajudar?" className="w-full px-6 py-4 rounded-2xl bg-surface border-2 border-outline-variant/10 focus:border-primary focus:ring-0 transition-all resize-none"></textarea>
            </div>
            <button type="button" className="w-full premium-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
              <Send size={20} />
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
