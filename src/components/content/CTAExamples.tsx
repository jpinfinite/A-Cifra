import CTA from '@/components/ui/CTA';

/**
 * Exemplos de uso do componente CTA
 * 
 * Use estes exemplos em diferentes partes do site
 */

// 1. CTA para Newsletter (Padrão)
export function NewsletterCTA() {
  return (
    <CTA
      title="📧 Não perca nenhuma novidade!"
      description="Receba análises semanais, notícias importantes e guias exclusivos sobre criptomoedas diretamente no seu email."
      buttonText="Inscrever-se Grátis"
      buttonLink="#newsletter"
      variant="primary"
    />
  );
}

// 2. CTA para Artigos Educacionais
export function EducationCTA() {
  return (
    <CTA
      title="🎓 Aprenda sobre Criptomoedas"
      description="Acesse nossa biblioteca completa de guias, tutoriais e análises para dominar o mercado crypto."
      buttonText="Explorar Conteúdo"
      buttonLink="/categoria/educacao"
      variant="secondary"
    />
  );
}

// 3. CTA para Análises
export function AnalysisCTA() {
  return (
    <CTA
      title="📊 Análises Profissionais"
      description="Descubra análises técnicas e fundamentalistas das principais criptomoedas do mercado."
      buttonText="Ver Análises"
      buttonLink="/categoria/analises"
      variant="primary"
    />
  );
}

// 4. CTA para Segurança
export function SecurityCTA() {
  return (
    <CTA
      title="🔒 Proteja seus Investimentos"
      description="Aprenda as melhores práticas de segurança para manter suas criptomoedas protegidas."
      buttonText="Guias de Segurança"
      buttonLink="/categoria/seguranca"
      variant="newsletter"
    />
  );
}

// 5. CTA para DeFi
export function DeFiCTA() {
  return (
    <CTA
      title="🚀 Explore o Mundo DeFi"
      description="Entenda como funcionam as finanças descentralizadas e como começar com segurança."
      buttonText="Aprender DeFi"
      buttonLink="/categoria/defi"
      variant="primary"
    />
  );
}

// 6. CTA Genérico Personalizável
export function CustomCTA() {
  return (
    <CTA
      title="💎 Descubra as Melhores Oportunidades"
      description="Fique por dentro das altcoins mais promissoras e tendências do mercado crypto."
      buttonText="Ver Oportunidades"
      buttonLink="/categoria/altcoins"
      variant="secondary"
    />
  );
}

// 7. CTA para Final de Artigo
export function ArticleEndCTA() {
  return (
    <CTA
      title="Gostou deste artigo?"
      description="Receba mais conteúdo como este diretamente no seu email. Análises, notícias e guias exclusivos toda semana."
      buttonText="Quero Receber"
      buttonLink="#newsletter"
      variant="newsletter"
    />
  );
}

// 8. CTA para Iniciantes
export function BeginnerCTA() {
  return (
    <CTA
      title="🌟 Novo no Mundo Crypto?"
      description="Comece sua jornada com nossos guias para iniciantes. Aprenda do básico ao avançado de forma simples e prática."
      buttonText="Começar Agora"
      buttonLink="/artigo/bitcoin-guia-completo-iniciantes-2025"
      variant="primary"
    />
  );
}
