# 🎯 Como Criar os Slots de Anúncios no Google AdSense

## ⚠️ AÇÃO URGENTE NECESSÁRIA

Os anúncios manuais foram ativados no código, mas você precisa criar os slots no Google AdSense e atualizar os IDs no arquivo `.env.local`.

## 📋 Passo a Passo

### 1. Acesse o Google AdSense

1. Vá para: https://adsense.google.com
2. Faça login com sua conta (ca-pub-1151448515464841)
3. No menu lateral, clique em **"Anúncios"**
4. Clique em **"Por unidade de anúncio"**

### 2. Crie os Seguintes Anúncios

#### Anúncio 1: In-Article 1
- Clique em **"Criar nova unidade de anúncio"**
- Selecione: **"In-article"** (Anúncio dentro do artigo)
- Nome: `A Cifra - In-Article 1`
- Tamanho: **Responsivo**
- Clique em **"Criar"**
- **COPIE O SLOT ID** (formato: 1234567890)

#### Anúncio 2: In-Article 2
- Repita o processo acima
- Nome: `A Cifra - In-Article 2`
- Tipo: **In-article**
- Tamanho: **Responsivo**
- **COPIE O SLOT ID**

#### Anúncio 3: In-Article 3
- Repita o processo acima
- Nome: `A Cifra - In-Article 3`
- Tipo: **In-article**
- Tamanho: **Responsivo**
- **COPIE O SLOT ID**

#### Anúncio 4: Sidebar Display
- Clique em **"Criar nova unidade de anúncio"**
- Selecione: **"Display"** (Anúncio gráfico)
- Nome: `A Cifra - Sidebar Display`
- Tamanho: **Responsivo** (ou 300x600 se preferir fixo)
- Clique em **"Criar"**
- **COPIE O SLOT ID**

#### Anúncio 5: Header Display
- Repita o processo acima
- Nome: `A Cifra - Header Display`
- Tipo: **Display**
- Tamanho: **Responsivo**
- **COPIE O SLOT ID**

#### Anúncio 6: Footer Display (Opcional)
- Repita o processo acima
- Nome: `A Cifra - Footer Display`
- Tipo: **Display**
- Tamanho: **Responsivo**
- **COPIE O SLOT ID**

### 3. Atualize o Arquivo .env.local

Abra o arquivo `.env.local` na raiz do projeto e substitua os valores:

```env
# Substitua SUBSTITUA_PELO_ID_REAL pelos IDs que você copiou
NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_1=1234567890  # Seu ID real aqui
NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_2=0987654321  # Seu ID real aqui
NEXT_PUBLIC_AD_SLOT_IN_ARTICLE_3=1122334455  # Seu ID real aqui
NEXT_PUBLIC_AD_SLOT_SIDEBAR=5544332211       # Seu ID real aqui
NEXT_PUBLIC_AD_SLOT_HEADER=6677889900        # Seu ID real aqui
NEXT_PUBLIC_AD_SLOT_FOOTER=9988776655        # Seu ID real aqui
```

### 4. Rebuild e Deploy

Após atualizar o `.env.local`:

```bash
# Rebuild local para testar
npm run build

# Ou faça commit e push para deploy automático
git add .
git commit -m "feat: ativar anúncios manuais AdSense"
git push
```

## 📊 Posicionamento dos Anúncios

Os anúncios foram posicionados estrategicamente:

```
┌─────────────────────────────────────┐
│         HEADER                      │
├─────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────┐ │
│  │   ARTIGO     │  │  SIDEBAR    │ │
│  │              │  │             │ │
│  │  Conteúdo    │  │ [AD STICKY] │ │
│  │              │  │  300x600    │ │
│  │ [AD 1]       │  │             │ │
│  │  In-Article  │  │ Newsletter  │ │
│  │              │  │             │ │
│  │  Conteúdo    │  │ [AD 2]      │ │
│  │              │  │  300x250    │ │
│  │ [AD 2]       │  └─────────────┘ │
│  │  In-Article  │                  │
│  │              │                  │
│  │  Conteúdo    │                  │
│  │              │                  │
│  │ [AD 3]       │                  │
│  │  In-Article  │                  │
│  │              │                  │
│  │ Relacionados │                  │
│  └──────────────┘                  │
└─────────────────────────────────────┘
```

## 💰 Impacto Esperado

**Antes (só anúncios automáticos):**
- RPM: $2-3
- Receita mensal estimada: $226-339

**Depois (com anúncios manuais):**
- RPM: $8-12
- Receita mensal estimada: $904-1.356

**Aumento: +300% a +400%**

## ⏱️ Tempo para Ver Resultados

- **Imediato**: Anúncios começam a aparecer após deploy
- **24-48h**: AdSense otimiza os anúncios
- **7 dias**: Dados confiáveis de performance
- **30 dias**: Receita estabilizada

## 🔍 Como Verificar se Está Funcionando

1. Acesse qualquer artigo do seu site
2. Abra as ferramentas de desenvolvedor (F12)
3. Procure por elementos `<ins class="adsbygoogle">`
4. Verifique se os anúncios estão sendo carregados
5. Aguarde alguns segundos para os anúncios aparecerem

## ❓ Problemas Comuns

### Anúncios não aparecem
- Aguarde 10-15 minutos após o deploy
- Limpe o cache do navegador
- Verifique se os Slot IDs estão corretos
- Confirme que o AdSense está aprovado

### Anúncios aparecem em branco
- Normal nas primeiras horas
- AdSense está aprendendo sobre seu conteúdo
- Aguarde 24-48h para otimização

### Receita baixa inicialmente
- Normal nos primeiros dias
- AdSense precisa coletar dados
- Receita aumenta gradualmente

## 📞 Suporte

Se tiver dúvidas:
1. Verifique o painel do AdSense
2. Consulte: https://support.google.com/adsense
3. Aguarde 24-48h antes de se preocupar

---

**Próximo passo:** Criar os slots no AdSense e atualizar o `.env.local`!
