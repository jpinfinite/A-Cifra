#!/bin/bash

echo "========================================"
echo " Atualizando GitHub - A Cifra"
echo "========================================"
echo ""

echo "[1/4] Verificando status..."
git status
echo ""

echo "[2/4] Adicionando arquivos..."
git add .
echo ""

echo "[3/4] Fazendo commit..."
git commit -m "fix: corrigir erros do console e adicionar página de categorias

- Corrigir scripts do Google (AdSense e News) com lazyOnload
- Adicionar tratamento de erros nos scripts
- Criar página de categorias (/categorias)
- Adicionar utilitários de validação para categorias
- Adicionar ícones às categorias
- Corrigir tipagem TypeScript
- Melhorar error boundary
- Adicionar documentação completa"
echo ""

echo "[4/4] Enviando para o GitHub..."
git push
echo ""

echo "========================================"
echo " Concluído!"
echo "========================================"
