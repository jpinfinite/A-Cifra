@echo off
cd /d "%~dp0.."
echo Rodando Auto-Publisher...
node scripts/auto-publisher.js
pause
