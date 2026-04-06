import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-surface font-body pb-20">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-headline font-black text-on-surface">Termos de Uso</h1>
        <div className="w-12"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-low p-8 md:p-16 rounded-[3rem] border border-outline-variant/10 shadow-2xl shadow-primary/5 space-y-12">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText size={40} />
            </div>
            <h2 className="text-4xl font-headline font-black text-on-surface">Termos e Condições</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">Leia atentamente as regras de utilização da plataforma MaraCash.</p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:font-headline prose-headings:font-black prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant">
            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                Aceitação dos Termos
              </h3>
              <p>
                Ao acessar e utilizar a plataforma MaraCash, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                Descrição do Serviço
              </h3>
              <p>
                O MaraCash é uma plataforma de fidelização e cashback que permite aos usuários acumular benefícios em compras 
                realizadas em estabelecimentos parceiros no estado do Maranhão, mediante a leitura de NFC-e (Nota Fiscal de Consumidor Eletrônica).
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                Cadastro de Usuário
              </h3>
              <p>
                Para utilizar as funcionalidades de cashback, o usuário deve realizar um cadastro fornecendo informações verídicas e completas. 
                A conta é pessoal e intransferível. O usuário é responsável por manter a confidencialidade de suas credenciais de acesso.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">4</span>
                Regras de Cashback
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-primary shrink-0 mt-1" />
                  O cashback é calculado com base no valor líquido da nota fiscal, excluindo fretes e taxas se aplicável.
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-primary shrink-0 mt-1" />
                  As notas fiscais devem ser emitidas em estabelecimentos parceiros e estar dentro do prazo de validade para registro (7 dias).
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight size={18} className="text-primary shrink-0 mt-1" />
                  O MaraCash reserva-se o direito de auditar registros e cancelar benefícios obtidos de forma fraudulenta.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">5</span>
                Limitação de Responsabilidade
              </h3>
              <p>
                O MaraCash não se responsabiliza pela qualidade dos produtos ou serviços prestados pelos estabelecimentos parceiros. 
                Nossa responsabilidade limita-se à gestão do programa de fidelidade e processamento dos créditos de cashback.
              </p>
            </section>
          </div>

          <div className="pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-primary font-bold text-sm">
              <ShieldCheck size={20} />
              Documento Verificado
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
