const https = require('https');

const urls = [
  'https://a-cifra.com.br/',
  'https://a-cifra.com.br/artigo/bitcoin-rumo-aos-200k-o-que-esperar-do-primeiro-trimestre-de-2025', // Um artigo que deve existir
  'https://a-cifra.com.br/robots.txt',
  'https://a-cifra.com.br/sitemap.xml'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`\nURL: ${url}`);
    console.log(`Status: ${res.statusCode}`);
    console.log('Headers:');
    console.log(`  x-robots-tag: ${res.headers['x-robots-tag']}`);
    console.log(`  content-type: ${res.headers['content-type']}`);

    // Ler o corpo para procurar meta tag robots
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const robotsMeta = data.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
      if (robotsMeta) {
        console.log(`META ROBOTS TAG: ${robotsMeta[1]}`);
      } else {
        console.log('META ROBOTS TAG: Não encontrada');
      }
    });
  }).on('error', (e) => {
    console.error(`Erro ao acessar ${url}:`, e);
  });
});
