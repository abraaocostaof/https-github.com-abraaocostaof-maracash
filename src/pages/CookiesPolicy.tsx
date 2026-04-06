import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ShieldCheck, Cookie, ChevronRight } from 'lucide-react';

export const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-surface font-body pb-20">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-headline font-black text-on-surface">Cookies</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-low p-8 md:p-16 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5 space-y-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Cookie size={40} />
            </div>
            <h2 className="text-4xl font-headline font-black text-on-surface">Política de Cookies</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">Entenda como utilizamos cookies para melhorar sua experiência no MaraCash.</p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-headline prose-headings:font-black prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant">
            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm">1</span>
                O que são Cookies?
              </h3>
              <p>
                Cookies são pequenos arquivos de texto enviados pelo site ao seu navegador e armazenados em seu dispositivo. 
                Eles permitem que o site "lembre" suas ações ou preferências ao longo do tempo.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm">2</span>
                Como usamos os Cookies?
              </h3>
              <p>Utilizamos cookies para as seguintes finalidades:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-amber-500 shrink-0 mt-1" />
                  <strong>Essenciais:</strong> Necessários para o funcionamento básico do site e segurança.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-amber-500 shrink-0 mt-1" />
                  <strong>Desempenho:</strong> Ajudam-nos a entender como os visitantes interagem com o site, coletando informações anonimamente.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-amber-500 shrink-0 mt-1" />
                  <strong>Funcionalidade:</strong> Permitem que o site lembre de escolhas que você faz (como seu nome de usuário ou idioma).
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm">3</span>
                Controle de Cookies
              </h3>
              <p>
                Você pode controlar e/ou excluir cookies a qualquer momento através das configurações do seu navegador. 
                No entanto, desativar certos cookies pode afetar sua experiência de navegação e a funcionalidade de nossos serviços.
              </p>
            </section>
          </div>

          <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-amber-500 font-bold text-sm">
              <ShieldCheck size={20} />
              Navegação Segura
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
