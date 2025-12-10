# 📧 Guia Completo: Newsletter com Brevo - A Cifra

## 🎯 Estratégia de Newsletter

### Tipos de Newsletter

**1. Newsletter Semanal (Gratuita)**
- Resumo das principais notícias da semana
- Top 3 artigos mais lidos
- Preço do Bitcoin e principais altcoins
- Enviada toda segunda-feira às 8h

**2. Newsletter Premium (Membros)**
- Análises técnicas exclusivas
- Sinais de trading
- Oportunidades de mercado
- Enviada 2x por semana (terça e quinta)

**3. Newsletter de Boas-Vindas**
- Enviada automaticamente ao se inscrever
- Apresenta o A Cifra
- Links para artigos essenciais
- Oferece desconto na assinatura

---

## 🔧 Configuração do Brevo

### Passo 1: Criar Listas de Contatos

**No Brevo Dashboard:**
1. Acesse "Contatos" → "Listas"
2. Crie 3 listas:
   - **Newsletter Gratuita** (ID: 2)
   - **Membros Premium** (ID: 3)
   - **Apoiadores** (ID: 4)

### Passo 2: Obter API Key

1. Acesse "Configurações" → "Chaves de API"
2. Copie sua chave API v3
3. Adicione ao `.env.local`:

```env
BREVO_API_KEY=xkeysib-sua-chave-aqui
```

---

## 💻 Implementação Técnica

### 1. Instalar SDK do Brevo

```bash
npm install sib-api-v3-sdk
```

### 2. Criar Serviço de Newsletter
