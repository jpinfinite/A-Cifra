#!/usr/bin/env node

/**
 * Script para migrar do sistema antigo de artigos para o novo sistema modular
 * 
 * Uso:
 *   node scripts/migrate-to-new-articles.js
 */

const fs = require('fs');
const path = require('path');

const OLD_FILE = path.join(__dirname, '../src/data/articles.ts');
const NEW_FILE = path.join(__dirname, '../src/data/articles-new.ts');
const BACKUP_FILE = path.join(__dirname, '../src/data/articles.ts.backup-migration');

console.log('🔄 Iniciando migração para o novo sistema de artigos...\n');

// 1. Fazer backup do arquivo antigo
console.log('📦 Criando backup do arquivo antigo...');
try {
  fs.copyFileSync(OLD_FILE, BACKUP_FILE);
  console.log(`✅ Backup criado: ${BACKUP_FILE}\n`);
} catch (error) {
  console.error('❌ Erro ao criar backup:', error.message);
  process.exit(1);
}

// 2. Substituir o arquivo antigo pelo novo
console.log('🔄 Substituindo arquivo antigo pelo novo sistema...');
try {
  fs.copyFileSync(NEW_FILE, OLD_FILE);
  console.log(`✅ Arquivo atualizado: ${OLD_FILE}\n`);
} catch (error) {
  console.error('❌ Erro ao substituir arquivo:', error.message);
  console.log('⚠️  Restaurando backup...');
  fs.copyFileSync(BACKUP_FILE, OLD_FILE);
  process.exit(1);
}

// 3. Verificar se a pasta de artigos existe
const ARTICLES_DIR = path.join(__dirname, '../content/articles');
if (!fs.existsSync(ARTICLES_DIR)) {
  console.log('📁 Criando pasta de artigos...');
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  console.log(`✅ Pasta criada: ${ARTICLES_DIR}\n`);
}

// 4. Contar artigos markdown
const markdownFiles = fs.readdirSync(ARTICLES_DIR)
  .filter(file => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md');

console.log('📊 Status da migração:');
console.log(`   - Artigos em markdown: ${markdownFiles.length}`);
console.log(`   - Backup salvo em: ${BACKUP_FILE}`);
console.log(`   - Sistema novo ativado: ${OLD_FILE}\n`);

console.log('✅ Migração concluída com sucesso!\n');
console.log('📝 Próximos passos:');
console.log('   1. Teste o site para garantir que tudo funciona');
console.log('   2. Adicione novos artigos em content/articles/');
console.log('   3. Use o template em content/articles/_template.md');
console.log('   4. Leia o README em content/articles/README.md\n');

console.log('💡 Para reverter a migração:');
console.log(`   cp ${BACKUP_FILE} ${OLD_FILE}\n`);
