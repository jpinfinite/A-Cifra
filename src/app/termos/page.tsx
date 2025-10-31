import { Metadata } from 'next'
import { MainLayout } from '@/components/layout'
import { Container, Heading, Text } from '@/components/ui'
import { Alert, BookOpen, Target, Shield, TrendingUp, Lock } from '@/components/icons/SocialIcons'

export const metadata: Metadata = {
  title: 'Termos de Uso | A Cifra',
  description: 'Termos de uso e condições do site A Cifra. Conheça as regras e diretrizes para utilizar nosso conteúdo educacional sobre criptomoedas e blockchain.',
  keywords: ['termos de uso', 'condições de uso', 'responsabilidade', 'conteúdo educacional', 'disclaimer', 'risco investimento'],
}

export default function TermosPage() {
  const lastUpdated = new Date('2025-10-27').toLocaleDateString('pt-BR')

  return (
    <MainLayout>
      <Container className="py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="text-brand-gold">
              <BookOpen size="48" />
            </div>
          </div>
          <Heading level={1} className="mb-4">
            Termos de Uso
          </Heading>
          <Text className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bem-vindo à A Cifra. Estes termos de uso regem seu acesso e utilização 
            de nosso conteúdo educacional sobre criptomoedas e blockchain.
          </Text>
          <Text className="text-sm text-gray-500 mt-2">
            Última atualização: {lastUpdated}
          </Text>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-red-600 flex-shrink-0 mt-1">
                <Alert size="24" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-2">
                  Aviso Importante
                </h3>
                <p className="text-red-700 text-sm">
                  Leia atentamente estes termos antes de utilizar nosso site. 
                  Ao acessar ou usar a A Cifra, você concorda com estas condições.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance of Terms */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Target size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Aceitação dos Termos
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Ao acessar e utilizar o site A Cifra ("Site"), você aceita e concorda em cumprir 
                estes Termos de Uso ("Termos"). Se você não concorda com estes termos, 
                não utilize nosso site.
              </p>
              <p>
                A A Cifra pode atualizar estes termos periodicamente. Continuar utilizando 
                o site após alterações constitui aceitação dos novos termos.
              </p>
            </div>
          </section>

          {/* Educational Purpose */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <BookOpen size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Finalidade Educacional
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                A A Cifra é uma plataforma educacional com o objetivo de fornecer informações, 
                análises e conteúdo educacional sobre criptomoedas, blockchain e tecnologias 
                relacionadas.
              </p>
              <div className="bg-brand-light-blue/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Nossos Objetivos:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Educar sobre tecnologia blockchain e criptomoedas</li>
                  <li>Compartilhar análises e pesquisas do setor</li>
                  <li>Facilitar o entendimento de conceitos complexos</li>
                  <li>Promover discussões informadas sobre o mercado</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Investment Disclaimer */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Alert size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Disclaimer de Investimento
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">
                  ⚠️ NÃO CONSTITUÍMOS CONSELHO DE INVESTIMENTO
                </h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Todo conteúdo tem caráter estritamente educacional</li>
                  <li>• Não recomendamos compra ou venda de nenhum ativo</li>
                  <li>• Não garantimos resultados ou retornos</li>
                  <li>• Não somos responsáveis por decisões de investimento</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Riscos Envolvidos:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Volatilidade extrema:</strong> Criptomoedas podem perder valor rapidamente</li>
                  <li><strong>Risco de perda total:</strong> Possibilidade de perder 100% do investimento</li>
                  <li><strong>Risco regulatório:</strong> Mudanças podem afetar o valor dos ativos</li>
                  <li><strong>Risco tecnológico:</strong> Falhas técnicas podem comprometer ativos</li>
                  <li><strong>Risco de liquidez:</strong> Dificuldade em vender ativos rapidamente</li>
                </ul>
              </div>
              
              <div className="bg-brand-light-blue/10 rounded-lg p-4">
                <p className="text-sm font-medium">
                  <strong>Faça sua própria pesquisa (DYOR)</strong> antes de tomar qualquer 
                  decisão de investimento. Consulte sempre profissionais qualificados.
                </p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Shield size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Responsabilidades do Usuário
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Ao utilizar nosso site, você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Uso responsável:</strong> Utilizar o conteúdo para fins educacionais</li>
                <li><strong>Verificação:</strong> Confirmar informações antes de tomar decisões</li>
                <li><strong>Compliance legal:</strong> Cumprir leis locais aplicáveis</li>
                <li><strong>Não reprodução não autorizada:</strong> Respeitar direitos autorais</li>
                <li><strong>Conduta adequada:</strong> Não realizar atividades maliciosas</li>
                <li><strong>Privacidade:</strong> Respeitar privacidade de outros usuários</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Proibições
                </h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                  <li>• Copiar ou distribuir conteúdo sem permissão</li>
                  <li>• Tentar acessar sistemas não autorizados</li>
                  <li>• Utilizar bots ou scrapers excessivos</li>
                  <li>• Publicar conteúdo ilegal ou ofensivo</li>
                  <li>• Impersonar nossa equipe ou marca</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <BookOpen size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Propriedade Intelectual
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Todo conteúdo do site A Cifra é protegido por direitos autorais e outras 
                leis de propriedade intelectual:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Conteúdo original:</strong> Artigos, análises e materiais educacionais</li>
                <li><strong>Design e layout:</strong> Interface visual e experiência do usuário</li>
                <li><strong>Marca e identidade:</strong> Logo, nome "A Cifra" e elementos visuais</li>
                <li><strong>Base de dados:</strong> Estrutura e organização das informações</li>
              </ul>
              
              <div className="bg-brand-light-blue/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Permissões de Uso:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Leitura e estudo pessoal do conteúdo</li>
                  <li>Compartilhamento de links (não do conteúdo)</li>
                  <li>Citação com crédito adequado (até 200 palavras)</li>
                  <li>Uso educacional em ambiente acadêmico (com permissão)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Alert size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Limitação de Responsabilidade
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Na máxima extensão permitida por lei:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Não somos responsáveis por decisões de investimento baseadas em nosso conteúdo</li>
                <li>Não garantimos a precisão ou atualidade das informações</li>
                <li>Não somos responsáveis por perdas financeiras diretas ou indiretas</li>
                <li>Não garantimos disponibilidade contínua do site</li>
                <li>Não somos responsáveis por conteúdo de terceiros linkados</li>
              </ul>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">
                  <strong>Importante:</strong> O mercado de criptomoedas é extremamente volátil 
                  e arriscado. Nunca invista mais do que pode perder. Consulte sempre 
                  profissionais qualificados antes de investir.
                </p>
              </div>
            </div>
          </section>

          {/* Third Party Links */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <TrendingUp size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Links de Terceiros
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Nosso site pode conter links para sites de terceiros. Não somos responsáveis 
                pelo conteúdo, práticas de privacidade ou termos de uso desses sites.
              </p>
              <p>
                A inclusão de links não constitui endosso ou recomendação dos serviços 
                ou produtos oferecidos. Verifique independentemente a credibilidade 
                e segurança de qualquer site terceiro.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Lock size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Rescisão e Suspensão
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Reservamo-nos o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Suspender ou encerrar acesso de usuários que violem estes termos</li>
                <li>Remover conteúdo que considere inadequado</li>
                <li>Modificar ou descontinuar serviços a qualquer momento</li>
                <li>Atualizar estes termos sem aviso prévio</li>
              </ul>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-brand-gold">
                <Shield size="24" />
              </div>
              <Heading level={2} className="text-xl">
                Lei Aplicável e Jurisdição
              </Heading>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa será resolvida nos tribunais brasileiros, 
                preferencialmente no foro da comarca de São Paulo/SP.
              </p>
              <p>
                Se alguma disposição destes termos for considerada inválida ou inexequível, 
                as demais disposições permanecerão em pleno vigor e efeito.
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
                Para dúvidas sobre estes Termos de Uso ou para reportar violações:
              </p>
              <div className="space-y-2">
                <p><strong>E-mail:</strong> legal@acifra.com.br</p>
                <p><strong>Site:</strong> www.acifra.com.br</p>
                <p><strong>Resposta:</strong> Até 10 dias úteis</p>
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

          {/* Final Disclaimer */}
          <section className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-brand-gold flex-shrink-0 mt-1">
                <Alert size="20" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-primary-blue mb-2">
                  Lembre-se
                </h3>
                <p className="text-gray-700 text-sm">
                  Este site tem finalidade educacional. O mercado de criptomoedas é 
                  extremamente arriscado e volátil. Nunca invista dinheiro que não 
                  pode perder. Faça sempre sua própria pesquisa.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </MainLayout>
  )
}
