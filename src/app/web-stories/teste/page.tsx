
import { Metadata } from 'next'

// Metadados para o Google encontrar a Story
export const metadata: Metadata = {
  title: 'BlackRock e ETF de Ether em Staking - A Cifra Web Stories',
  description: 'Confira os detalhes sobre o pedido de ETF da BlackRock.',
}

export default function WebStoryPage() {
  // Dados da Story (Simulados)
  const story = {
    title: "BlackRock: ETF de Ether com Staking",
    publisher: "A Cifra",
    publisherLogo: "https://a-cifra.com.br/images/logo-icon.png", // Ajustar se necessário
    posterPortrait: "https://a-cifra.com.br/images/articles/blackrock-entra-com-pedido-de-listagem-de-etf-de-ether-em-staking.jpg",
    link: "https://a-cifra.com.br/artigo/blackrock-entra-com-pedido-de-listagem-de-etf-de-ether-em-staking"
  }

  // HTML da AMP Story
  // Nota: Web Stories exigem uma estrutura HTML específica e scripts AMP no Head.
  // Como estamos no App Router, vamos retornar null aqui e injetar o HTML via Response ou usar um truque.
  // Mas o jeito mais limpo no Next App Router para AMP puro é retornar o HTML direto.

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        amp-story-page { background-color: #000; }
        h1 { font-family: 'Roboto', sans-serif; font-weight: 900; font-size: 2.5em; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); line-height: 1.1; }
        p { font-family: 'Roboto', sans-serif; font-size: 1.1em; color: #f0f0f0; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 8px; }
        .btn { background: #Eab308; color: black; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 30px; display: inline-block; margin-top: 20px; font-family: sans-serif; }
      `}} />

      {/* Scripts AMP (Devem estar no Head, mas aqui funciona em alguns parsers ou via layout específico, mas para teste vamos assim) */}
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>

      <amp-story
        standalone=""
        title={story.title}
        publisher={story.publisher}
        publisher-logo-src={story.publisherLogo}
        poster-portrait-src={story.posterPortrait}
      >
        {/* CAPA */}
        <amp-story-page id="cover">
          <amp-story-grid-layer template="fill">
            <amp-img
              src={story.posterPortrait}
              width="720"
              height="1280"
              layout="responsive"
              alt="Capa BlackRock"
            />
          </amp-story-grid-layer>
          <amp-story-grid-layer template="vertical" className="bottom">
            <div style={{position: 'absolute', bottom: '20px', left: '20px', right: '20px'}}>
               <h1 style={{fontSize: '28px', color: 'white', textShadow: '0 2px 10px black'}}>{story.title}</h1>
               <p style={{color: '#ddd', fontSize: '14px'}}>Toque para saber mais</p>
            </div>
          </amp-story-grid-layer>
        </amp-story-page>

        {/* PAGINA 2: Resumo */}
        <amp-story-page id="page2" style={{backgroundColor: '#111'}}>
          <amp-story-grid-layer template="vertical">
            <div style={{padding: '20px', paddingTop: '40px'}}>
               <h1 style={{fontSize: '24px', color: '#Eab308'}}>O que aconteceu?</h1>
               <p style={{marginTop: '20px', fontSize: '16px', lineHeight: '1.5'}}>
                 A BlackRock protocolou um pedido para listar um ETF de Ethereum que inclui recompensas de Staking.
                 Isso pode mudar o jogo para investidores institucionais.
               </p>
            </div>
          </amp-story-grid-layer>
        </amp-story-page>

        {/* PAGINA FINAL: Call to Action */}
        <amp-story-page id="page3">
          <amp-story-grid-layer template="fill">
             <amp-img src={story.posterPortrait} width="720" height="1280" layout="responsive" style={{opacity: 0.3}}></amp-img>
          </amp-story-grid-layer>
          <amp-story-grid-layer template="vertical" className="center-text">
            <div style={{textAlign: 'center', marginTop: '40%'}}>
              <h1>Leia a matéria completa</h1>
              <p>Descubra como isso afeta o preço do ETH.</p>
              <br/>
              <amp-story-page-outlink layout="nodisplay">
                <a href={story.link}>Ler no Site</a>
              </amp-story-page-outlink>
              {/* Fallback visual button */}
               <a href={story.link} className="btn">
                 LER AGORA ➜
               </a>
            </div>
          </amp-story-grid-layer>
        </amp-story-page>
      </amp-story>
    </>
  )
}
