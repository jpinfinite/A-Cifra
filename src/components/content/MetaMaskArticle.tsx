'use client'

import Image from 'next/image'
import { AlertBox } from './AlertBox'
import { TipBox } from './TipBox'
import { WarningBox } from './WarningBox'
import { InfoBox } from './InfoBox'

export const MetaMaskArticle = () => {
  return (
    <article id="article-content" className="prose prose-lg max-w-none">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          MetaMask: Guia Completo da Carteira Cripto Mais Popular do Mundo
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Aprenda tudo sobre a MetaMask e domine o universo das criptomoedas com segurança.
        </p>
      </header>

      <figure className="my-8 rounded-xl overflow-hidden shadow-lg">
        <Image 
          src="/images/security/wallet.png" 
          alt="MetaMask - Carteira de criptomoedas para Ethereum e Web3" 
          width={1200}
          height={630}
          priority
          className="w-full h-auto"
        />
        <figcaption className="text-center text-sm text-gray-600 mt-3 px-4">
          MetaMask: Sua porta de entrada para o mundo Web3
        </figcaption>
      </figure>

      <section className="mb-12">
        <h2 id="o-que-e-metamask">O Que é MetaMask?</h2>
        <p>
          A <strong>MetaMask</strong> é a carteira de criptomoedas mais popular do mundo, com mais de 
          <strong> 30 milhões de usuários ativos</strong> mensalmente. Lançada em 2016, ela revolucionou 
          a forma como interagimos com aplicativos descentralizados (dApps) e o ecossistema Web3.
        </p>

        <InfoBox title="Por que MetaMask é tão popular?" icon="🌟" variant="highlight">
          <ul className="space-y-2 mt-2">
            <li>✅ <strong>Gratuita e open-source</strong></li>
            <li>✅ <strong>Fácil de usar</strong> - Interface intuitiva para iniciantes</li>
            <li>✅ <strong>Multi-plataforma</strong> - Extensão de navegador e app mobile</li>
            <li>✅ <strong>Compatível com múltiplas redes</strong> - Ethereum, BSC, Polygon, Arbitrum e mais</li>
            <li>✅ <strong>Integração com dApps</strong> - Acesso direto a DeFi, NFTs e Web3</li>
          </ul>
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 id="como-instalar">Como Instalar a MetaMask</h2>
        
        <h3 id="instalacao-desktop">Instalação no Desktop (Extensão do Navegador)</h3>
        <p>
          A MetaMask está disponível como extensão para os principais navegadores:
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 my-6 border-2 border-blue-200">
          <h4 className="font-bold text-lg mb-4 text-blue-900">📥 Passo a Passo da Instalação:</h4>
          <ol className="space-y-3">
            <li>
              <strong>1. Acesse o site oficial:</strong>{' '}
              <a 
                href="https://metamask.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                metamask.io
              </a>
            </li>
            <li><strong>2. Clique em "Download"</strong> e selecione seu navegador</li>
            <li><strong>3. Adicione a extensão</strong> à sua loja de extensões</li>
            <li><strong>4. Clique no ícone da MetaMask</strong> na barra de ferramentas</li>
            <li><strong>5. Escolha "Criar uma nova carteira"</strong></li>
            <li><strong>6. Crie uma senha forte</strong> (mínimo 8 caracteres)</li>
            <li><strong>7. Anote sua seed phrase</strong> em local seguro (CRÍTICO!)</li>
          </ol>
        </div>

        <AlertBox variant="critical">
          <strong>🔐 CRÍTICO:</strong> Sua <strong>seed phrase</strong> (frase de recuperação) é a ÚNICA 
          forma de recuperar sua carteira. NUNCA compartilhe com ninguém e guarde em local seguro, 
          preferencialmente offline (papel, cofre, etc.).
        </AlertBox>

        <h3 id="instalacao-mobile">Instalação no Mobile</h3>
        <p>Para dispositivos móveis, baixe o app oficial:</p>
        <ul>
          <li>📱 <strong>iOS:</strong> App Store</li>
          <li>🤖 <strong>Android:</strong> Google Play Store</li>
        </ul>

        <WarningBox severity="medium" title="Atenção aos Golpes">
          <p>
            Existem <strong>aplicativos falsos</strong> que imitam a MetaMask. Sempre verifique:
          </p>
          <ul className="mt-2 space-y-1">
            <li>✓ Nome do desenvolvedor: <strong>MetaMask</strong></li>
            <li>✓ Número de downloads (milhões)</li>
            <li>✓ Avaliações e comentários</li>
            <li>✓ Baixe apenas das lojas oficiais</li>
          </ul>
        </WarningBox>
      </section>

      <section className="mb-12">
        <h2 id="configuracao-inicial">Configuração Inicial</h2>

        <h3 id="criar-senha">1. Criar uma Senha Forte</h3>
        <p>Sua senha protege o acesso local à carteira. Dicas para criar uma senha segura:</p>
        <TipBox title="Dicas de Segurança para Senha" icon="🔒">
          <ul className="space-y-2">
            <li>✓ Use no mínimo 12 caracteres</li>
            <li>✓ Combine letras maiúsculas, minúsculas, números e símbolos</li>
            <li>✓ Não use informações pessoais (nome, data de nascimento, etc.)</li>
            <li>✓ Use um gerenciador de senhas (1Password, Bitwarden, LastPass)</li>
            <li>✓ Nunca reutilize senhas de outras contas</li>
          </ul>
        </TipBox>

        <h3 id="seed-phrase">2. Seed Phrase (Frase de Recuperação)</h3>
        <p>
          A <strong>seed phrase</strong> é uma sequência de <strong>12 palavras</strong> que funciona 
          como a chave mestra da sua carteira.
        </p>

        <AlertBox variant="critical">
          <div className="space-y-3">
            <p><strong>⚠️ REGRAS DE OURO DA SEED PHRASE:</strong></p>
            <ol className="space-y-2">
              <li>1. <strong>NUNCA</strong> compartilhe com ninguém (nem suporte técnico)</li>
              <li>2. <strong>NUNCA</strong> digite em sites ou aplicativos suspeitos</li>
              <li>3. <strong>NUNCA</strong> tire foto ou salve em nuvem</li>
              <li>4. <strong>SEMPRE</strong> anote em papel e guarde em local seguro</li>
              <li>5. <strong>SEMPRE</strong> faça backup em múltiplos locais físicos</li>
            </ol>
          </div>
        </AlertBox>

        <InfoBox title="Como Armazenar sua Seed Phrase com Segurança" icon="🛡️" variant="premium">
          <ul className="space-y-2">
            <li>📝 Escreva em papel de qualidade (não se deteriora)</li>
            <li>🔐 Guarde em cofre ou local seguro</li>
            <li>📋 Faça cópias e distribua em locais diferentes</li>
            <li>🔩 Considere usar placas de metal (resistente a fogo/água)</li>
            <li>🏦 Cofre de banco para grandes quantias</li>
          </ul>
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 id="como-usar">Como Usar a MetaMask</h2>

        <h3 id="receber-cripto">Receber Criptomoedas</h3>
        <div className="bg-gray-50 rounded-lg p-6 my-4">
          <p className="font-semibold mb-3">Passos para receber cripto:</p>
          <ol className="space-y-2">
            <li>1. Abra a MetaMask</li>
            <li>2. Clique no nome da conta (topo da tela)</li>
            <li>3. Clique em "Copiar endereço" ou mostre o QR code</li>
            <li>4. Compartilhe o endereço com quem vai enviar</li>
          </ol>
        </div>

        <TipBox title="Verificação de Endereço" icon="✅">
          Sempre <strong>verifique os primeiros e últimos caracteres</strong> do endereço antes de 
          compartilhar. Existem malwares que substituem endereços copiados!
        </TipBox>

        <h3 id="enviar-cripto">Enviar Criptomoedas</h3>
        <div className="bg-gray-50 rounded-lg p-6 my-4">
          <p className="font-semibold mb-3">Passos para enviar cripto:</p>
          <ol className="space-y-2">
            <li>1. Clique em "Enviar"</li>
            <li>2. Cole o endereço de destino</li>
            <li>3. Digite o valor a enviar</li>
            <li>4. Revise a taxa de gas (pode ajustar)</li>
            <li>5. Confirme a transação</li>
          </ol>
        </div>

        <WarningBox severity="high" title="ATENÇÃO: Transações são Irreversíveis!">
          <p>
            Blockchain não tem "desfazer". <strong>Sempre verifique 3 vezes:</strong>
          </p>
          <ul className="mt-2 space-y-1">
            <li>✓ Endereço de destino está correto</li>
            <li>✓ Rede está correta (Ethereum, BSC, Polygon, etc.)</li>
            <li>✓ Valor está correto</li>
            <li>✓ Você tem saldo suficiente para gas</li>
          </ul>
        </WarningBox>

        <h3 id="adicionar-redes">Adicionar Novas Redes</h3>
        <p>
          A MetaMask suporta múltiplas redes compatíveis com EVM (Ethereum Virtual Machine):
        </p>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Rede</th>
                <th className="px-6 py-3 text-left">Chain ID</th>
                <th className="px-6 py-3 text-left">Moeda Nativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">Ethereum Mainnet</td>
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">ETH</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">Binance Smart Chain</td>
                <td className="px-6 py-4">56</td>
                <td className="px-6 py-4">BNB</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">Polygon</td>
                <td className="px-6 py-4">137</td>
                <td className="px-6 py-4">MATIC</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">Arbitrum One</td>
                <td className="px-6 py-4">42161</td>
                <td className="px-6 py-4">ETH</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">Optimism</td>
                <td className="px-6 py-4">10</td>
                <td className="px-6 py-4">ETH</td>
              </tr>
            </tbody>
          </table>
        </div>

        <TipBox title="Adicionar Rede Automaticamente" icon="⚡">
          Muitos dApps adicionam a rede automaticamente quando você tenta conectar. 
          Basta aprovar a solicitação na MetaMask!
        </TipBox>
      </section>

      <section className="mb-12">
        <h2 id="seguranca">Segurança: Proteja Seus Ativos</h2>

        <h3 id="golpes-comuns">Golpes Comuns e Como Evitar</h3>

        <WarningBox severity="high" title="🚨 GOLPES MAIS COMUNS">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-yellow-300 mb-2">1. Phishing (Sites Falsos)</h4>
              <p>Criminosos criam sites idênticos a plataformas legítimas.</p>
              <p className="mt-1"><strong>Como evitar:</strong> Sempre verifique a URL. Use bookmarks.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-yellow-300 mb-2">2. Falso Suporte Técnico</h4>
              <p>Golpistas se passam por suporte e pedem sua seed phrase.</p>
              <p className="mt-1"><strong>Como evitar:</strong> NUNCA compartilhe sua seed phrase. Suporte real NUNCA pede.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-yellow-300 mb-2">3. Airdrops Falsos</h4>
              <p>Tokens gratuitos que drenam sua carteira ao interagir.</p>
              <p className="mt-1"><strong>Como evitar:</strong> Não interaja com tokens desconhecidos. Revogue aprovações suspeitas.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-yellow-300 mb-2">4. Contratos Maliciosos</h4>
              <p>Smart contracts que roubam fundos ao aprovar.</p>
              <p className="mt-1"><strong>Como evitar:</strong> Sempre leia o que está aprovando. Use sites de verificação.</p>
            </div>
          </div>
        </WarningBox>

        <h3 id="boas-praticas">Boas Práticas de Segurança</h3>

        <InfoBox title="Checklist de Segurança MetaMask" icon="✅" variant="premium">
          <ul className="space-y-3">
            <li>
              <strong>✓ Use carteiras separadas:</strong>
              <ul className="ml-6 mt-1 space-y-1">
                <li>• Carteira "quente" para uso diário (pequenas quantias)</li>
                <li>• Carteira "fria" para armazenamento (grandes quantias)</li>
              </ul>
            </li>
            <li><strong>✓ Ative autenticação de dois fatores</strong> em exchanges conectadas</li>
            <li><strong>✓ Mantenha seu navegador atualizado</strong></li>
            <li><strong>✓ Use antivírus confiável</strong></li>
            <li><strong>✓ Revogue aprovações antigas</strong> regularmente (use revoke.cash)</li>
            <li><strong>✓ Desconecte de sites</strong> após usar</li>
            <li><strong>✓ Verifique transações</strong> antes de assinar</li>
            <li><strong>✓ Considere hardware wallet</strong> para grandes valores (Ledger, Trezor)</li>
          </ul>
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 id="recursos-avancados">Recursos Avançados</h2>

        <h3 id="swap">Swap de Tokens</h3>
        <p>
          A MetaMask possui um <strong>agregador de DEX integrado</strong> que busca as melhores 
          taxas em múltiplas exchanges descentralizadas.
        </p>

        <TipBox title="Economize em Taxas de Swap" icon="💰">
          <ul className="space-y-1">
            <li>• Compare taxas antes de confirmar</li>
            <li>• Ajuste a tolerância de slippage (cuidado com valores muito altos)</li>
            <li>• Faça swaps em horários de menor congestionamento</li>
            <li>• Use Layer 2 (Arbitrum, Optimism) para taxas menores</li>
          </ul>
        </TipBox>

        <h3 id="bridge">Bridge Entre Redes</h3>
        <p>
          Transfira ativos entre diferentes blockchains usando bridges integrados ou externos.
        </p>

        <WarningBox severity="medium" title="Cuidado com Bridges">
          Bridges são alvos frequentes de hackers. Use apenas bridges confiáveis e auditados. 
          Nunca transfira mais do que está disposto a perder.
        </WarningBox>

        <h3 id="portfolio">Portfolio Tracker</h3>
        <p>
          Visualize todo seu portfólio em um só lugar, com valores atualizados em tempo real.
        </p>
      </section>

      <section className="mb-12">
        <h2 id="defi-nfts">Usando com DeFi e NFTs</h2>

        <h3 id="conectar-dapps">Conectar a dApps</h3>
        <div className="bg-gray-50 rounded-lg p-6 my-4">
          <p className="font-semibold mb-3">Como conectar a um dApp:</p>
          <ol className="space-y-2">
            <li>1. Acesse o site do dApp</li>
            <li>2. Clique em "Connect Wallet"</li>
            <li>3. Selecione "MetaMask"</li>
            <li>4. Aprove a conexão na MetaMask</li>
            <li>5. Pronto! Você está conectado</li>
          </ol>
        </div>

        <h3 id="nfts">Gerenciar NFTs</h3>
        <p>
          A MetaMask permite visualizar e gerenciar seus NFTs diretamente na carteira.
        </p>

        <TipBox title="Visualizar NFTs" icon="🖼️">
          Vá em "NFTs" na aba principal. Se algum NFT não aparecer, você pode adicionar manualmente 
          usando o endereço do contrato e o ID do token.
        </TipBox>
      </section>

      <section className="mb-12">
        <h2 id="solucao-problemas">Solução de Problemas Comuns</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="font-bold text-lg mb-2">Transação Pendente Há Muito Tempo</h4>
            <p><strong>Solução:</strong> Aumente a taxa de gas ou cancele/acelere a transação nas configurações avançadas.</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="font-bold text-lg mb-2">Saldo Não Aparece</h4>
            <p><strong>Solução:</strong> Verifique se está na rede correta. Adicione o token manualmente se necessário.</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="font-bold text-lg mb-2">Erro "Insufficient Funds"</h4>
            <p><strong>Solução:</strong> Você precisa de ETH (ou moeda nativa da rede) para pagar gas, mesmo enviando outros tokens.</p>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h4 className="font-bold text-lg mb-2">MetaMask Não Conecta ao Site</h4>
            <p><strong>Solução:</strong> Limpe o cache do navegador, desabilite outras extensões de carteira, ou reinstale a MetaMask.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 id="conclusao">Conclusão</h2>
        <p>
          A <strong>MetaMask</strong> é uma ferramenta essencial para qualquer pessoa que queira 
          explorar o mundo das criptomoedas, DeFi e Web3. Com este guia, você tem todo o conhecimento 
          necessário para usar a carteira com segurança e aproveitar ao máximo seus recursos.
        </p>

        <InfoBox title="Próximos Passos" icon="🚀" variant="highlight">
          <ul className="space-y-2">
            <li>✓ Configure sua MetaMask seguindo as melhores práticas de segurança</li>
            <li>✓ Comece com pequenas quantias para praticar</li>
            <li>✓ Explore dApps confiáveis e auditados</li>
            <li>✓ Mantenha-se atualizado sobre segurança cripto</li>
            <li>✓ Considere hardware wallet para valores maiores</li>
          </ul>
        </InfoBox>

        <AlertBox variant="info">
          <strong>💡 Lembre-se:</strong> No mundo cripto, <strong>você é seu próprio banco</strong>. 
          Com grande poder vem grande responsabilidade. Sempre priorize a segurança!
        </AlertBox>
      </section>
    </article>
  )
}
