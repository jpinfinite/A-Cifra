#!/bin/bash
# 🚀 PIPELINE AUTOMÁTICO ANTIGRAVITY → NEXT.JS → DEPLOY
# Local: servidor ou CI (GitHub Actions, VPS, etc)

set -e

CONTENT_DIR="content/articles"
TEMP_FILE="/tmp/antigravity_article.json"

# 1️⃣ RECEBER JSON DO ANTIGRAVITY (stdin ou arquivo)
cat > "$TEMP_FILE"

# 2️⃣ VALIDAR JSON BÁSICO
node <<'EOF'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync(process.env.TEMP_FILE || '/tmp/antigravity_article.json'));

const required = ['slug','title','intro','blocks','conclusion'];
for (const key of required) {
  if (!data[key]) {
    console.error(`Campo obrigatório ausente: ${key}`);
    process.exit(1);
  }
}

if (!Array.isArray(data.blocks)) {
  console.error('blocks deve ser um array');
  process.exit(1);
}

console.log('✅ JSON válido');
EOF

# 3️⃣ SALVAR ARTIGO
SLUG=$(node -e "console.log(require('$TEMP_FILE').slug)")
TARGET="$CONTENT_DIR/$SLUG.json"

mkdir -p "$CONTENT_DIR"
cp "$TEMP_FILE" "$TARGET"

# 4️⃣ GIT COMMIT AUTOMÁTICO
git add "$TARGET"
git commit -m "auto: novo artigo $SLUG via Antigravity"

# 5️⃣ DEPLOY (Cloudflare / Vercel)
# Prioridade para Cloudflare (wrangler) se disponível
if command -v wrangler >/dev/null 2>&1; then
  echo "🔄 Iniciando deploy via Wrangler (Cloudflare Pages)..."
  npx wrangler pages deploy --branch main
elif command -v vercel >/dev/null 2>&1; then
  echo "🔄 Iniciando deploy via Vercel..."
  vercel --prod --yes
else
  echo "⚠️ CLI de deploy (wrangler/vercel) não encontrada. Commit pronto para deploy manual ou via git push."
  # Se configurado repo remoto:
  # git push origin main
fi

echo "🚀 Pipeline concluído com sucesso"
