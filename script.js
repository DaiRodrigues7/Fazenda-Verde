// Farm Management System - JavaScript
// Data management with localStorage

// Initialize data structures
const defaultData = {
    galinhas: [],
    vacas: [],
    cavalos: [],
    ovelhas: [],
    lancamentos: []
};

// Load data from localStorage or use defaults
function loadData() {
    const stored = localStorage.getItem('agropecData');
    if (stored) {
        return JSON.parse(stored);
    }
    return defaultData;
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem('agropecData', JSON.stringify(data));
}

// Get current data
let appData = loadData();

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Refresh data for the section
    refreshSectionData(sectionId);
}

// Refresh section data
function refreshSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'galinhas':
            renderGalinhasList();
            break;
        case 'vacas':
            renderVacasList();
            break;
        case 'cavalos':
            renderCavalosList();
            break;
        case 'ovelhas':
            renderOvelhasList();
            break;
        case 'lancamento':
            renderLancamentosList();
            break;
    }
}

// Dashboard updates
function updateDashboard() {
    // Calculate total animals
    const totalGalinhas = appData.galinhas.reduce((sum, lote) => sum + parseInt(lote.quantidade), 0);
    const totalVacas = appData.vacas.length;
    const totalCavalos = appData.cavalos.length;
    const totalOvelhas = appData.ovelhas.length;
    const totalAnimais = totalGalinhas + totalVacas + totalCavalos + totalOvelhas;
    
    document.getElementById('totalAnimais').textContent = totalAnimais;
    document.getElementById('totalGalinhas').textContent = totalGalinhas;
    document.getElementById('totalVacas').textContent = totalVacas;
    document.getElementById('totalCavalos').textContent = totalCavalos;
    document.getElementById('totalOvelhas').textContent = totalOvelhas;
    
    // Get today's production
    const today = new Date().toISOString().split('T')[0];
    const todayLancamentos = appData.lancamentos.filter(l => l.data === today);
    
    const totalOvosHoje = todayLancamentos.reduce((sum, l) => sum + parseInt(l.ovos), 0);
    const totalLeiteHoje = todayLancamentos.reduce((sum, l) => sum + parseFloat(l.leite), 0);
    const totalLaHoje = todayLancamentos.reduce((sum, l) => sum + parseFloat(l.la), 0);
    
    document.getElementById('totalOvosHoje').textContent = totalOvosHoje;
    document.getElementById('totalLeiteHoje').textContent = totalLeiteHoje.toFixed(1) + ' L';
    document.getElementById('totalLaHoje').textContent = totalLaHoje.toFixed(1) + ' kg';
    
    // Update recent lancamentos
    renderUltimosLancamentos();
}

function renderUltimosLancamentos() {
    const container = document.getElementById('ultimosLancamentos');
    const recentLancamentos = [...appData.lancamentos].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
    
    if (recentLancamentos.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum lançamento registrado</p>';
        return;
    }
    
    container.innerHTML = recentLancamentos.map(l => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
                <p class="font-medium text-gray-800">${formatDate(l.data)}</p>
                <p class="text-sm text-gray-500">Leite: ${l.leite}L | Ovos: ${l.ovos} | Lã: ${l.la}kg</p>
            </div>
        </div>
    `).join('');
}

// Galinhas functions
document.getElementById('formGalinhas').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const novoLote = {
        id: Date.now(),
        lote: document.getElementById('loteGalinha').value,
        linhagem: document.getElementById('linhagemGalinha').value,
        quantidade: document.getElementById('quantidadeGalinha').value
    };
    
    appData.galinhas.push(novoLote);
    saveData(appData);
    
    this.reset();
    renderGalinhasList();
    updateDashboard();
});

function renderGalinhasList() {
    const container = document.getElementById('listaGalinhas');
    
    if (appData.galinhas.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum lote cadastrado</p>';
        return;
    }
    
    container.innerHTML = appData.galinhas.map(l => `
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
                <p class="font-bold text-green-800">${l.lote}</p>
                <p class="text-sm text-gray-600">Raça: ${l.linhagem}</p>
                <p class="text-sm text-gray-600">Quantidade: ${l.quantidade} aves</p>
            </div>
            <button onclick="deleteGalinha(${l.id})" class="btn-delete">Excluir</button>
        </div>
    `).join('');
}

function deleteGalinha(id) {
    if (confirm('Tem certeza que deseja excluir este lote?')) {
        appData.galinhas = appData.galinhas.filter(l => l.id !== id);
        saveData(appData);
        renderGalinhasList();
        updateDashboard();
    }
}

// Vacas functions
document.getElementById('formVacas').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const novaVaca = {
        id: Date.now(),
        idBrinco: document.getElementById('idVaca').value,
        raca: document.getElementById('racaVaca').value,
        categoria: document.getElementById('categoriaVaca').value,
        peso: document.getElementById('pesoVaca').value,
        dataEntrada: document.getElementById('dataEntradaVaca').value
    };
    
    appData.vacas.push(novaVaca);
    saveData(appData);
    
    this.reset();
    renderVacasList();
    updateDashboard();
});

function renderVacasList() {
    const tbody = document.getElementById('tbodyVacas');
    
    if (appData.vacas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum animal cadastrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = appData.vacas.map(v => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3">${v.idBrinco}</td>
            <td class="px-4 py-3">${v.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-green">${v.categoria}</span></td>
            <td class="px-4 py-3">${v.peso} kg</td>
            <td class="px-4 py-3">
                <button onclick="deleteVaca(${v.id})" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function deleteVaca(id) {
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        appData.vacas = appData.vacas.filter(v => v.id !== id);
        saveData(appData);
        renderVacasList();
        updateDashboard();
    }
}

// Cavalos functions
document.getElementById('formCavalos').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const novoCavalo = {
        id: Date.now(),
        nome: document.getElementById('nomeCavalo').value,
        raca: document.getElementById('racaCavalo').value,
        pai: document.getElementById('paiCavalo').value || '-',
        mae: document.getElementById('maeCavalo').value || '-',
        nascimento: document.getElementById('nascimentoCavalo').value,
        funcao: document.getElementById('funcaoCavalo').value
    };
    
    appData.cavalos.push(novoCavalo);
    saveData(appData);
    
    this.reset();
    renderCavalosList();
    updateDashboard();
});

function renderCavalosList() {
    const tbody = document.getElementById('tbodyCavalos');
    
    if (appData.cavalos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum cavalo cadastrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = appData.cavalos.map(c => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3 font-medium">${c.nome}</td>
            <td class="px-4 py-3">${c.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-blue">${c.funcao}</span></td>
            <td class="px-4 py-3">${formatDate(c.nascimento)}</td>
            <td class="px-4 py-3">
                <button onclick="deleteCavalo(${c.id})" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function deleteCavalo(id) {
    if (confirm('Tem certeza que deseja excluir este cavalo?')) {
        appData.cavalos = appData.cavalos.filter(c => c.id !== id);
        saveData(appData);
        renderCavalosList();
        updateDashboard();
    }
}

// Ovelhas functions
document.getElementById('formOvelhas').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const novaOvelha = {
        id: Date.now(),
        idOvelha: document.getElementById('idOvelha').value,
        raca: document.getElementById('racaOvelha').value,
        tipoLa: document.getElementById('tipoLaOvelha').value,
        idade: document.getElementById('idadeOvelha').value
    };
    
    appData.ovelhas.push(novaOvelha);
    saveData(appData);
    
    this.reset();
    renderOvelhasList();
    updateDashboard();
});

function renderOvelhasList() {
    const tbody = document.getElementById('tbodyOvelhas');
    
    if (appData.ovelhas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhuma ovelha cadastrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = appData.ovelhas.map(o => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3">${o.idOvelha}</td>
            <td class="px-4 py-3">${o.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-purple">${o.tipoLa}</span></td>
            <td class="px-4 py-3">${o.idade} anos</td>
            <td class="px-4 py-3">
                <button onclick="deleteOvelha(${o.id})" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function deleteOvelha(id) {
    if (confirm('Tem certeza que deseja excluir esta ovelha?')) {
        appData.ovelhas = appData.ovelhas.filter(o => o.id !== id);
        saveData(appData);
        renderOvelhasList();
        updateDashboard();
    }
}

// Lancamento functions
document.getElementById('formLancamento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const novoLancamento = {
        id: Date.now(),
        data: document.getElementById('dataLancamento').value,
        leite: document.getElementById('leiteLancamento').value,
        ovos: document.getElementById('ovosLancamento').value,
        la: document.getElementById('laLancamento').value
    };
    
    appData.lancamentos.push(novoLancamento);
    saveData(appData);
    
    this.reset();
    // Reset date to today
    document.getElementById('dataLancamento').value = new Date().toISOString().split('T')[0];
    renderLancamentosList();
    updateDashboard();
});

function renderLancamentosList() {
    const tbody = document.getElementById('tbodyLancamentos');
    
    if (appData.lancamentos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum lançamento registrado</td></tr>';
        return;
    }
    
    // Sort by date descending
    const sortedLancamentos = [...appData.lancamentos].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    tbody.innerHTML = sortedLancamentos.map(l => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3 font-medium">${formatDate(l.data)}</td>
            <td class="px-4 py-3">${l.leite} L</td>
            <td class="px-4 py-3">${l.ovos}</td>
            <td class="px-4 py-3">${l.la} kg</td>
            <td class="px-4 py-3">
                <button onclick="deleteLancamento(${l.id})" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function deleteLancamento(id) {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
        appData.lancamentos = appData.lancamentos.filter(l => l.id !== id);
        saveData(appData);
        renderLancamentosList();
        updateDashboard();
    }
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set default date for lancamento form
    document.getElementById('dataLancamento').value = new Date().toISOString().split('T')[0];
    
    // Show dashboard by default
    showSection('dashboard');
    
    // Set active nav link
    document.querySelector('[data-section="dashboard"]').classList.add('active');
});
