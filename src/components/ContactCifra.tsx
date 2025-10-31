import Link from 'next/link'
import { Email, Instagram, X, Github, Satellite01, Clock, Alert } from '@/components/icons/SocialIcons'

const ContactCard = ({ 
  icon, 
  title, 
  description, 
  action, 
  link, 
  external 
}: {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
  action?: string
  link: string
  external?: boolean
}) => (
  <div className="bg-white border-[1.5px] border-brand-primary-blue rounded-[14px] p-[22px_20px] mb-[18px] shadow-[0_2px_8px_rgba(4,25,36,0.04)] flex items-start gap-[18px]">
    <div className="text-[30px] flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <div className="font-bold text-[18px] text-brand-dark-blue mb-[6px]">
        {title}
      </div>
      <div className="text-brand-medium-blue text-[16px]">{description}</div>
      {action && (
        <Link
          href={link}
          target={external ? "_blank" : undefined}
          className="inline-block mt-3 bg-gradient-to-r from-brand-medium-blue to-brand-primary-blue text-white px-[30px] py-[9px] rounded-[24px] font-bold text-[16px] shadow-[0_2px_8px_rgba(21,92,139,.10)] transition-all hover:shadow-lg hover:scale-105"
        >
          {action}
        </Link>
      )}
    </div>
  </div>
)

export function ContactCifra() {
  return (
    <main className="max-w-[800px] mx-auto p-[36px_16px] font-sans">
      {/* Header */}
      <header className="bg-brand-dark-blue rounded-[20px] p-[34px_24px] mb-[38px] text-brand-off-white shadow-[0_4px_22px_rgba(4,25,36,0.08)]">
        <h1 className="text-[34px] font-extrabold mb-[10px] tracking-tight text-white">
          Entre em Contato
        </h1>
        <p className="text-[19px] text-brand-gold font-semibold mb-2">
          Canais oficiais e informações importantes para comunicação com A Cifra.
        </p>
        <p className="text-[16px] text-brand-off-white opacity-[.90]">
          Transparência e clareza em todos os pontos de contato.
        </p>
      </header>

      {/* Onde Nos Encontrar */}
      <section className="bg-brand-off-white rounded-[14px] p-[28px_20px] mb-[34px] border-l-[6px] border-brand-primary-blue shadow-[0_2px_10px_rgba(4,25,36,0.04)]">
        <h2 className="flex items-center gap-[10px] text-[23px] text-brand-dark-blue font-bold mb-[12px]">
          <Satellite01 size="28" />
          Onde Nos Encontrar (Canais Oficiais)
        </h2>
        <div className="text-brand-medium-blue text-[16px] mb-[18px]">
          Todos os canais oficiais d'A Cifra estão listados abaixo.{" "}
          <span className="font-bold text-brand-gold">Desconfie de qualquer outro canal que não esteja nesta lista.</span>
        </div>

        {/* Cards dos Canais */}
        <ContactCard
          icon={<Email size="30" />}
          title="Email Principal"
          description={
            <>
              cifraaessenciacoin@gmail.com<br />
              Canal oficial para dúvidas, parcerias, imprensa e solicitações de entrevistas.<br />
              Resposta em <span className="font-bold">24-48h úteis</span>.
            </>
          }
          action="Enviar Email"
          link="mailto:cifraaessenciacoin@gmail.com"
        />
        <ContactCard
          icon={<Instagram size="30" />}
          title="Instagram"
          description={
            <>
              <span className="font-bold">@cifras_coins</span><br />
              Análises rápidas, comentários de mercado em tempo real e manifesto diário d'A Cifra.
            </>
          }
          action="Acessar Canal"
          link="https://instagram.com/cifras_coins"
          external
        />
        <ContactCard
          icon={<X size="30" />}
          title="Twitter/X"
          description={
            <>
              <span className="font-bold">@acifra_btc</span><br />
              Threads educacionais e discussões sobre Bitcoin & blockchain.
            </>
          }
          action="Acessar Canal"
          link="https://twitter.com/acifra_btc"
          external
        />
        <ContactCard
          icon={<Github size="30" />}
          title="GitHub"
          description={
            <>
              <span className="font-bold">a-cifra</span><br />
              Código-fonte do blog, ferramentas educacionais e projetos open-source.
            </>
          }
          action="Acessar Canal"
          link="https://github.com/a-cifra"
          external
        />
      </section>

      {/* Tempos de Resposta */}
      <section className="bg-white rounded-[12px] p-[22px_18px] mb-[32px] shadow-[0_1.5px_7px_rgba(4,25,36,.045)] border-l-[5px] border-brand-gold">
        <h3 className="text-[19px] text-brand-dark-blue font-bold mb-2 flex items-center gap-2">
          <Clock size="20" />
          Tempos de Resposta
        </h3>
        <ul className="m-2 pl-5 text-brand-medium-blue">
          <li><span className="font-bold">Email:</span> resposta em até 24-48 horas úteis.</li>
          <li><span className="font-bold">Redes Sociais:</span> melhor esforço, sem garantia de resposta individual.</li>
        </ul>
        <div className="text-brand-dark-blue mt-[10px] text-[15.5px]">
          Priorizamos qualidade sobre velocidade – preferimos uma resposta pensada a uma resposta superficial.
        </div>
      </section>

      {/* Segurança */}
      <section className="bg-brand-off-white rounded-[13px] p-[24px_18px] mb-[32px] border-l-[6px] border-brand-primary-blue">
        <h3 className="text-[19px] text-brand-dark-blue font-bold mb-[10px] flex items-center gap-2">
          <Alert size="20" />
          AVISO CRÍTICO DE SEGURANÇA
        </h3>
        <div className="text-brand-medium-blue text-[15.5px] mb-[13px]">
          A Cifra<span className="font-bold text-brand-gold"> NUNCA</span> irá:
        </div>
        <ul className="ml-5 mb-[10px] text-brand-medium-blue space-y-1">
          <li>❌ Solicitar suas chaves privadas (seed phrases) ou senhas.</li>
          <li>❌ Pedir que envie criptoativos para "verificação" ou "ativação".</li>
          <li>❌ Oferecer serviços de custódia ou gerenciamento de carteiras.</li>
          <li>❌ Garantir retornos específicos ou prometer lucros.</li>
          <li>❌ Pedir dados pessoais sensíveis (CPF, dados bancários etc.).</li>
          <li>❌ Solicitar download de software suspeito ou links duvidosos.</li>
          <li>❌ Oferecer "oportunidades exclusivas" ou investimentos secretos.</li>
          <li>❌ Pressionar para decisões urgentes de investimento.</li>
        </ul>
        <div className="text-brand-medium-blue text-[15.2px] mb-2">
          Fique atento aos golpes comuns:
        </div>
        <ul className="ml-5 text-brand-medium-blue space-y-1">
          <li><Alert size="16" /> Contas falsas usando nome/foto d'A Cifra.</li>
          <li><Alert size="16" /> Golpistas com perfis similares (variações no nome).</li>
          <li><Alert size="16" /> Mensagens diretas prometendo "dicas exclusivas".</li>
          <li><Alert size="16" /> Links suspeitos enviados por supostos representantes.</li>
          <li><Alert size="16" /> Falsos airdrops, Ponzi disfarçado, fake exchanges.</li>
        </ul>
        <div className="bg-[#fffbe6] border-[1.5px] border-brand-gold p-[13px] rounded-[9px] mt-[15px] text-brand-dark-blue font-semibold">
          Lembre-se:<br/>
          Qualquer solicitação em nome d'A Cifra para esses dados é fraude.<br/>
          Em caso de dúvida, confirme sempre pelo email oficial:<br/>
          <Link href="mailto:cifraaessenciacoin@gmail.com" className="text-brand-primary-blue underline">
            cifraaessenciacoin@gmail.com
          </Link>
        </div>
      </section>

      {/* Encerramento e CTA */}
      <div className="text-center mt-[30px]">
        <div className="text-[17.5px] text-brand-medium-blue mb-[18px]">
          Seja transparente e disciplinado na comunicação, assim como somos em nosso conteúdo.<br/>
          Educação de qualidade leva tempo — mas os resultados são duradouros.
        </div>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-brand-medium-blue to-brand-primary-blue text-white px-[38px] py-[12px] rounded-[32px] font-bold text-[18.5px] shadow-[0_2px_12px_rgba(21,92,139,.09)] transition-all hover:shadow-lg hover:scale-105"
        >
          Voltar ao Blog
        </Link>
        <Link
          href="/sobre"
          className="inline-block ml-6 text-brand-primary-blue font-semibold underline hover:text-brand-medium-blue transition-colors"
        >
          Conheça A Cifra
        </Link>
      </div>
    </main>
  )
}
