import Link from 'next/link'
import { Compass, Clock, BookOpen, Shield, Target, Lightbulb, TrendingUp, Timer, Brain, Lock, Search, GraduationCap, Alert } from '@/components/icons/SocialIcons'

interface SectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}

const Section = ({ title, icon, children }: SectionProps) => (
  <section className="bg-brand-off-white rounded-2xl my-8 p-8 shadow-sm border-l-4 border-brand-primary-blue flex flex-col gap-4">
    <h2 className="flex items-center font-poppins font-bold text-2xl text-brand-dark-blue mb-3 gap-3">
      {icon && <span className="text-3xl">{icon}</span>}
      {title}
    </h2>
    <div className="text-lg text-brand-primary-blue leading-relaxed">
      {children}
    </div>
  </section>
)

export function AboutCifra() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 font-sans">
      {/* Header Institucional */}
      <header className="bg-brand-dark-blue rounded-[20px] p-[34px_24px] mb-[38px] text-brand-off-white shadow-[0_4px_22px_rgba(4,25,36,0.08)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-blue/10 to-brand-gold/10"></div>
        <div className="relative z-10">
          <h1 className="text-[34px] font-extrabold mb-[10px] tracking-tight text-white">
            A Cifra
          </h1>
          <p className="text-[19px] text-brand-gold font-semibold mb-2">
            Consistência, Disciplina e Soberania no Cripto
          </p>
          <p className="text-[16px] text-brand-off-white opacity-[.90]">
            Educação cripto baseada em experiência real e disciplina — sem atalhos, promessas ou fórmulas mágicas.
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-brand-primary-blue to-brand-gold rounded-full mt-6"></div>
        </div>
      </header>

      {/* Quem Somos */}
      <Section title="Quem Somos" icon={<Compass size="28" />}>
        A Cifra é um projeto independente dedicado a educar investidores sobre o universo dos criptoativos sem ilusões ou atalhos. Nossa missão é disseminar conhecimento prático, baseado em disciplina, experiência real e responsabilidade. Aqui não há espaço para promessas fáceis ou fórmulas de enriquecimento rápido — apenas conteúdo transparente e embasado.
        <blockquote className="mt-4 border-l-4 border-brand-gold pl-4 text-brand-primary-blue italic">
          "Estudo Sólido + Disciplina Férrea = Base Financeira Sólida."
        </blockquote>
      </Section>

      {/* Jornada da Cifra */}
      <Section title="Nossa Jornada no Mercado Cripto" icon={<Clock size="28" />}>
        <ol className="list-none p-0 m-0 space-y-3">
          <li>
            <strong>2018-2019 • O Inverno do Aprendizado <BookOpen size="20" /></strong><br />
            A Cifra surge da experiência de ciclos completos de mercado. O início foi marcado por grandes desafios e perdas — o preço pago pela verdadeira educação financeira.
          </li>
          <li>
            <strong>2020-2021 • Disciplina na Prática <Target size="20" /></strong><br />
            O bull market serviu como teste de fogo. Mantivemos disciplina, foco em fundamentos e self-custody, evitando modismos e promessas fáceis.
          </li>
          <li>
            <strong>2022-2024 • Maturidade & Fundamentos <Shield size="20" /></strong><br />
            Sobrevivendo a crashes e escândalos, consolidamos a abordagem fundamentada, refinando metodologias de análise e gestão de risco.
          </li>
          <li>
            <strong>2024-2025 • Educação & Compartilhamento <Target size="20" /></strong><br />
            A Cifra se dedica a compartilhar aprendizados reais, promover pesquisa própria (DYOR) e formar investidores conscientes.
          </li>
        </ol>
      </Section>

      {/* Princípios */}
      <Section title="Princípios Fundamentais" icon={<Lightbulb size="28" />}>
        Após anos de atuação prática no universo cripto, extraímos quatro pilares fundamentais:
        <ul className="list-none p-0 space-y-3">
          <li>
            <strong><TrendingUp size="20" /> Fundamentos &gt; Hype:</strong> Tecnologia e casos de uso reais importam mais que marketing. Preferimos whitepapers a tendências passageiras.
          </li>
          <li>
            <strong><Timer size="20" /> Consistência &gt; Timing:</strong> Estratégias como DCA superam tentativas de acertar o melhor momento do mercado. Disciplina constante é o segredo.
          </li>
          <li>
            <strong><Brain size="20" /> Psicologia &gt; Estratégia:</strong> Controlar emoções é mais valioso que qualquer indicador técnico. O autoconhecimento protege o investidor dos próprios erros.
          </li>
          <li>
            <strong><Lock size="20" /> Custódia = Soberania:</strong> "Not your keys, not your coins." Self-custody é o alicerce da liberdade financeira.
          </li>
        </ul>
      </Section>

      {/* Foco Atual */}
      <Section title="Foco Atual da Cifra" icon={<Target size="28" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <b>₿ Bitcoin DCA</b><br />
            <span className="text-brand-primary-blue">Acúmulo disciplinado mensal</span>
          </div>
          <div>
            <b><Lock size="20" /> Self-Custody</b><br />
            <span className="text-brand-primary-blue">Segurança máxima via Ledger/Multisig</span>
          </div>
          <div>
            <b><Search size="20" /> Análise Fundamentalista</b><br />
            <span className="text-brand-primary-blue">Estudo de L1/L2 com adoção real</span>
          </div>
          <div>
            <b><GraduationCap size="20" /> Educação em Gestão de Risco</b><br />
            <span className="text-brand-primary-blue">Compartilhamento de aprendizado prático</span>
          </div>
          <div>
            <b><Alert size="20" /> Awareness sobre Scams</b><br />
            <span className="text-brand-primary-blue">Alerta constante para golpes e fraudes</span>
          </div>
        </div>
      </Section>

      {/* Pilar Filosófico */}
      <Section title="Pilar Filosófico" icon={<Target size="28" />}>
        Nossa abordagem se diferencia dos "gurus" do mercado:
        <ul className="mt-2 space-y-2">
          <li><b>Foco no Fundamento:</b> Investimos só no que entendemos profundamente.</li>
          <li><b>Honestidade Brutal:</b> Riscos e volatilidade são reais — preferimos a verdade à ilusão.</li>
          <li><b>Experiência Prática:</b> Vivemos ciclos reais; disciplina vence hype.</li>
        </ul>
      </Section>

      {/* O que diferencia */}
      <Section title="O Que Nos Diferencia" icon={<Lightbulb size="28" />}>
        <div className="flex flex-wrap gap-6 items-start">
          <ul className="flex-1 bg-white rounded-xl p-4 border border-brand-gold">
            <b className="text-brand-gold">❌ O que NÃO somos:</b>
            <li>Traders que vendem cursos</li>
            <li>Influenciadores de "moedas milagrosas"</li>
            <li>Vendedores de promessas fáceis</li>
            <li>Consultores financeiros</li>
            <li>Pregadores de fórmulas mágicas</li>
          </ul>
          <ul className="flex-1 bg-white rounded-xl p-4 border border-brand-primary-blue">
            <b className="text-brand-primary-blue">✅ O que SOMOS:</b>
            <li>Educadores focados em fundamentos</li>
            <li>Promotores da disciplina e gestão de risco</li>
            <li>Defensores da soberania financeira</li>
            <li>Totalmente honestos sobre riscos</li>
            <li>"Skin in the game": praticamos o que ensinamos</li>
          </ul>
        </div>
      </Section>

      {/* Voz no Mercado */}
      <Section title="Voz no Mercado" icon="📢">
        A Cifra é sua lembrança racional em meio à euforia cripto. O mercado pode ser brutal — mas a matemática, a disciplina e o conhecimento são as ferramentas para construir patrimônio.
        <blockquote className="mt-3 border-l-4 border-brand-gold pl-4 text-brand-primary-blue italic">
          DYOR – Do Your Own Research.<br />
          Use nosso conteúdo como ponto de partida. Questione sempre. Pesquise por conta própria.
        </blockquote>
      </Section>

      {/* Call to Action + Aviso Legal */}
      <div className="mt-11 text-center">
        <Link
          href="/artigos"
          className="inline-block bg-gradient-to-r from-brand-primary-blue to-brand-medium-blue text-white px-10 py-4 rounded-3xl font-bold text-xl tracking-wide shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          Leia nossos artigos
        </Link>
        <Link
          href="/contatos"
          className="inline-block ml-6 text-brand-primary-blue font-semibold underline hover:text-brand-medium-blue transition-colors"
        >
          Entre em contato
        </Link>

        <div className="mt-8 text-sm text-brand-primary-blue opacity-85">
          <Alert size="20" /> Todo conteúdo d'A Cifra é educacional — não constitui conselho de investimento.<br/>
          Criptoativos envolvem alto risco. Faça sua própria pesquisa (DYOR) e nunca invista mais do que pode perder.
        </div>
      </div>
    </main>
  )
}
