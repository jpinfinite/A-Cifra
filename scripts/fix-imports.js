#!/usr/bin/env node

/**
 * Fix Imports - A Cifra
 * Corrige imports quebrados e padroniza caminhos
 * Uso: node scripts/fix-imports.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Diretórios para verificar
const DIRS_TO_CHECK = [
  'src/app',
  'src/components',
  'src/utils',
  'src/lib',
  'src/hooks',
  'src/types'
];

// Padrões de import a corrigir
const IMPORT_PATTERNS = [
  // Import absoluto incorreto
  { pattern: /from ['"]@\/(.+?)['"]/g, fix: (match, p1) => `from '@/${p1}'` },
  // Import relativo incorreto
  { pattern: /from ['"]\.\.\/\.\.\/(.+?)['"]/g, fix: (match, p1) => `from '@/${p1}'` },
  // Import sem extensão
  {
    pattern: /from ['"](.+?)(?<!\.tsx?)(?<!\.jsx?)(?<!\.js)['"]/g, fix: (match, p1) => {
      if (p1.startsWith('@/') || p1.startsWith('.')) {
        return match; // Já está correto
      }
      return match;
    }
  }
];

function findFiles(dir, extension = '.tsx') {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (item.endsWith(extension) || item.endsWith('.ts') || item.endsWith('.jsx') || item.endsWith('.js')) {
      files.push(fullPath);
    }
  });

  return files;
}

function analyzeImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  // Verificar imports
  const importLines = content.match(/^import .+? from .+?$/gm) || [];

  importLines.forEach((line, index) => {
    // Verificar import relativo profundo
    if (line.includes('../../../')) {
      issues.push({
        line: index + 1,
        type: 'deep-relative',
        message: 'Import relativo muito profundo',
        suggestion: 'Use import absoluto com @/',
        original: line
      });
    }

    // Verificar import sem @/ quando deveria usar
    const relativeMatch = line.match(/from ['"]\.\.\/(.+?)['"]/);
    if (relativeMatch && !line.includes('node_modules')) {
      const importPath = relativeMatch[1];
      if (importPath.startsWith('components/') ||
        importPath.startsWith('utils/') ||
        importPath.startsWith('lib/') ||
        importPath.startsWith('types/')) {
        issues.push({
          line: index + 1,
          type: 'should-be-absolute',
          message: 'Deveria usar import absoluto',
          suggestion: `from '@/${importPath}'`,
          original: line
        });
      }
    }

    // Verificar import duplicado
    const importMatch = line.match(/from ['"](.+?)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];
      const duplicates = importLines.filter(l => l.includes(importPath));
      if (duplicates.length > 1) {
        issues.push({
          line: index + 1,
          type: 'duplicate',
          message: 'Import duplicado',
          suggestion: 'Consolidar imports do mesmo módulo',
          original: line
        });
      }
    }
  });

  return issues;
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Corrigir imports relativos profundos
  const deepRelativeRegex = /from ['"]\.\.\/\.\.\/\.\.\/(.+?)['"]/g;
  if (deepRelativeRegex.test(content)) {
    content = content.replace(deepRelativeRegex, (match, p1) => {
      modified = true;
      return `from '@/${p1}'`;
    });
  }

  // Corrigir imports que deveriam ser absolutos
  const shouldBeAbsoluteRegex = /from ['"]\.\.\/(?:components|utils|lib|types|hooks)\/(.+?)['"]/g;
  if (shouldBeAbsoluteRegex.test(content)) {
    content = content.replace(shouldBeAbsoluteRegex, (match, p1) => {
      modified = true;
      const moduleName = match.match(/\.\.\/(components|utils|lib|types|hooks)/)[1];
      return `from '@/${moduleName}/${p1}'`;
    });
  }

  // Organizar imports (React primeiro, depois externos, depois internos)
  const lines = content.split('\n');
  const importLines = [];
  const otherLines = [];
  let inImportBlock = false;

  lines.forEach(line => {
    if (line.trim().startsWith('import ')) {
      importLines.push(line);
      inImportBlock = true;
    } else if (inImportBlock && line.trim() === '') {
      // Linha vazia após imports
      inImportBlock = false;
      otherLines.push(line);
    } else {
      otherLines.push(line);
    }
  });

  if (importLines.length > 0) {
    // Separar tipos de imports
    const reactImports = importLines.filter(l => l.includes('from \'react\'') || l.includes('from "react"'));
    const nextImports = importLines.filter(l => l.includes('from \'next') || l.includes('from "next'));
    const externalImports = importLines.filter(l =>
      !l.includes('from \'react') &&
      !l.includes('from "react') &&
      !l.includes('from \'next') &&
      !l.includes('from "next') &&
      !l.includes('from \'@/') &&
      !l.includes('from "@/') &&
      !l.includes('from \'.') &&
      !l.includes('from ".')
    );
    const internalImports = importLines.filter(l =>
      l.includes('from \'@/') ||
      l.includes('from "@/') ||
      l.includes('from \'.') ||
      l.includes('from ".')
    );

    // Reconstruir imports organizados
    const organizedImports = [
      ...reactImports,
      ...nextImports,
      ...(externalImports.length > 0 ? ['', ...externalImports] : []),
      ...(internalImports.length > 0 ? ['', ...internalImports] : [])
    ];

    if (JSON.stringify(importLines) !== JSON.stringify(organizedImports)) {
      modified = true;
      content = [...organizedImports, '', ...otherLines].join('\n');
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  return modified;
}

function scanProject() {
  console.log('\n🔧 Fix Imports - A Cifra');
  console.log('═'.repeat(60));

  let totalFiles = 0;
  let totalIssues = 0;
  let totalFixed = 0;

  DIRS_TO_CHECK.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Diretório não encontrado: ${dir}`);
      return;
    }

    console.log(`\n📂 Verificando: ${dir}`);

    const files = findFiles(dir);
    totalFiles += files.length;

    files.forEach(file => {
      const issues = analyzeImports(file);

      if (issues.length > 0) {
        console.log(`\n📄 ${path.relative(process.cwd(), file)}`);
        totalIssues += issues.length;

        issues.forEach(issue => {
          const icon = issue.type === 'duplicate' ? '🔄' :
            issue.type === 'deep-relative' ? '⚠️' : '💡';
          console.log(`   ${icon} Linha ${issue.line}: ${issue.message}`);
          console.log(`      → ${issue.suggestion}`);
        });

        // Tentar corrigir automaticamente
        const fixed = fixImports(file);
        if (fixed) {
          totalFixed++;
          console.log(`   ✅ Corrigido automaticamente`);
        }
      }
    });
  });

  console.log('\n═'.repeat(60));
  console.log('📊 RESUMO');
  console.log('═'.repeat(60));
  console.log(`Arquivos verificados: ${totalFiles}`);
  console.log(`Problemas encontrados: ${totalIssues}`);
  console.log(`Arquivos corrigidos: ${totalFixed}`);

  if (totalFixed > 0) {
    console.log('\n✅ Imports corrigidos com sucesso!');
    console.log('💡 Execute "npm run lint" para verificar se há outros problemas');
  } else if (totalIssues > 0) {
    console.log('\n⚠️  Alguns problemas requerem correção manual');
  } else {
    console.log('\n✅ Nenhum problema encontrado!');
  }

  console.log('═'.repeat(60));
}

// Executar
if (require.main === module) {
  scanProject();
}

module.exports = { analyzeImports, fixImports, findFiles };
