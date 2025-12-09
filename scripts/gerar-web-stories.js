const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');
const STORIES_DIR = path.join(__dirname, '../src/app/web-stories');
const SITE_URL = 'https://a-cifra.com.br';

function generateStoryFile(slug, data, content) {
    // Tenta encontrar a imagem
    let imageUrl = data.image || '';

    // Se não tiver imagem definida, tenta inferir pelo slug
    if (!imageUrl) {
        const potentialJpg = path.join(__dirname, '../public/images/articles', `${slug}.jpg`);
        const potentialPng = path.join(__dirname, '../public/images/articles', `${slug}.png`);

        if (fs.existsSync(potentialJpg)) imageUrl = `/images/articles/${slug}.jpg`;
        else if (fs.existsSync(potentialPng)) imageUrl = `/images/articles/${slug}.png`;
    }

    // Se ainda não tiver imagem, pula (Story sem imagem é ruim)
    if (!imageUrl) {
        console.log(`⚠️  Pulando [${slug}]: Sem imagem detectada.`);
        return false;
    }

    // Garante URL completa para AMP (AMP exige URL absoluta em alguns casos ou validação melhor)
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;
    const articleUrl = `${SITE_URL}/artigo/${slug}`;
    const cleanTitle = (data.title || slug).replace(/"/g, ''); // Remove aspas para não quebrar string
    const description = (data.excerpt || content.slice(0, 150)).replace(/"/g, '').replace(/\n/g, ' ').slice(0, 200) + '...';

    const tsxContent = `
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "${cleanTitle} - Web Story",
  description: "${description}",
}

export default function WebStoryPage() {
  const story = {
    title: "${cleanTitle}",
    publisher: "A Cifra",
    publisherLogo: "${SITE_URL}/logo-icon.png",
    posterPortrait: "${fullImageUrl}",
    link: "${articleUrl}"
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`
        amp-story-page { background-color: #000; }
        h1 { font-family: 'Roboto', sans-serif; font-weight: 900; font-size: 2.2em; color: white; text-shadow: 2px 2px 5px rgba(0,0,0,0.9); line-height: 1.1; text-align: center; }
        p { font-family: 'Roboto', sans-serif; font-size: 1.1em; color: #f0f0f0; background: rgba(0,0,0,0.7); padding: 15px; border-radius: 8px; line-height: 1.4; }
        .btn-ler { background: #Eab308; color: black; font-weight: 800; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin-top: 20px; font-family: sans-serif; font-size: 1.2em; text-transform: uppercase; box-shadow: 0 4px 15px rgba(234, 179, 8, 0.4); }
        .overlay { background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%); }
      \`}} />

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
            <amp-img src={story.posterPortrait} width="720" height="1280" layout="responsive" alt="Capa"></amp-img>
          </amp-story-grid-layer>
          <amp-story-grid-layer template="vertical" className="bottom">
            <div className="overlay" style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', paddingTop: '100px'}}>
               <h1 style={{fontSize: '32px', marginBottom: '10px'}}>{story.title}</h1>
               <div style={{width: '60px', height: '4px', background: '#Eab308', margin: '0 auto 20px auto'}}></div>
               <p style={{background: 'transparent', textAlign: 'center', fontSize: '14px', color: '#ccc'}}>TOQUE PARA VER ➜</p>
            </div>
          </amp-story-grid-layer>
        </amp-story-page>

        {/* CONTEUDO */}
        <amp-story-page id="page2" style={{backgroundColor: '#111'}}>
          <amp-story-grid-layer template="fill">
             <amp-img src={story.posterPortrait} width="720" height="1280" layout="responsive" style={{opacity: 0.2, filter: 'blur(5px)'}}></amp-img>
          </amp-story-grid-layer>
          <amp-story-grid-layer template="vertical">
            <div style={{padding: '30px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center'}}>
               <h2 style={{color: '#Eab308', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', fontFamily: 'sans-serif'}}>Resumo</h2>
               <p>{story.description.length > 200 ? story.description.slice(0, 200) + '...' : story.description}</p>
            </div>
          </amp-story-grid-layer>
        </amp-story-page>

        {/* FINAL - CTA */}
        <amp-story-page id="page3">
          <amp-story-grid-layer template="fill">
             <amp-img src={story.posterPortrait} width="720" height="1280" layout="responsive" style={{opacity: 0.4}}></amp-img>
          </amp-story-grid-layer>
          <amp-story-grid-layer template="vertical" className="center-text">
            <div style={{textAlign: 'center', marginTop: '45%'}}>
              <h1 style={{fontSize: '28px'}}>Gostou?</h1>
              <p style={{background: 'transparent'}}>Leia a matéria completa no site</p>
              <br/>
              <amp-story-page-outlink layout="nodisplay">
                <a href={story.link}>Ler Artigo Completo</a>
              </amp-story-page-outlink>
               <a href={story.link} className="btn-ler">
                 LER TUDO
               </a>
            </div>
          </amp-story-grid-layer>
        </amp-story-page>
      </amp-story>
    </>
  )
}
`;

    return tsxContent;
}

function main() {
    console.log('⚡ Iniciando Gerador de Web Stories...');

    if (!fs.existsSync(STORIES_DIR)) {
        fs.mkdirSync(STORIES_DIR);
    }

    const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
    let count = 0;

    for (const file of files) {
        const slug = file.replace('.md', '');
        const filePath = path.join(ARTICLES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Define diretório da story: src/app/web-stories/[slug]
        const storyDir = path.join(STORIES_DIR, slug);

        // Verifica se já existe (opcional: forçar overwrite)
        const storyFile = path.join(storyDir, 'page.tsx');

        // Cria pasta se não existir
        if (!fs.existsSync(storyDir)) {
            fs.mkdirSync(storyDir, { recursive: true });
        }

        const tsx = generateStoryFile(slug, data, content);

        if (tsx) {
            fs.writeFileSync(storyFile, tsx, 'utf8');
            console.log(`✅ Story criada: ${slug}`);
            count++;
        }
    }

    console.log(`\n🎉 Total de Web Stories geradas: ${count}`);
}

main();
