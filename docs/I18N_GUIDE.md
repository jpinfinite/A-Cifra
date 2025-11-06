# Guia de Internacionalização (i18n)

## Visão Geral

O blog A Cifra agora suporta múltiplos idiomas (Português e Inglês). O sistema de i18n permite que visitantes de diferentes países leiam o conteúdo em seu idioma preferido.

## Idiomas Suportados

- 🇧🇷 **Português (pt)** - Idioma padrão
- 🇺🇸 **English (en)**

## Como Funciona

### 1. Seletor de Idioma

Um seletor de idioma foi adicionado ao header do site (desktop e mobile). Os usuários podem:
- Clicar no ícone de globo para ver os idiomas disponíveis
- Selecionar o idioma desejado
- A preferência é salva no localStorage do navegador

### 2. Detecção Automática

O sistema detecta automaticamente o idioma do navegador do usuário na primeira visita:
- Se o navegador estiver em inglês → site carrega em inglês
- Se o navegador estiver em português → site carrega em português
- Outros idiomas → carrega em português (padrão)

### 3. Estrutura de Arquivos

```
src/
├── i18n/
│   ├── locales/
│   │   ├── pt.json    # Traduções em português
│   │   └── en.json    # Traduções em inglês
│   ├── config.ts      # Configuração de idiomas
│   └── index.ts       # Funções de tradução
├── hooks/
│   └── useTranslation.ts  # Hook para usar traduções
└── components/
    └── ui/
        └── LanguageSwitcher.tsx  # Componente seletor
```

## Como Adicionar Traduções

### 1. Adicionar Novas Chaves

Edite os arquivos `src/i18n/locales/pt.json` e `src/i18n/locales/en.json`:

```json
// pt.json
{
  "common": {
    "newKey": "Novo texto em português"
  }
}

// en.json
{
  "common": {
    "newKey": "New text in English"
  }
}
```

### 2. Usar Traduções em Componentes

```tsx
'use client'

import { useTranslation } from '@/hooks/useTranslation'

export function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.newKey')}</h1>
    </div>
  )
}
```

## Categorias de Tradução

As traduções estão organizadas em categorias:

- **common**: Textos comuns (botões, labels, etc)
- **nav**: Navegação e menu
- **home**: Página inicial
- **categories**: Nomes de categorias
- **newsletter**: Formulário de newsletter
- **tools**: Ferramentas e calculadoras
- **footer**: Rodapé

## Como Adicionar um Novo Idioma

### 1. Criar arquivo de tradução

Crie `src/i18n/locales/es.json` (exemplo para espanhol):

```json
{
  "common": {
    "readMore": "Leer más",
    ...
  }
}
```

### 2. Atualizar configuração

Edite `src/i18n/config.ts`:

```typescript
export const locales = ['pt', 'en', 'es'] as const

export const localeNames: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español'
}

export const localeFlags: Record<Locale, string> = {
  pt: '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸'
}
```

### 3. Importar traduções

Edite `src/i18n/index.ts`:

```typescript
import esTranslations from './locales/es.json'

const translations = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations
}
```

## Tradução de Artigos

Para traduzir artigos do blog, você pode:

1. **Criar versões traduzidas dos arquivos markdown**:
   - `content/articles/meu-artigo.md` (português)
   - `content/articles/meu-artigo.en.md` (inglês)

2. **Detectar o idioma e carregar o arquivo correto**:

```typescript
const locale = getCurrentLocale()
const articlePath = locale === 'en' 
  ? `content/articles/${slug}.en.md`
  : `content/articles/${slug}.md`
```

## Boas Práticas

1. **Sempre adicione traduções para todos os idiomas** ao adicionar novas chaves
2. **Use chaves descritivas** (ex: `home.title` ao invés de `t1`)
3. **Mantenha a estrutura consistente** entre os arquivos de idioma
4. **Teste em todos os idiomas** antes de fazer deploy
5. **Use pluralização quando necessário** (ex: "1 artigo" vs "2 artigos")

## Testando

Para testar as traduções:

1. Abra o site no navegador
2. Clique no seletor de idioma no header
3. Selecione um idioma diferente
4. Verifique se todos os textos foram traduzidos corretamente
5. Teste a navegação entre páginas

## Limitações Atuais

- Os artigos do blog ainda não são traduzidos automaticamente
- Algumas páginas estáticas podem precisar de ajustes manuais
- O sistema não suporta tradução automática (requer tradução manual)

## Próximos Passos

- [ ] Traduzir todos os artigos existentes
- [ ] Adicionar mais idiomas (Espanhol, Francês, etc)
- [ ] Implementar URLs localizadas (/en/article, /pt/artigo)
- [ ] Adicionar tradução automática com IA (opcional)
- [ ] Criar sistema de gerenciamento de traduções
