import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e proteção de dados do A Cifra',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <Container size="lg" className="py-12">
        <article className="prose prose-lg max-w-none">
          <h1>Política de Privacidade</h1>
          
          <p className="lead">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <h2>1. Informações que Coletamos</h2>
          <p>
            O A Cifra coleta informações para fornecer melhores serviços aos nossos usuários. 
            Coletamos informações das seguintes formas:
          </p>
          <ul>
            <li>Informações que você nos fornece diretamente (newsletter, comentários)</li>
            <li>Informações coletadas automaticamente (cookies, analytics)</li>
            <li>Informações de terceiros (Google Analytics, Google AdSense)</li>
          </ul>

          <h2>2. Como Usamos as Informações</h2>
          <p>Usamos as informações coletadas para:</p>
          <ul>
            <li>Melhorar nosso conteúdo e experiência do usuário</li>
            <li>Enviar newsletters e atualizações (com seu consentimento)</li>
            <li>Analisar o uso do site e tendências</li>
            <li>Exibir anúncios relevantes através do Google AdSense</li>
            <li>Proteger contra fraudes e abusos</li>
          </ul>

          <h2>3. Cookies</h2>
          <p>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência. 
            Os cookies nos ajudam a:
          </p>
          <ul>
            <li>Lembrar suas preferências</li>
            <li>Entender como você usa nosso site</li>
            <li>Personalizar conteúdo e anúncios</li>
          </ul>
          <p>
            Você pode controlar o uso de cookies através das configurações do seu navegador.
          </p>

          <h2>4. Google AdSense</h2>
          <p>
            Utilizamos o Google AdSense para exibir anúncios. O Google pode usar cookies 
            para exibir anúncios baseados em suas visitas anteriores ao nosso site e outros sites. 
            Você pode desativar anúncios personalizados visitando as{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Configurações de Anúncios do Google
            </a>.
          </p>

          <h2>5. Google Analytics</h2>
          <p>
            Usamos o Google Analytics para analisar o uso do nosso site. O Google Analytics 
            coleta informações como frequência de visitas, páginas visitadas e tempo de permanência.
          </p>

          <h2>6. Compartilhamento de Informações</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
            exceto quando necessário para:
          </p>
          <ul>
            <li>Cumprir obrigações legais</li>
            <li>Proteger nossos direitos e propriedade</li>
            <li>Fornecer serviços através de parceiros confiáveis (Google)</li>
          </ul>

          <h2>7. Segurança</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações contra acesso 
            não autorizado, alteração, divulgação ou destruição.
          </p>

          <h2>8. Seus Direitos (LGPD)</h2>
          <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento de dados</li>
            <li>Acessar seus dados</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar a anonimização ou eliminação de dados</li>
            <li>Revogar o consentimento</li>
          </ul>

          <h2>9. Links Externos</h2>
          <p>
            Nosso site pode conter links para sites externos. Não somos responsáveis pelas 
            práticas de privacidade desses sites.
          </p>

          <h2>10. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
            significativas através do site.
          </p>

          <h2>11. Contato</h2>
          <p>
            Para questões sobre esta política de privacidade, entre em contato:
          </p>
          <ul>
            <li>Email: cifraaessenciacoin@gmail.com</li>
            <li>Site: <a href="https://acifra.com">acifra.com</a></li>
          </ul>
        </article>
      </Container>
    </MainLayout>
  )
}
