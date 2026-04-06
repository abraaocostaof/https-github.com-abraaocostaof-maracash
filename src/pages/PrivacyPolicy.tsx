import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ShieldCheck, Lock, ChevronRight, Mail } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-surface font-body pb-20">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-headline font-black text-on-surface">Privacidade</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-low p-8 md:p-16 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5 space-y-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock size={40} />
            </div>
            <h2 className="text-4xl font-headline font-black text-on-surface">Política de Privacidade</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">Sua privacidade é nossa prioridade. Saiba como protegemos seus dados.</p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-headline prose-headings:font-black prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant">
            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">1</span>
                Informações que Coletamos
              </h3>
              <p>Coletamos informações necessárias para a prestação de nossos serviços, incluindo:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Dados de identificação: Nome, CPF, e-mail e telefone.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Dados de consumo: Informações contidas nas notas fiscais enviadas (produtos, valores, data e local da compra).
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Dados de acesso: Endereço IP, tipo de dispositivo e histórico de navegação na plataforma.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">2</span>
                Uso das Informações
              </h3>
              <p>Seus dados são utilizados para:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Processar e validar seus créditos de cashback.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Personalizar ofertas e promoções de lojas parceiras.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Melhorar a segurança e funcionalidade da plataforma.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">3</span>
                Seus Direitos (LGPD)
              </h3>
              <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Confirmar a existência de tratamento de seus dados.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Acessar, corrigir ou excluir seus dados pessoais.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-secondary shrink-0 mt-1" />
                  Revogar seu consentimento a qualquer momento.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">4</span>
                Contato
              </h3>
              <div className="p-6 rounded-2xl bg-surface border border-outline-variant/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Encarregado de Dados</p>
                  <p className="font-bold text-on-surface">privacidade@maracash.com.br</p>
                </div>
              </div>
            </section>
          </div>

          <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-secondary font-bold text-sm">
              <ShieldCheck size={20} />
              Proteção LGPD Ativa
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Última atualização: 06 de Abril de 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
