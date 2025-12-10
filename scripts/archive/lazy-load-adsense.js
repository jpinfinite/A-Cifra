/**
 * Script para implementar lazy loading do Google AdSense
 * Carrega anúncios apenas quando estão próximos da viewport
 */

const fs = require('fs').promises
const path = require('path')

const ADSENSE_LAZY_LOAD_SCRIPT = `
<!-- Lazy Load AdSense Script -->
<script>
  (function() {
    'use strict';
    
    // Configuração
    const ADSENSE_CLIENT = 'ca-pub-1151448515464841';
    const INTERSECTION_MARGIN = '200px'; // Carregar 200px antes de entrar na viewport
    
    let adsenseLoaded = false;
    
    // Função para carregar o script do AdSense
    function loadAdSense() {
      if (adsenseLoaded) return;
      
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = function() {
        console.log('✅ AdSense carregado via lazy loading');
        // Inicializar anúncios visíveis
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(function(ad) {
          if (!ad.dataset.adsbygoogleStatus) {
            try {
              (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
              console.error('Erro ao inicializar anúncio:', e);
            }
          }
        });
      };
      
      document.head.appendChild(script);
      adsenseLoaded = true;
    }
    
    // Observer para detectar quando anúncios entram na viewport
    const observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            loadAdSense();
            observer.disconnect(); // Desconectar após carregar
          }
        });
      },
      {
        rootMargin: INTERSECTION_MARGIN
      }
    );
    
    // Observar todos os slots de anúncio
    function observeAds() {
      const ads = document.querySelectorAll('.adsbygoogle');
      if (ads.length > 0) {
        ads.forEach(function(ad) {
          observer.observe(ad);
        });
      } else {
        // Se não houver anúncios, carregar após 3 segundos
        setTimeout(loadAdSense, 3000);
      }
    }
    
    // Iniciar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeAds);
    } else {
      observeAds();
    }
  })();
</script>
`

async function createLazyLoadScript() {
  const outputPath = path.join(process.cwd(), 'public', 'scripts', 'lazy-adsense.js')
  
  // Criar diretório se não existir
  const dir = path.dirname(outputPath)
  await fs.mkdir(dir, { recursive: true })
  
  // Extrair apenas o JavaScript
  const jsContent = ADSENSE_LAZY_LOAD_SCRIPT
    .replace(/<script>/g, '')
    .replace(/<\/script>/g, '')
    .replace(/<!-- Lazy Load AdSense Script -->/g, '')
    .trim()
  
  await fs.writeFile(outputPath, jsContent)
  
  console.log('✅ Script de lazy loading criado:', outputPath)
  console.log('\n📝 Para usar, adicione no seu layout:')
  console.log('<script src="/scripts/lazy-adsense.js" defer></script>')
  console.log('\n⚠️  Remova o script direto do AdSense do <head>')
}

createLazyLoadScript().catch(console.error)
