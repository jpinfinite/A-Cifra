# 📧 Newsletter - Guia Rápido

## ✅ O que já está pronto

1. ✅ Componente de formulário criado
2. ✅ API route configurada
3. ✅ Integrado na home page
4. ✅ Design alinhado com o tema do site

## 🚀 Próximos Passos (5 minutos)

### 1. Escolha um serviço (Recomendo Brevo)

**Brevo (Gratuito):**
- Acesse: https://www.brevo.com/pt/
- Cadastre-se com: cifraaessenciacoin@gmail.com
- Gratuito até 300 emails/dia

### 2. Configure as credenciais

Crie arquivo `.env.local` na raiz:

```env
BREVO_API_KEY=sua-chave-aqui
BREVO_LIST_ID=1
```

### 3. Ative a integração

Edite `src/app/api/newsletter/subscribe/route.ts`:

- Descomente o bloco do Brevo (linhas 18-40)
- Remova o console.log temporário (linha 82)

### 4. Teste

```bash
npm run dev
```

Acesse http://localhost:3000 e teste o formulário!

---

## 📍 Onde está o formulário?

- ✅ **Home page** (já integrado)
- Pode adicionar em outras páginas importando:

```tsx
import NewsletterForm from '@/components/content/NewsletterForm';

<NewsletterForm />
```

---

## 🎨 Personalizar

Edite `src/components/content/NewsletterForm.tsx`:

- Textos (linhas 35-42)
- Cores (já usa as cores do tema)
- Placeholder do email (linha 49)

---

## 📖 Documentação Completa

Veja `docs/NEWSLETTER_SETUP.md` para:
- Instruções detalhadas de cada serviço
- Como enviar newsletters
- Troubleshooting
- Dicas de otimização

---

## 🆘 Problemas?

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme que descomentou o código da API
3. Veja os logs no terminal
4. Teste com diferentes emails

---

## 📊 Próximos Passos Recomendados

1. Configure o Brevo
2. Crie um template de email
3. Planeje frequência de envio (semanal/quinzenal)
4. Crie conteúdo exclusivo para assinantes
5. Monitore métricas (taxa de abertura, cliques)
