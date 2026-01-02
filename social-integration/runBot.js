const { exec } = require('child_process')
const path = require('path')

module.exports = function runBot() {
  const botDir = path.resolve(__dirname, '../social-bot')

  console.log('🚀 Iniciando postagem no Instagram...')
  exec('node scripts/post-instagram.js', { cwd: botDir }, (error, stdout, stderr) => {
      if (error) {
          console.error(`❌ Erro Instagram: ${error.message}`)
          return
      }
      if (stderr) console.error(`⚠️ Instagram Stderr: ${stderr}`)
      console.log(`✅ Instagram Output: ${stdout}`)
  })

  console.log('🚀 Iniciando postagem no Facebook...')
  exec('node scripts/post-facebook.js', { cwd: botDir }, (error, stdout, stderr) => {
      if (error) {
          console.error(`❌ Erro Facebook: ${error.message}`)
          return
      }
      if (stderr) console.error(`⚠️ Facebook Stderr: ${stderr}`)
      console.log(`✅ Facebook Output: ${stdout}`)
  })
}
