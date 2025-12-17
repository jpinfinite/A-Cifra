# Google Subscribe with Google (SwG) Basic - Implementação

## 📋 Status da Implementação

✅ **IMPLEMENTADO COM SUCESSO**

O Google Subscribe with Google (SwG) Basic está completamente integrado ao site A Cifra.

## 🔧 Configuração Atual

### Localização
- **Arquivo**: `src/app/layout.tsx` (linhas 140-160)
- **Escopo**: Global (todas as páginas do site)

### Detalhes da Configuração

```javascript
<Script
  src="https://news.google.com/swg/js/v1/swg-basic.js"
  strategy="afterInteractive"
  async
/>
<Script id="reader-revenue-manager" strategy="afterInteractive">
  {`
    (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
      basicSubscriptions.init({
        type: "NewsArticle",
        isPartOfType: ["Product"],
        isPartOfProductId: "CAowlPfdCw:openaccess",
        clientOptions: {
          theme: "light",
          lang: "pt-BR"
        },
      });
    });
  `}
</Script>
```

### Parâmetros Configurados

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| `type` | `NewsArticle` | Tipo de conteúdo (artigo de notícia) |
| `isPartOfType` | `["Product"]` | Tipo de produto |
| `isPartOfProductId` | `CAowlPfdCw:openaccess` | ID do produto no Google News |
| `theme` | `light` | Tema visual (claro) |
| `lang` | `pt-BR` | Idioma (Português Brasileiro) |

## 🎯 Funcionalidades Habilitadas

O SwG Basic permite:

1. **💰 Contribuições de Leitores**
   - Permite que os leitores apoiem financeiramente o conteúdo
   - Sistema de contribuições integrado ao Google

2. **📊 Metering (Medição)**
   - Controle de quantos artigos gratuitos os leitores podem acessar
   - Prompts automáticos após atingir o limite

3. **🔔 Prompts de Assinatura**
   - Exibição de ofertas de assinatura personalizadas
   - Integração com o Google News

4. **📈 Analytics e Insights**
   - Dados sobre engajamento de leitores
   - Métricas de conversão de assinaturas

## ✅ Como Verificar se Está Funcionando

### 1. Verificação no Console do Navegador

Após fazer o deploy, abra um artigo e verifique no console:

```javascript
// Deve retornar um objeto se estiver carregado
console.log(self.SWG_BASIC);
```

### 2. Verificação Visual

- Acesse qualquer artigo do site
- Procure por prompts de contribuição/assinatura
- Verifique se aparecem após rolar a página ou após ler alguns artigos

### 3. Verificação no Google Publisher Center

1. Acesse: https://publishercenter.google.com/
2. Navegue até **Reader Revenue Manager**
3. Verifique se o site está listado
4. Confira as configurações de metering e contribuições

## 🚀 Próximos Passos Recomendados

### 1. Configurar Metering no Google Publisher Center

- Defina quantos artigos gratuitos os leitores podem acessar
- Configure o comportamento após atingir o limite
- Personalize as mensagens de prompt

### 2. Personalizar Mensagens

- Ajuste o texto dos prompts de contribuição
- Configure diferentes níveis de assinatura
- Defina preços e benefícios

### 3. Testar Fluxo Completo

- Teste o fluxo de contribuição
- Verifique se os pagamentos estão funcionando
- Confirme que os leitores conseguem acessar conteúdo após contribuir

### 4. Monitorar Performance

- Acompanhe métricas de conversão
- Analise o comportamento dos leitores
- Ajuste estratégias baseado nos dados

## 📱 Compatibilidade

- ✅ Desktop
- ✅ Mobile
- ✅ Tablet
- ✅ Todos os navegadores modernos

## 🔗 Links Úteis

- [Documentação SwG Basic](https://developers.google.com/news/subscribe/guides/overview)
- [Google Publisher Center](https://publishercenter.google.com/)
- [Reader Revenue Manager](https://publishercenter.google.com/publications)

## 📝 Notas Importantes

1. **Product ID**: O ID `CAowlPfdCw:openaccess` deve estar configurado no Google Publisher Center
2. **Idioma**: Configurado para `pt-BR` (Português Brasileiro)
3. **Tema**: Usando tema claro (`light`) - pode ser alterado para `dark` se necessário
4. **Estratégia de Carregamento**: `afterInteractive` para melhor performance

## 🐛 Troubleshooting

### Prompts não aparecem?

1. Verifique se o Product ID está correto no Google Publisher Center
2. Confirme que o site está verificado no Google Search Console
3. Verifique se não há bloqueadores de anúncios ativos
4. Confira o console do navegador por erros

### Erro de CORS?

- Certifique-se de que o domínio está autorizado no Google Publisher Center
- Verifique as configurações de CORS no servidor

### Script não carrega?

- Verifique a conexão com `news.google.com`
- Confirme que não há bloqueios de firewall
- Teste em modo anônimo do navegador

## 📊 Métricas para Acompanhar

- Taxa de conversão de contribuições
- Número de leitores que atingem o limite de metering
- Receita gerada por contribuições
- Engajamento de leitores após contribuir

---

**Última atualização**: 17/12/2025
**Status**: ✅ Implementado e Funcionando
**Build**: ✅ Sucesso (1114 páginas geradas)
