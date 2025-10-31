import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { Shield, Lock, Alert, BookOpen, Target, Clock } from '@/components/icons/SocialIcons'

export const metadata: Metadata = {
  title: 'Política de Privacidade | A Cifra',
  description: 'Política de privacidade da A Cifra. Saiba como coletamos, usamos e protegemos suas informações pessoais em nosso site de educação sobre criptomoedas.',
  keywords: ['política de privacidade', 'proteção de dados', 'LGPD', 'privacidade', 'dados pessoais', 'segurança da informação'],
}

export default function PrivacidadePage() {
  const lastUpdated = new Date('2025-10-27').toLocaleDateString('pt-BR')

  return (
    <MainLayout>
      <Container className="py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="text-brand-gold">
              <Shield size="48" />
            </div>
          </div>
          <Heading level={1} className="mb-4">
            Política de Privacidade
          </Heading>
          <Text className="text-lg text-gray-600 max-w-3xl mx-auto">
            Na A Cifra, sua privacidade é nossa prioridade. Esta política descreve como coletamos, 
            usamos e protegemos suas informações pessoais.
          </Text>
          <Text className="text-sm text-gray-500 mt-2">
            Última atualização: {lastUpdated}
          </Text>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <BookOpen size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Introdução
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                A A Cifra ("nós", "nosso" ou "site") é comprometida com a proteção de sua privacidade 
                e dados pessoais. Esta Política de Privacidade descreve nossas práticas regarding 
                coleta, uso e compartilhamento de informações quando você acessa e utiliza nosso site 
                de educação sobre criptomoedas e blockchain.
              </p>
              <p>
                Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política. 
                Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD) e outras 
                regulamentações aplicáveis de proteção de dados.
              </p>
            </div>
          </section>

          {/* Information Collection */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Target size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Informações que Coletamos
              </Heading>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-brand-primary-blue mb-3">Informações Pessoais</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Nome e endereço de e-mail (quando você se inscreve em nossa newsletter)</li>
                  <li>Informações de contato (quando você entra em contato conosco)</li>
                  <li>Informações demográficas fornecidas voluntariamente</li>
                  <li>Preferências e interesses em conteúdos específicos</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-brand-primary-blue mb-3">Informações Técnicas</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Endereço IP e tipo de navegador</li>
                  <li>Sistema operacional e dispositivo utilizado</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Referência (site de origem)</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Target size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Como Usamos Suas Informações
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>Utilizamos suas informações para os seguintes propósitos:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Fornecer conteúdo educacional:</strong> Personalizar sua experiência e entregar 
                conteúdo relevante sobre criptomoedas e blockchain</li>
                <li><strong>Comunicação:</strong> Enviar newsletters, atualizações e responder às suas 
                solicitações de contato</li>
                <li><strong>Melhoria do site:</strong> Analisar padrões de uso para melhorar nossos 
                serviços e conteúdo</li>
                <li><strong>Segurança:</strong> Proteger nosso site e usuários contra atividades maliciosas</li>
                <li><strong>Cumprimento legal:</strong> Atender a obrigações legais e regulatórias</li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Lock size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Proteção de Dados
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Implementamos medidas técnicas e organizacionais robustas para proteger suas 
                informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Criptografia SSL/TLS para todas as transmissões de dados</li>
                <li>Servidores seguros com acesso restrito</li>
                <li>Backups regulares e planos de recuperação</li>
                <li>Atualizações constantes de segurança</li>
                <li>Treinamento da equipe sobre proteção de dados</li>
              </ul>
              <div className="bg-brand-light-blue/10 rounded-lg p-4 mt-4">
                <p className="text-sm">
                  <strong>Nota:</strong> Nenhum site pode garantir 100% de segurança, mas nos 
                  comprometemos a manter as mais altas padrões de proteção disponíveis.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Alert size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Cookies e Tecnologias Similares
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Cookies Essenciais</h4>
                  <p className="text-sm">Necessários para o funcionamento básico do site.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cookies de Desempenho</h4>
                  <p className="text-sm">Coletam informações sobre como você usa nosso site.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cookies de Funcionalidade</h4>
                  <p className="text-sm">Lembram suas preferências e personalizações.</p>
                </div>
              </div>
              <p>
                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </div>
          </section>

          {/* Third Party Services */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Alert size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Serviços de Terceiros
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Nosso site pode utilizar serviços de terceiros que coletam informações independentemente:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento do usuário</li>
                <li><strong>Plataformas de e-mail:</strong> Para envio de newsletters e comunicações</li>
                <li><strong>Redes sociais:</strong> Para compartilhamento e integração social</li>
              </ul>
              <p>
                Esses serviços têm suas próprias políticas de privacidade e não estão sob nosso controle direto.
              </p>
            </div>
          </section>

          {/* User Rights */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Shield size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Seus Direitos (LGPD)
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                De acordo com a Lei Geral de Proteção de Dados, você tem os seguintes direitos:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Confirmar a existência</strong> de tratamento de seus dados</li>
                <li><strong>Acessar seus dados</strong> pessoais</li>
                <li><strong>Corrigir informações</strong> incompletas ou inexatas</li>
                <li><strong>Solicitar exclusão</strong> de dados desnecessários</li>
                <li><strong>Portabilidade dos dados</strong> para outro fornecedor</li>
                <li><strong>Informações sobre compartilhamento</strong> com terceiros</li>
                <li><strong>Revogar consentimento</strong> a qualquer momento</li>
              </ul>
              <p>
                Para exercer esses direitos, entre em contato conosco através das informações 
                fornecidas ao final desta política.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-brand-dark-blue rounded-xl p-8 text-white">
            <Heading level={2} className="text-2xl mb-6 text-center">
              Entre em Contato
            </Heading>
            <div className="text-center space-y-4">
              <p>
                Para dúvidas, preocupações ou exercer seus direitos de proteção de dados, 
                entre em contato conosco:
              </p>
              <div className="space-y-2">
                <p><strong>E-mail:</strong> privacidade@acifra.com.br</p>
                <p><strong>Site:</strong> www.acifra.com.br</p>
                <p><strong>Resposta:</strong> Até 15 dias úteis</p>
              </div>
              <div className="mt-6">
                <a
                  href="/contatos"
                  className="inline-block px-6 py-3 bg-brand-gold text-brand-dark-blue rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
                >
                  Fale Conosco
                </a>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-brand-gold">
                <Clock size="20" />
              </div>
              <h3 className="font-semibold text-brand-primary-blue">
                Atualizações desta Política
              </h3>
            </div>
            <p className="text-gray-700 text-sm">
              Podemos atualizar esta política periodicamente para refletir mudanças em nossas 
              práticas ou por requisitos legais. Notificaremos usuários sobre alterações 
              significativas através de nosso site ou e-mail.
            </p>
          </section>
        </div>
      </Container>
    </MainLayout>
  )
}
