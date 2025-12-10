const fs = require('fs');
const path = require('path');
const os = require('os');

function findOpera() {
    console.log('🔍 Procurando instalação do Opera...');

    const localAppData = process.env.LOCALAPPDATA;
    const appData = process.env.APPDATA;
    const programFiles = process.env['ProgramFiles'];
    const programFilesx86 = process.env['ProgramFiles(x86)'];

    // Locais possíveis do Executável
    const exePaths = [
        path.join(localAppData, 'Programs', 'Opera', 'launcher.exe'),
        path.join(localAppData, 'Programs', 'Opera GX', 'launcher.exe'),
        path.join(programFiles, 'Opera', 'launcher.exe'),
        path.join(programFiles, 'Opera GX', 'launcher.exe'),
        path.join(programFilesx86, 'Opera', 'launcher.exe'),
        path.join(programFilesx86, 'Opera GX', 'launcher.exe')
    ];

    // Locais possíveis do Perfil (User Data)
    const profilePaths = [
        path.join(appData, 'Opera Software', 'Opera Stable'),
        path.join(appData, 'Opera Software', 'Opera GX Stable')
    ];

    let foundExe = null;
    let foundProfile = null;

    // Verificar Executáveis
    for (const p of exePaths) {
        if (fs.existsSync(p)) {
            console.log(`✅ Executável encontrado: ${p}`);
            foundExe = p;
            break;
        }
    }

    // Verificar Perfis
    for (const p of profilePaths) {
        if (fs.existsSync(p)) {
            console.log(`✅ Perfil encontrado: ${p}`);
            foundProfile = p;
            break;
        }
    }

    if (foundExe && foundProfile) {
        console.log('\n🎉 Opera Localizado com Sucesso!');
        console.log(`   EXE: ${foundExe}`);
        console.log(`   PERFIL: ${foundProfile}`);
        return { exe: foundExe, profile: foundProfile };
    } else {
        console.log('\n❌ Opera não encontrado nos locais padrão.');
        return null;
    }
}

if (require.main === module) {
    findOpera();
}

module.exports = { findOpera };
