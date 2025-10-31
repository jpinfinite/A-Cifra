let statusInterval;

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    updateStatus();
    loadReports();
    
    // Atualizar status a cada 2 segundos
    statusInterval = setInterval(updateStatus, 2000);
});

// Função para iniciar organização
async function startOrganization(mode) {
    try {
        const response = await fetch('/api/organize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mode })
        });

        const result = await response.json();
        
        if (response.ok) {
            updateButtonStates(true);
            showNotification('Organização iniciada com sucesso!', 'success');
        } else {
            showNotification(result.error || 'Erro ao iniciar organização', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão com o servidor', 'error');
        console.error('Erro:', error);
    }
}

// Função para parar organização
async function stopOrganization() {
    try {
        const response = await fetch('/api/stop', {
            method: 'POST'
        });

        const result = await response.json();
        
        if (response.ok) {
            updateButtonStates(false);
            showNotification('Organização interrompida', 'warning');
        } else {
            showNotification('Erro ao parar organização', 'error');
        }
    } catch (error) {
        showNotification('Erro de conexão com o servidor', 'error');
        console.error('Erro:', error);
    }
}

// Função para atualizar status
async function updateStatus() {
    try {
        const response = await fetch('/api/status');
        const status = await response.json();

        // Atualizar elementos da interface
        document.getElementById('status').textContent = status.isRunning ? 'Executando' : 'Aguardando';
        document.getElementById('processedFiles').textContent = status.processedFiles;
        document.getElementById('totalFiles').textContent = status.totalFiles;
        document.getElementById('errorCount').textContent = status.errors.length;

        // Atualizar barra de progresso
        const progress = status.totalFiles > 0 ? (status.processedFiles / status.totalFiles) * 100 : 0;
        document.getElementById('progressFill').style.width = progress + '%';

        // Atualizar arquivo atual
        const currentFileDiv = document.getElementById('currentFileDiv');
        const currentFileSpan = document.getElementById('currentFile');
        
        if (status.currentFile && status.isRunning) {
            currentFileDiv.style.display = 'block';
            currentFileSpan.textContent = status.currentFile;
        } else {
            currentFileDiv.style.display = 'none';
        }

        // Atualizar logs
        updateLogs(status.logs);

        // Atualizar estado dos botões
        updateButtonStates(status.isRunning);

        // Se o processo terminou, recarregar relatórios
        if (!status.isRunning && status.logs.length > 0) {
            setTimeout(loadReports, 1000);
        }

    } catch (error) {
        console.error('Erro ao atualizar status:', error);
    }
}

// Função para atualizar logs
function updateLogs(logs) {
    const logsContainer = document.getElementById('logs');
    
    // Limitar a 50 logs mais recentes
    const recentLogs = logs.slice(-50);
    
    logsContainer.innerHTML = recentLogs
        .map(log => `<div class="log-entry">${escapeHtml(log)}</div>`)
        .join('');
    
    // Scroll para o final
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Função para atualizar estado dos botões
function updateButtonStates(isRunning) {
    const organizeBtn = document.getElementById('organizeBtn');
    const previewBtn = document.getElementById('previewBtn');
    const dryRunBtn = document.getElementById('dryRunBtn');
    const stopBtn = document.getElementById('stopBtn');

    organizeBtn.disabled = isRunning;
    previewBtn.disabled = isRunning;
    dryRunBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;

    if (isRunning) {
        organizeBtn.innerHTML = '<div class="loading"></div>Executando...';
    } else {
        organizeBtn.innerHTML = 'Organizar Imagens';
    }
}

// Função para carregar relatórios
async function loadReports() {
    try {
        const response = await fetch('/api/reports');
        const reports = await response.json();

        const reportsGrid = document.getElementById('reportsGrid');
        
        if (reports.length === 0) {
            reportsGrid.innerHTML = '<p>Nenhum relatório encontrado. Execute uma organização para gerar relatórios.</p>';
            return;
        }

        reportsGrid.innerHTML = reports
            .map(report => `
                <div class="report-card">
                    <h4>${report.name}</h4>
                    <p>Modificado: ${new Date(report.modified).toLocaleString('pt-BR')}</p>
                    <a href="${report.path}" target="_blank">📄 Visualizar Relatório</a>
                </div>
            `)
            .join('');

    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        document.getElementById('reportsGrid').innerHTML = '<p>Erro ao carregar relatórios.</p>';
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    // Definir cor baseada no tipo
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };

    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;

    // Adicionar ao body
    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Função para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);