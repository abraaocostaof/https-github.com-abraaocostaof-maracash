import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ShieldCheck, RefreshCcw, ChevronRight } from 'lucide-react';

export const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-surface font-body pb-20">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-headline font-black text-on-surface">Reembolso</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-low p-8 md:p-16 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5 space-y-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <RefreshCcw size={40} />
            </div>
            <h2 className="text-4xl font-headline font-black text-on-surface">Política de Reembolso</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">Saiba como funcionam os reembolsos e cancelamentos no MaraCash.</p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-headline prose-headings:font-black prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant">
            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">1</span>
                Cashback e Estornos
              </h3>
              <p>
                O cashback é um benefício concedido sobre compras efetivadas. Caso uma compra seja cancelada ou devolvida no estabelecimento parceiro, 
                o cashback correspondente será automaticamente estornado do seu saldo MaraCash.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">2</span>
                Resgates de Cashback
              </h3>
              <p>
                Uma vez que o resgate de cashback foi solicitado e o código OTP gerado e validado pelo lojista, a operação é considerada finalizada. 
                Não é possível solicitar o estorno de um resgate já processado.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">3</span>
                Contestações
              </h3>
              <p>
                Caso você identifique qualquer erro no processamento de seus créditos, entre em contato com nosso suporte através do e-mail 
                <strong>contato@maracash.com.br</strong> em até 30 dias após a transação.
              </p>
            </section>
          </div>

          <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-emerald-500 font-bold text-sm">
              <ShieldCheck size={20} />
              Transações Transparentes
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
