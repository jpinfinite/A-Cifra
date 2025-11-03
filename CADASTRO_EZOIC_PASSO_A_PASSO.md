# 🎯 Como Cadastrar no Ezoic - Guia Completo

## 📋 O que é Ezoic?
- Plataforma de monetização com anúncios
- Alternativa ao Google AdSense
- Usa IA para otimizar posicionamento de anúncios
- Pode ganhar mais que AdSense em alguns casos
- Requisitos menores que AdSense

---

## ✅ Pré-requisitos
- [ ] Site publicado e acessível
- [ ] Domínio próprio (a-cifra.com.br) ✅
- [ ] Mínimo 10.000 visitas/mês (recomendado)
- [ ] Conteúdo original de qualidade ✅
- [ ] Política de privacidade ✅
- [ ] Páginas: Sobre, Contato, Termos ✅

---

## 🚀 PASSO A PASSO - Seguindo suas Imagens

### ✅ Passo 1: Complete Account Setup (JÁ FEITO)
Você já completou esta etapa! ✅

### 🔧 Passo 2: Connect Your Site (VOCÊ ESTÁ AQUI)

#### Opção Recomendada: JavaScript Integration

**Por que JavaScript?**
- ✅ Setup rápido e simples
- ✅ Não precisa mexer no DNS
- ✅ Controle total e customização
- ✅ Scripts leves
- ✅ Funciona com Cloudflare

**Como fazer:**

1. **Clique em "VIEW INSTRUCTIONS"** (botão verde na sua imagem)

2. **Ezoic vai fornecer um código JavaScript**, algo como:
```html
<script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
```

3. **Adicionar o código no seu site Next.js**

---

## 💻 IMPLEMENTAÇÃO NO SEU PROJETO

### Método 1: Adicionar no layout.tsx (RECOMENDADO)

Vou criar o código para você adicionar:

**Arquivo: `src/app/layout.tsx`**

Adicione o script Ezoic no `<head>`:

```tsx
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Ezoic Integration */}
        <Script
          id="ezoic-integration"
          strategy="afterInteractive"
          src="//www.ezojs.com/ezoic/sa.min.js"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### Método 2: Adicionar via Google Tag Manager (Alternativa)

Se você usa GTM:
1. Crie uma nova tag
2. Tipo: Custom HTML
3. Cole o script do Ezoic
4. Trigger: All Pages
5. Publique

### Método 3: Adicionar no _document.tsx (Next.js Pages)

Se estiver usando Pages Router:

```tsx
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <Script
          id="ezoic-integration"
          strategy="afterInteractive"
          src="//www.ezojs.com/ezoic/sa.min.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

---

## 🔍 Verificar se Funcionou

### 1. Deploy no Cloudflare
```bash
git add .
git commit -m "feat: Adiciona integração Ezoic"
git push origin main
```

### 2. Aguardar Deploy (2-5 minutos)

### 3. Testar no Site
Abra: https://a-cifra.com.br

**Inspecionar elemento (F12):**
- Vá em "Network"
- Procure por "ezoic" ou "ezojs.com"
- Deve aparecer o script carregando

### 4. Voltar no Painel Ezoic
- Clique em "Verify Integration"
- Ezoic vai checar se o script está instalado
- Deve aparecer ✅ "Integration Successful"

---

## 📊 Passo 3: Apply for Ad Manager (MCM)

**O que é MCM?**
- Multiple Customer Management
- Acesso a anúncios premium
- Parceiros de demanda maiores
- Mais receita potencial

**Quando fazer:**
- ⏳ Após integração aprovada
- ⏳ Após site estar recebendo tráfego
- ⏳ Ezoic vai revisar seu site

**Como fazer:**
1. Aguarde integração ser aprovada
2. Clique em "GET STARTED" no MCM
3. Preencha informações adicionais
4. Aguarde aprovação (1-7 dias)

---

## ⚙️ Configurações Importantes no Ezoic

### 1. Ad Tester (Testador de Anúncios)
- Ativa IA para otimizar posições
- Testa diferentes layouts
- Maximiza receita automaticamente

**Como ativar:**
1. Dashboard → Ad Tester
2. Enable Ad Tester
3. Aguarde 7-14 dias para otimização

### 2. Placeholder Settings
Configure onde anúncios podem aparecer:
- ✅ Above the fold (acima da dobra)
- ✅ In-content (no meio do conteúdo)
- ✅ Sidebar
- ✅ Footer
- ❌ Evite: Muito perto de botões/links

### 3. Ad Density (Densidade de Anúncios)
- Baixa: Melhor UX, menos receita
- Média: Balanceado (RECOMENDADO)
- Alta: Mais receita, pior UX

### 4. GDPR/LGPD Compliance
- ✅ Ative consentimento de cookies
- ✅ Ezoic tem sistema próprio
- ✅ Compatível com sua política de privacidade

---

## 🎨 Otimizar para Ezoic

### 1. Adicionar Placeholders Manualmente (Opcional)

Você pode sugerir onde anúncios devem aparecer:

```tsx
// Componente de Placeholder Ezoic
export function EzoicPlaceholder({ id }: { id: number }) {
  return (
    <div 
      id={`ezoic-pub-ad-placeholder-${id}`}
      className="ezoic-ad"
    />
  )
}

// Usar no conteúdo
<article>
  <h1>Título da Cifra</h1>
  <EzoicPlaceholder id={101} />
  
  <p>Conteúdo...</p>
  
  <EzoicPlaceholder id={102} />
  
  <div className="cifra-content">
    {/* Cifra aqui */}
  </div>
  
  <EzoicPlaceholder id={103} />
</article>
```

### 2. Melhorar Core Web Vitals
Ezoic considera performance:
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1

### 3. Aumentar Pageviews
Mais páginas = mais receita:
- ✅ Cifras relacionadas
- ✅ Navegação fácil
- ✅ Busca interna
- ✅ CTAs para outras cifras

---

## 💰 Expectativas de Receita

### Fatores que Influenciam:
- 📊 Tráfego (visitas/mês)
- 🌍 Geografia (Brasil paga menos que EUA)
- 📱 Dispositivo (mobile vs desktop)
- ⏱️ Tempo no site
- 📄 Pageviews por sessão

### Estimativa Realista (Brasil):
- 10.000 visitas/mês: R$ 50-150
- 50.000 visitas/mês: R$ 250-750
- 100.000 visitas/mês: R$ 500-1.500
- 500.000 visitas/mês: R$ 2.500-7.500

**Nota:** Valores variam muito! Ezoic geralmente paga melhor que AdSense para sites menores.

---

## 🚨 Troubleshooting

### Problema: "Integration Not Detected"
**Soluções:**
1. Verifique se script está no `<head>`
2. Limpe cache do Cloudflare
3. Aguarde 10-15 minutos após deploy
4. Teste em modo anônimo
5. Verifique console do navegador (F12)

### Problema: "Site Not Eligible"
**Motivos comuns:**
- Tráfego muito baixo (< 10k/mês)
- Conteúdo duplicado
- Violação de políticas
- Site muito novo

**Soluções:**
- Aumentar tráfego com SEO
- Criar mais conteúdo original
- Aguardar 1-3 meses
- Revisar políticas do Ezoic

### Problema: "Ads Not Showing"
**Soluções:**
1. Ad Tester precisa de 24-48h para ativar
2. Verifique se passou na revisão
3. Alguns países têm menos anúncios
4. AdBlock pode estar ativo
5. Tráfego muito baixo

### Problema: "Revenue Too Low"
**Otimizações:**
1. Aumentar pageviews por sessão
2. Melhorar tempo no site
3. Ativar MCM (anúncios premium)
4. Ajustar densidade de anúncios
5. Criar conteúdo mais engajante

---

## 📋 Checklist Completo

### Antes de Começar
- [ ] Site publicado em a-cifra.com.br
- [ ] Política de privacidade ativa
- [ ] Conteúdo original de qualidade
- [ ] Mínimo 10-20 páginas
- [ ] Tráfego começando a crescer

### Durante Cadastro
- [ ] Conta Ezoic criada ✅
- [ ] Site adicionado
- [ ] Integração JavaScript escolhida
- [ ] Script copiado

### Implementação
- [ ] Script adicionado no layout.tsx
- [ ] Código commitado no Git
- [ ] Deploy feito no Cloudflare
- [ ] Site testado (F12 → Network)
- [ ] Integração verificada no Ezoic

### Após Aprovação
- [ ] Ad Tester ativado
- [ ] Placeholders configurados
- [ ] Densidade ajustada
- [ ] GDPR/LGPD ativado
- [ ] MCM solicitado

### Otimização Contínua
- [ ] Monitorar receita diária
- [ ] Ajustar posições de anúncios
- [ ] Melhorar Core Web Vitals
- [ ] Aumentar pageviews
- [ ] Testar diferentes layouts

---

## 🎯 Próximos Passos AGORA

### 1. Clique em "VIEW INSTRUCTIONS" (Imagem 2)
- Copie o código JavaScript fornecido

### 2. Me envie o código
- Vou adicionar no seu projeto automaticamente

### 3. Ou me diga para adicionar
- Posso adicionar o código padrão agora
- Você ajusta depois se necessário

---

## 📞 Suporte Ezoic

- Dashboard: https://www.ezoic.com/
- Docs: https://support.ezoic.com/
- Community: https://www.ezoic.com/forums/
- Email: support@ezoic.com

---

## 🆚 Ezoic vs AdSense

### Vantagens Ezoic:
- ✅ Requisitos menores
- ✅ IA otimiza automaticamente
- ✅ Pode usar junto com AdSense
- ✅ Melhor para sites pequenos/médios
- ✅ Suporte mais acessível

### Vantagens AdSense:
- ✅ Mais anunciantes
- ✅ Melhor para sites grandes
- ✅ Integração com Google
- ✅ Pagamentos mais altos (sites grandes)

### Pode Usar os Dois?
- ✅ SIM! Ezoic pode usar anúncios do AdSense
- ✅ Ezoic otimiza posicionamento
- ✅ Você ganha mais com a combinação

---

## 🎉 Dica Final

**Foque em:**
1. ✅ Conteúdo de qualidade (cifras corretas)
2. ✅ SEO (aparecer no Google)
3. ✅ Experiência do usuário
4. ✅ Velocidade do site

**Receita vem naturalmente com tráfego!**

---

**Quer que eu adicione o código Ezoic no seu projeto agora?** 🚀
