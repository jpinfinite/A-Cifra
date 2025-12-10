#!/bin/bash

# Script para encontrar links de categoria que precisam de validação
# Uso: bash scripts/find-category-links.sh

echo "🔍 Procurando links de categoria que podem precisar de validação..."
echo ""

echo "📁 Arquivos com links para /categoria/:"
grep -r "href.*categoria" src/ --include="*.tsx" --include="*.ts" -n | grep -v "getCategoryUrl"

echo ""
echo "📁 Arquivos com interpolação de categoria:"
grep -r '\${.*category' src/ --include="*.tsx" --include="*.ts" -n

echo ""
echo "📁 Arquivos que já usam validação (OK):"
grep -r "getCategoryUrl\|validateCategorySlug" src/ --include="*.tsx" --include="*.ts" -n

echo ""
echo "✅ Verificação concluída!"
echo ""
echo "💡 Dica: Substitua links diretos por getCategoryUrl() para evitar erros"
