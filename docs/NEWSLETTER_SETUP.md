# Guia de Configuração da Newsletter

## 📧 Serviços Recomendados

### 1. Brevo (Sendinblue) - **RECOMENDADO**
✅ Gratuito até 300 emails/dia  
✅ Sem limite de contatos  
✅ Interface em português  
✅ Fácil integração  

### 2. Mailchimp
✅ Gratuito até 500 contatos  
✅ Templates prontos  
✅ Muito popular  

### 3. ConvertKit
✅ Gratuito até 1.000 inscritos  
✅ Focado em criadores  
✅ Boas automações  

---

## 🚀 Configuração Passo a Passo

### Opção A: Brevo (Recomendado)

#### 1. Criar Conta
- Acesse: https://www.brevo.com/pt/
- Clique em "Cadastre-se gratuitamente"
- Use o email: cifraaessenciacoin@gmail.com

#### 2. Obter API Key
1. Faça login no Brevo
2. Vá em **Configurações** → **Chaves de API**
3. Clique em **Criar uma nova chave de API**
4. Dê um nome (ex: "A Cifra Newsletter")
5. Copie a chave gerada

#### 3. Criar Lista de Contatos
1. Vá em **Contatos** → **Listas**
2. Clique em **Criar uma lista**
3. Nome: "Newsletter A Cifra"
4. Anote o ID da lista (aparece na URL)

#### 4. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
BREVO_API_KEY=sua-api-key-aqui
BREVO_LIST_ID=1
```

#### 5. Ativar a Integração
No arquivo `src/app/api/newsletter/subscribe/route.ts`, descomente o bloco do Brevo:

```typescript
// Remova os comentários /* */ do bloco BREVO
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
// ... resto do código
```

---

### Opção B: Mailchimp

#### 1. Criar Conta
- Acesse: https://mailchimp.com
- Cadastre-se com cifraaessenciacoin@gmail.com

#### 2. Obter API Key
1. Vá em **Account** → **Extras** → **API keys**
2. Clique em **Create A Key**
3. Copie a chave

#### 3. Obter Audience ID
1. Vá em **Audience** → **All contacts**
2. Clique em **Settings** → **Audience name and defaults**
3. Copie o **Audience ID**

#### 4. Identificar Server Prefix
Na sua API key, o prefixo está após o hífen.  
Exemplo: `abc123-us1` → server prefix é `us1`

#### 5. Configurar Variáveis
```env
MAILCHIMP_API_KEY=sua-api-key-aqui
MAILCHIMP_AUDIENCE_ID=seu-audience-id
MAILCHIMP_SERVER_PREFIX=us1
```

#### 6. Ativar a Integração
Descomente o bloco do Mailchimp em `route.ts`

---

### Opção C: ConvertKit

#### 1. Criar Conta
- Acesse: https://convertkit.com
- Cadastre-se gratuitamente

#### 2. Obter API Key
1. Vá em **Settings** → **Advanced**
2. Copie a **API Secret**

#### 3. Criar Formulário
1. Vá em **Grow** → **Landing Pages & Forms**
2. Crie um novo formulário
3. Anote o Form ID

#### 4. Configurar Variáveis
```env
CONVERTKIT_API_KEY=sua-api-key-aqui
CONVERTKIT_FORM_ID=seu-form-id
```

---

## 📍 Onde Adicionar o Componente

### 1. Na Home Page
Edite `src/app/page.tsx`:

```tsx
import NewsletterForm from '@/components/content/NewsletterForm';

export default function HomePage() {
  return (
    <>
      {/* Seu conteúdo existente */}
      
      {/* Adicione antes do footer */}
      <section className="py-16 px-4">
        <NewsletterForm />
      </section>
    </>
  );
}
```

### 2. No Footer
Edite `src/components/layout/Footer.tsx`:

```tsx
import NewsletterForm from '@/components/content/NewsletterForm';

export default function Footer() {
  return (
    <footer>
      {/* Adicione no topo do footer */}
      <div className="container mx-auto px-4 py-16">
        <NewsletterForm />
      </div>
      
      {/* Resto do footer */}
    </footer>
  );
}
```

### 3. No Final dos Artigos
Edite `src/components/content/ArticleLayout.tsx`:

```tsx
import NewsletterForm from './NewsletterForm';

// Adicione após o conteúdo do artigo
<div className="mt-16">
  <NewsletterForm />
</div>
```

---

## 🎨 Personalização

### Alterar Cores
Edite `src/components/content/NewsletterForm.tsx`:

```tsx
// Trocar amber por outra cor
className="bg-amber-400" // → bg-blue-400, bg-green-400, etc.
```

### Alterar Textos
Modifique diretamente no componente:

```tsx
<h2>Seu título aqui</h2>
<p>Sua descrição aqui</p>
```

---

## 📊 Monitoramento

### Ver Inscritos
- **Brevo**: Contatos → Listas
- **Mailchimp**: Audience → All contacts
- **ConvertKit**: Subscribers

### Enviar Newsletter
1. Crie uma campanha no serviço escolhido
2. Selecione sua lista de contatos
3. Crie o conteúdo
4. Agende ou envie imediatamente

---

## 🔒 Segurança

### Proteger API Keys
- ✅ Nunca commite o arquivo `.env.local`
- ✅ Use variáveis de ambiente no Vercel
- ✅ Adicione `.env.local` no `.gitignore`

### Configurar no Vercel
1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável:
   - `BREVO_API_KEY`
   - `BREVO_LIST_ID`
3. Faça redeploy

---

## 🧪 Testar

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse a página com o formulário

3. Inscreva-se com um email de teste

4. Verifique no painel do serviço se o contato foi adicionado

---

## ❓ Problemas Comuns

### "Erro ao processar inscrição"
- Verifique se as API keys estão corretas
- Confirme que o List/Audience ID está correto
- Veja os logs no console do servidor

### Email não aparece na lista
- Aguarde alguns segundos
- Verifique a pasta de spam
- Confirme que a lista está ativa

### CORS Error
- Certifique-se de usar `/api/newsletter/subscribe`
- Verifique se a rota está em `src/app/api/`

---

## 📧 Próximos Passos

1. ✅ Configurar serviço de newsletter
2. ✅ Adicionar formulário no site
3. 📝 Criar template de email
4. 📅 Planejar frequência de envio
5. 📊 Monitorar métricas (taxa de abertura, cliques)

---

## 💡 Dicas

- Envie newsletters regularmente (semanal ou quinzenal)
- Crie conteúdo exclusivo para assinantes
- Segmente sua lista por interesses
- Teste diferentes horários de envio
- Analise métricas e otimize

---

## 🆘 Suporte

Se precisar de ajuda:
1. Consulte a documentação do serviço escolhido
2. Verifique os logs de erro
3. Teste com emails diferentes
