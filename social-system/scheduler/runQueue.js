const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const generateCaptionAI = require('../ai/generateCaptionAI')

const QUEUE_PATH = path.join(__dirname, '../queue/queue.json')
const POSTED_PATH = path.join(__dirname, '../queue/posted.json')
const CURRENT_POST_PATH = path.join(__dirname, '../posts/current.json')

async function runQueue() {
    console.log("🕒 Verificando fila de postagens...")

    if (!fs.existsSync(QUEUE_PATH)) {
        console.log("⚠️  Fila não encontrada.")
        return
    }

    const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8'))
    const next = queue.find(p => p.status === 'pending')

    if (!next) {
        console.log("✅ Fila vazia ou todos os posts processados.")
        return
    }

    // Horário seguro check (9h - 22h)
    const hour = new Date().getHours()
    if (hour < 9 || hour > 22) {
        // console.log(`zzz Fora do horário comercial (${hour}h). Bot dormindo.`)
        // return // Uncomment to enforce
    }

    console.log(`🚀 Processando: ${next.title}`)

    try {
        // 1. Prepare and Run Instagram
        const igData = await generateCaptionAI(next, 'instagram')
        const igPost = {
            ...next,
            ...igData,
            platform: 'instagram'
        }

        // Resolve Absolute Image Path for Bot
        const projectRoot = path.resolve(__dirname, '../../')
        let imageRelative = igPost.image
        if (imageRelative.startsWith('/')) imageRelative = imageRelative.substring(1)
        const absImagePath = path.join(projectRoot, 'public', imageRelative)

        igPost.image = absImagePath

        fs.writeFileSync(CURRENT_POST_PATH, JSON.stringify(igPost, null, 2))

        console.log("📸 Postando no Instagram...")
        const botDir = path.join(__dirname, '../bots')

        // Wrap exec in Promise for await
        await new Promise((resolve) => {
            exec('node post-instagram.js', { cwd: botDir }, (error, stdout, stderr) => {
                if (error) console.error(`❌ Erro IG: ${error.message}`)
                else console.log(`✅ IG Sucesso: ${stdout}`)
                resolve()
            })
        })

        // Delay humano (60s)
        console.log("⏳ Aguardando delay humano seguro (60s)...")
        await new Promise(r => setTimeout(r, 60000))

        // 2. Prepare and Run Facebook
        const fbData = await generateCaptionAI(next, 'facebook')
        const fbPost = {
            ...next,
            ...fbData,
            platform: 'facebook',
            image: absImagePath
        }

        fs.writeFileSync(CURRENT_POST_PATH, JSON.stringify(fbPost, null, 2))

        console.log("📘 Postando no Facebook...")
        await new Promise((resolve) => {
             exec('node post-facebook.js', { cwd: botDir }, (error, stdout, stderr) => {
                 if (error) console.error(`❌ Erro FB: ${error.message}`)
                 else console.log(`✅ FB Sucesso: ${stdout}`)
                 resolve()
            })
        })

        // 3. Mark as posted
        const currentQueue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf-8'))
        const itemToUpdate = currentQueue.find(p => p.id === next.id)
        if (itemToUpdate) {
            itemToUpdate.status = 'posted'
            itemToUpdate.postedAt = new Date().toISOString()
            fs.writeFileSync(QUEUE_PATH, JSON.stringify(currentQueue, null, 2))

            // Add to history
            let posted = []
            if (fs.existsSync(POSTED_PATH)) posted = JSON.parse(fs.readFileSync(POSTED_PATH, 'utf-8'))
            posted.push(itemToUpdate)
            fs.writeFileSync(POSTED_PATH, JSON.stringify(posted, null, 2))

            console.log("🏁 Ciclo concluído. Artigo marcado como postado.")
        }

    } catch (error) {
        console.error("❌ Erro fatal no scheduler:", error)
    }
}

if (require.main === module) {
    runQueue()
}
