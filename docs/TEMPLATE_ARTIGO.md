# Template de Artigo com Metadados Sociais

## Visão Geral

Este template fornece um exemplo completo de como criar um novo artigo para o blog A Cifra com todos os metadados sociais otimizados.

## Estrutura de Arquivos

```
src/app/tema/[slug-do-artigo]/
├── page.tsx          # Componente principal do artigo
└── page.module.scss  # Estilos específicos do artigo
```

## Template Completo

### page.tsx

```typescript
import { ArticleLayout } from '@/components/layout/ArticleLayout';
import { InContentAd } from '@/components/ads/InContentAd';
import { generateArticleMetadata, generateArticleStructuredData } from '@/utils/articleMetadata';
import styles from './page.module.scss';

// ===== METADADOS DO ARTIGO =====
// Gera automaticamente todas as tags Open Graph e Twitter Cards
export const metadata = generateArticleMetadata({
  // OBRIGATÓRIO: Título do artigo (recomendado: 10-60 caracteres)
  title: 'Título do Seu Artigo Aqui',
  
  // OBRIGATÓRIO: Descrição otimizada (máximo: 155 caracteres)
  // Dica: Use 120-155 caracteres para melhor exibição
  description: 'Descrição concisa e atraente do artigo que será exibida nas redes sociais e resultados de busca.',
  
  // OBRIGATÓRIO: Slug da URL (use kebab-case)
  slug: 'titulo-do-seu-artigo',
  
  // OBRIGATÓRIO: Caminho da imagem de destaque (1200x630px)
  // A imagem deve estar em /public/
  image: '/titulo-do-seu-artigo.png',
  
  // OPCIONAL: Nome do autor (default: 'Jonatha Pereira')
  author: 'Jonatha Pereira',
  
  // OPCIONAL: Data de publicação ISO 8601 (default: data atual)
  publishedDate: '2025-10-21T10:00:00.000Z',
  
  // OPCIONAL: Data de modificação ISO 8601 (default: publishedDate)
  modifiedDate: '2025-10-22T15:30:00.000Z',
  
  // OPCIONAL: Categoria do artigo (default: 'Educação Financeira')
  category: 'Fundamentos',
  
  // OPCIONAL: Tags adicionais para SEO e categorização
  tags: ['bitcoin', 'fundamentos', 'educação'],
  
  // OPCIONAL: Tempo de leitura estimado
  readingTime: '10 min'
});

// ===== COMPONENTE DO ARTIGO =====
export default function TituloDoSeuArtigo() {
  // Gera dados estruturados (JSON-LD) para SEO
  const structuredData = generateArticleStructuredData({
    title: 'Título do Seu Artigo Aqui',
    description: 'Descrição concisa e atraente do artigo que será exibida nas redes sociais e resultados de busca.',
    slug: 'titulo-do-seu-artigo',
    image: '/titulo-do-seu-artigo.png',
    author: 'Jonatha Pereira',
    publishedDate: '2025-10-21T10:00:00.000Z',
    modifiedDate: '2025-10-22T15:30:00.000Z',
    category: 'Fundamentos'
  });

  return (
    <>
      {/* Injeta dados estruturados no HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Layout do artigo com informações de cabeçalho */}
      <ArticleLayout
        title="Título do Seu Artigo Aqui"
        slug="titulo-do-seu-artigo"
        description="Descrição concisa e atraente do artigo."
        image="/titulo-do-seu-artigo.png"
        author="Jonatha Pereira"
        publishedDate="21 de outubro de 2025"
        readingTime="10 min de leitura"
        category="Fundamentos"
      >
        {/* ===== CONTEÚDO DO ARTIGO ===== */}
        
        <section className={styles.section}>
          <h2>Primeira Seção do Artigo</h2>
          <p>
            Conteúdo da primeira seção. Use parágrafos curtos e objetivos.
            Mantenha o tom forte, sincero e assertivo característico d'A Cifra.
          </p>
          
          <div className={styles.highlight}>
            <p>
              <strong>Destaque importante: Use para enfatizar conceitos-chave.</strong>
            </p>
          </div>
        </section>

        {/* Anúncio no meio do conteúdo (opcional) */}
        <InContentAd />

        <section className={styles.section}>
          <h2>Segunda Seção do Artigo</h2>
          <p>
            Continue desenvolvendo o conteúdo. Lembre-se de:
          </p>
          <ul>
            <li>Ser direto e objetivo</li>
            <li>Evitar promessas vazias</li>
            <li>Focar em educação, não em hype</li>
            <li>Manter honestidade brutal sobre riscos</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Conclusão</h2>
          <p>
            Finalize com uma mensagem forte e memorável que reforce
            os princípios d'A Cifra.
          </p>
          
          <div className={styles.finalMessage}>
            <p>
              <strong>Mensagem final impactante que resume o artigo.</strong>
            </p>
          </div>
        </section>

      </ArticleLayout>
    </>
  );
}
```

## Checklist de Criação de Artigo

### Antes de Começar

- [ ] Definir tema e objetivo do artigo
- [ ] Pesquisar e validar informações
- [ ] Criar outline com seções principais
- [ ] Estimar tempo de leitura

### Criando o Artigo

- [ ] Criar pasta em `src/app/tema/[slug]/`
- [ ] Copiar template para `page.tsx`
- [ ] Atualizar todos os campos de metadados
- [ ] Escrever conteúdo seguindo o tom d'A Cifra
- [ ] Adicionar seções e parágrafos
- [ ] Incluir destaques e citações importantes

### Metadados

- [ ] Título: 10-60 caracteres
- [ ] Descrição: 120-155 caracteres
- [ ] Slug: kebab-case, sem acentos
- [ ] Imagem: 1200x630px, salva em `/public/`
- [ ] Data de publicação: formato ISO 8601
- [ ] Categoria: definida e relevante
- [ ] Tags: 3-5 tags relevantes
- [ ] Tempo de leitura: estimado

### Imagem de Destaque

- [ ] Criar imagem 1200x630px
- [ ] Seguir guia de design (ver IMAGENS_DESTAQUE.md)
- [ ] Salvar em `/public/[slug].png`
- [ ] Otimizar tamanho (< 1MB)
- [ ] Testar legibilidade em mobile

### Validação

- [ ] Rodar `npm run dev` e verificar console
- [ ] Verificar preview local
- [ ] Testar no Facebook Sharing Debugger
- [ ] Testar no Twitter Card Validator
- [ ] Testar no LinkedIn Post Inspector
- [ ] Testar no WhatsApp (mobile)

### Publicação

- [ ] Fazer commit das alterações
- [ ] Fazer push para repositório
- [ ] Fazer deploy
- [ ] Validar em produção
- [ ] Compartilhar nas redes sociais

## Boas Práticas

### Títulos

✅ **BOM**: "O Risco é Você, Não o Bitcoin"
- Direto, impactante, 35 caracteres
- Provoca reflexão
- Foca no leitor

❌ **RUIM**: "Entenda Como Gerenciar Seus Riscos ao Investir em Bitcoin e Criptomoedas"
- Muito longo (75 caracteres)
- Genérico
- Sem impacto

### Descrições

✅ **BOM**: "Entenda riscos Bitcoin: volatilidade, perda total e gestão responsável. Educação financeira sem promessas vazias."
- 120 caracteres
- Específico
- Menciona benefícios claros

❌ **RUIM**: "Neste artigo vamos falar sobre os riscos do Bitcoin."
- Muito curto (54 caracteres)
- Vago
- Sem valor claro

### Slugs

✅ **BOM**: `risco-e-voce`
- Curto e memorável
- Kebab-case
- Sem acentos

❌ **RUIM**: `o-risco-é-você-não-o-bitcoin-gerenciando-seu-inimigo`
- Muito longo
- Tem acentos
- Difícil de lembrar

## Exemplos Reais

### Exemplo 1: Artigo Simples

```typescript
export const metadata = generateArticleMetadata({
  title: 'O Preço é a Última Coisa',
  description: 'Pare de focar no preço Bitcoin. Aprenda fundamentos, tecnologia blockchain e invista com disciplina.',
  slug: 'preco-ultima-coisa',
  image: '/o-preco.png',
  category: 'Fundamentos',
  readingTime: '8 min'
});
```

### Exemplo 2: Artigo Completo

```typescript
export const metadata = generateArticleMetadata({
  title: '10 a 10: Seu inimigo não é o Bitcoin. É a ganância e o pânico',
  description: 'Análise do crash Bitcoin outubro: supere volatilidade com disciplina, DCA e mentalidade longo prazo.',
  slug: '10-a-10',
  image: '/10-a-10.png',
  author: 'Jonatha Pereira',
  publishedDate: '2025-10-20T10:00:00.000Z',
  modifiedDate: '2025-10-21T15:30:00.000Z',
  category: 'Análise de Mercado',
  tags: ['bitcoin', 'crash', 'análise', 'volatilidade', 'estratégia', 'DCA'],
  readingTime: '12 min'
});
```

## Troubleshooting

### Erro: "Descrição excede 155 caracteres"

**Solução**: Reduza a descrição. A função trunca automaticamente, mas é melhor ajustar manualmente.

### Aviso: "Título muito longo"

**Solução**: Encurte o título para 40-60 caracteres. Mova detalhes para a descrição.

### Erro: "Imagem de destaque é obrigatória"

**Solução**: Certifique-se de que o campo `image` está preenchido e o arquivo existe em `/public/`.

### Imagem não aparece nas redes sociais

**Solução**:
1. Verifique se o arquivo existe em `/public/`
2. Confirme que o caminho começa com `/`
3. Use "Scrape Again" no Facebook Debugger
4. Aguarde alguns minutos para cache atualizar

## Recursos Adicionais

- **Guia de Imagens**: `docs/IMAGENS_DESTAQUE.md`
- **Guia de Validação**: `docs/VALIDACAO_METADADOS_SOCIAIS.md`
- **Spec Completa**: `.kiro/specs/social-sharing-tags/`

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação completa
2. Verifique exemplos de artigos existentes
3. Entre em contato com a equipe de desenvolvimento

---

**Última atualização**: 21 de outubro de 2025  
**Mantido por**: Equipe A Cifra
