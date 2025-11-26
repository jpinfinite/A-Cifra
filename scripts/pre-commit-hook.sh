#!/bin/bash

# Pre-commit Hook
# Valida imagens e executa lint antes de cada commit

echo "🔍 Executando validações pré-commit..."

# 1. Validar imagens
echo "📸 Validando imagens..."
node scripts/validate-images.js
if [ $? -ne 0 ]; then
  echo "❌ Validação de imagens falhou!"
  exit 1
fi

# 2. Executar lint
echo "🔧 Executando lint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lint falhou!"
  exit 1
fi

echo "✅ Todas as validações passaram!"
exit 0
