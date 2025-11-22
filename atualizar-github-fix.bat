@echo off
echo ========================================
echo  Corrigindo e Atualizando GitHub
echo ========================================
echo.

echo [1/4] Verificando status...
git status
echo.

echo [2/4] Adicionando arquivos...
git add .
echo.

echo [3/4] Fazendo commit...
git commit -m "fix: corrigir erro de ESLint no layout.tsx - Remover parametro nao usado no onError handler - Corrigir build do Cloudflare Pages"
echo.

echo [4/4] Enviando para o GitHub...
git push
echo.

echo ========================================
echo  Concluido! Build deve passar agora.
echo ========================================
echo.
pause
