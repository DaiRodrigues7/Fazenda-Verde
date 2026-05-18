// ==========================================
// FUNÇÃO GLOBAL DE LOGOUT
// ==========================================

window.fazerLogout = async function() {
    try {
        const { error } = await _supabase.auth.signOut();
        if (error) throw error;
        currentUser = null;
        window.location.replace('login.html');
    } catch (error) {
        alert("Erro ao sair: " + error.message);
        window.location.replace('login.html');
    }
};

// ==========================================
// 1. CONFIGURAÇÃO DO SUPABASE - FAZENDA VERDE
// ==========================================

const SUPABASE_URL = "https://awwddyhfynaiudoflydg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3d2RkeWhmeW5haXVkb2ZseWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5ODM5MzMsImV4cCI6MjA5NDU1OTkzM30.hiWLY2iqOFnqCpItVggjMDUUHFdzSnVhymkIn4yWyMw";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;
const isLoginPage = window.location.pathname.includes('login.html');
const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');

window.addEventListener('DOMContentLoaded', async () => {
    if (isLoginPage) {
        configurarFormulariosAutenticacao();
        return;
    }

    if (isIndexPage) {
        const { data: { session }, error } = await _supabase.auth.getSession();
        if (session && session.user) {
            configurarInterfaceLogado(session.user);
            const dataLancamento = document.getElementById('dataLancamento');
            if (dataLancamento) {
                dataLancamento.value = new Date().toISOString().split('T')[0];
            }
            const dashboardLink = document.querySelector('[data-section="dashboard"]');
            if (dashboardLink) {
                dashboardLink.classList.add('active');
            }
        } else {
            window.location.href = 'login.html';
        }

        _supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                showSection('nova-senha');
            } else if (session && session.user) {
                configurarInterfaceLogado(session.user);
            } else {
                configurarInterfaceDeslogado();
            }
        });

        configurarFormulariosSistema();
    }
});

// ==========================================
// 2. CONTROLE DE INTERFACE E AUTENTICAÇÃO
// ==========================================

function configurarInterfaceLogado(user) {
    currentUser = user;
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) userEmailEl.textContent = user.email;

    const userGreetingEl = document.getElementById('userGreeting');
    if (userGreetingEl) {
        const firstName = user.user_metadata?.first_name || 'Usuário';
        userGreetingEl.textContent = `Olá, ${firstName}`;
    }

    const userAvatarEl = document.getElementById('userAvatar');
    if (userAvatarEl) {
        const avatarUrl = user.user_metadata?.avatar_url;
        const firstName = user.user_metadata?.first_name || 'U';
        if (avatarUrl) {
            userAvatarEl.style.backgroundImage = `url(${avatarUrl})`;
            userAvatarEl.style.backgroundSize = 'cover';
            userAvatarEl.style.backgroundPosition = 'center';
            userAvatarEl.textContent = '';
        } else {
            userAvatarEl.style.backgroundImage = 'none';
            userAvatarEl.textContent = firstName.charAt(0).toUpperCase();
        }
    }

    carregarDadosTodos();
}

function configurarInterfaceDeslogado() {
    currentUser = null;
    if (isIndexPage) {
        window.location.href = 'login.html';
    }
}

// ==========================================
// 3. EVENTOS DE ENVIO (SUBMIT) DOS FORMULÁRIOS DE AUTENTICAÇÃO
// ==========================================

function configurarFormulariosAutenticacao() {
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('cadastro-nome').value;
            const sobrenome = document.getElementById('cadastro-sobrenome').value;
            const email = document.getElementById('cadastro-email').value;
            const senha = document.getElementById('cadastro-senha').value;

            const { data, error } = await _supabase.auth.signUp({
                email,
                password: senha,
                options: {
                    data: {
                        first_name: nome,
                        last_name: sobrenome,
                        avatar_url: ''
                    }
                }
            });
            if (error) {
                showAuthMessage('Erro ao cadastrar: ' + error.message, 'error');
            } else {
                showAuthMessage('Cadastro realizado! Verifique seu e-mail para confirmar ou faça login.', 'success');
                formCadastro.reset();
            }
        });
    }

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;

            const { data, error } = await _supabase.auth.signInWithPassword({ email, password: senha });
            if (error) {
                showAuthMessage('Erro ao entrar: ' + error.message, 'error');
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    const formRecuperar = document.getElementById('form-recuperar');
    if (formRecuperar) {
        formRecuperar.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('recuperar-email').value;
            const { error } = await _supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin
            });
            if (error) {
                showAuthMessage('Erro ao enviar email de recuperação: ' + error.message, 'error');
            } else {
                showAuthMessage('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
                formRecuperar.reset();
            }
        });
    }

    const formNovaSenha = document.getElementById('form-nova-senha');
    if (formNovaSenha) {
        formNovaSenha.addEventListener('submit', async (e) => {
            e.preventDefault();
            const novaSenha = document.getElementById('nova-senha').value;
            const confirmarSenha = document.getElementById('confirmar-nova-senha').value;
            if (novaSenha !== confirmarSenha) {
                showAuthMessage('As senhas não coincidem!', 'error');
                return;
            }
            const { error } = await _supabase.auth.updateUser({ password: novaSenha });
            if (error) {
                showAuthMessage('Erro ao atualizar senha: ' + error.message, 'error');
            } else {
                showAuthMessage('Senha atualizada com sucesso! Faça login com sua nova senha.', 'success');
                formNovaSenha.reset();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    }
}

// ==========================================
// 4. EVENTOS DE ENVIO (SUBMIT) DOS FORMULÁRIOS DO SISTEMA
// ==========================================

let galinhasData = [];
let vacasData = [];
let cavalosData = [];
let ovelhasData = [];
let lancamentosData = [];

function configurarFormulariosSistema() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
        });
    }

    const userAvatar = document.getElementById('userAvatar');
    const avatarInput = document.getElementById('avatarInput');
    if (userAvatar && avatarInput) {
        userAvatar.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64String = event.target.result;
                if (base64String.length > 100000) {
                    alert('A imagem é muito grande. Por favor, escolha uma imagem menor (máx 100kb).');
                    return;
                }
                const { error } = await _supabase.auth.updateUser({
                    data: { avatar_url: base64String }
                });
                if (error) {
                    alert('Erro ao atualizar avatar: ' + error.message);
                } else {
                    userAvatar.style.backgroundImage = `url(${base64String})`;
                    userAvatar.style.backgroundSize = 'cover';
                    userAvatar.style.backgroundPosition = 'center';
                    userAvatar.textContent = '';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    let sessionTimeout;
    const TIMEOUT_DURATION = 5 * 60 * 1000;
    function resetSessionTimeout() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(async () => {
            const { error } = await _supabase.auth.signOut();
            if (!error) {
                alert('Sessão expirada por inatividade. Faça login novamente.');
                window.location.href = 'login.html';
            }
        }, TIMEOUT_DURATION);
    }
    resetSessionTimeout();
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => document.addEventListener(event, resetSessionTimeout));

    const formGalinhas = document.getElementById('formGalinhas');
    if (formGalinhas) {
        formGalinhas.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const novoLote = {
                    lote: document.getElementById('loteGalinha').value,
                    linhagem: document.getElementById('linhagemGalinha').value,
                    quantidade: document.getElementById('quantidadeGalinha').value,
                    user_id: currentUser.id
                };
                const { error } = await _supabase.from('galinhas').insert([novoLote]);
                if (error) throw error;
                this.reset();
                await carregarGalinhas();
                updateDashboard();
            } catch (error) {
                alert('Erro ao salvar galinha: ' + error.message);
            }
        });
    }

    const formVacas = document.getElementById('formVacas');
    if (formVacas) {
        formVacas.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const novaVaca = {
                    idBrinco: document.getElementById('idVaca').value,
                    raca: document.getElementById('racaVaca').value,
                    categoria: document.getElementById('categoriaVaca').value,
                    peso: document.getElementById('pesoVaca').value,
                    dataEntrada: document.getElementById('dataEntradaVaca').value,
                    user_id: currentUser.id
                };
                const { error } = await _supabase.from('vacas').insert([novaVaca]);
                if (error) throw error;
                this.reset();
                await carregarVacas();
                updateDashboard();
            } catch (error) {
                alert('Erro ao salvar vaca: ' + error.message);
            }
        });
    }

    const formCavalos = document.getElementById('formCavalos');
    if (formCavalos) {
        formCavalos.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const novoCavalo = {
                    nome: document.getElementById('nomeCavalo').value,
                    raca: document.getElementById('racaCavalo').value,
                    pai: document.getElementById('paiCavalo').value || '-',
                    mae: document.getElementById('maeCavalo').value || '-',
                    nascimento: document.getElementById('nascimentoCavalo').value,
                    funcao: document.getElementById('funcaoCavalo').value,
                    user_id: currentUser.id
                };
                const { error } = await _supabase.from('cavalos').insert([novoCavalo]);
                if (error) throw error;
                this.reset();
                await carregarCavalos();
                updateDashboard();
            } catch (error) {
                alert('Erro ao salvar cavalo: ' + error.message);
            }
        });
    }

    const formOvelhas = document.getElementById('formOvelhas');
    if (formOvelhas) {
        formOvelhas.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const novaOvelha = {
                    idOvelha: document.getElementById('idOvelha').value,
                    raca: document.getElementById('racaOvelha').value,
                    tipoLa: document.getElementById('tipoLaOvelha').value,
                    idade: document.getElementById('idadeOvelha').value,
                    user_id: currentUser.id
                };
                const { error } = await _supabase.from('ovelhas').insert([novaOvelha]);
                if (error) throw error;
                this.reset();
                await carregarOvelhas();
                updateDashboard();
            } catch (error) {
                alert('Erro ao salvar ovelha: ' + error.message);
            }
        });
    }

    const formLancamento = document.getElementById('formLancamento');
    if (formLancamento) {
        formLancamento.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                const novoLancamento = {
                    data: document.getElementById('dataLancamento').value,
                    leite: document.getElementById('leiteLancamento').value,
                    ovos: document.getElementById('ovosLancamento').value,
                    la: document.getElementById('laLancamento').value,
                    user_id: currentUser.id
                };
                const { error } = await _supabase.from('lancamentos').insert([novoLancamento]);
                if (error) throw error;
                this.reset();
                document.getElementById('dataLancamento').value = new Date().toISOString().split('T')[0];
                await carregarLancamentos();
                updateDashboard();
            } catch (error) {
                alert('Erro ao salvar lançamento: ' + error.message);
            }
        });
    }
}

async function carregarDadosTodos() {
    try {
        await Promise.all([
            carregarGalinhas(),
            carregarVacas(),
            carregarCavalos(),
            carregarOvelhas(),
            carregarLancamentos()
        ]);
        updateDashboard();
    } catch (error) {
        alert('Erro ao carregar dados: ' + error.message);
    }
}

async function carregarGalinhas() {
    try {
        const { data, error } = await _supabase.from('galinhas').select('*').eq('user_id', currentUser.id);
        if (error) throw error;
        galinhasData = data || [];
        renderGalinhasList();
    } catch (error) {
        alert('Erro ao carregar galinhas: ' + error.message);
    }
}

async function carregarVacas() {
    try {
        const { data, error } = await _supabase.from('vacas').select('*').eq('user_id', currentUser.id);
        if (error) throw error;
        vacasData = data || [];
        renderVacasList();
    } catch (error) {
        alert('Erro ao carregar vacas: ' + error.message);
    }
}

async function carregarCavalos() {
    try {
        const { data, error } = await _supabase.from('cavalos').select('*').eq('user_id', currentUser.id);
        if (error) throw error;
        cavalosData = data || [];
        renderCavalosList();
    } catch (error) {
        alert('Erro ao carregar cavalos: ' + error.message);
    }
}

async function carregarOvelhas() {
    try {
        const { data, error } = await _supabase.from('ovelhas').select('*').eq('user_id', currentUser.id);
        if (error) throw error;
        ovelhasData = data || [];
        renderOvelhasList();
    } catch (error) {
        alert('Erro ao carregar ovelhas: ' + error.message);
    }
}

async function carregarLancamentos() {
    try {
        const { data, error } = await _supabase.from('lancamentos').select('*').eq('user_id', currentUser.id);
        if (error) throw error;
        lancamentosData = data || [];
        renderLancamentosList();
    } catch (error) {
        alert('Erro ao carregar lançamentos: ' + error.message);
    }
}

function showSection(sectionId) {
    if (isIndexPage) {
        showSectionIndex(sectionId);
        return;
    }
    document.querySelectorAll('.auth-section').forEach(section => {
        section.classList.add('hidden');
    });
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    hideAuthMessage();
}

function showAuthMessage(message, type) {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
        if (type === 'error') {
            messageEl.classList.remove('bg-red-100', 'text-red-800');
            messageEl.classList.add('bg-red-100', 'text-red-800');
        } else if (type === 'success') {
            messageEl.classList.remove('bg-red-100', 'text-red-800');
            messageEl.classList.add('bg-green-100', 'text-green-800');
        }
    }
}

function hideAuthMessage() {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.classList.add('hidden');
    }
}

function showSectionIndex(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
    refreshSectionData(sectionId);
}

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

function updateDashboard() {
    const totalGalinhas = galinhasData.reduce((sum, lote) => sum + parseInt(lote.quantidade || 0, 10), 0);
    const totalVacas = vacasData.length;
    const totalCavalos = cavalosData.length;
    const totalOvelhas = ovelhasData.length;
    const totalAnimais = totalGalinhas + totalVacas + totalCavalos + totalOvelhas;
    document.getElementById('totalAnimais').textContent = totalAnimais;
    document.getElementById('totalGalinhas').textContent = totalGalinhas;
    document.getElementById('totalVacas').textContent = totalVacas;
    document.getElementById('totalCavalos').textContent = totalCavalos;
    document.getElementById('totalOvelhas').textContent = totalOvelhas;
    const today = new Date().toISOString().split('T')[0];
    const todayLancamentos = lancamentosData.filter(l => l.data === today);
    const totalOvosHoje = todayLancamentos.reduce((sum, l) => sum + parseInt(l.ovos || 0, 10), 0);
    const totalLeiteHoje = todayLancamentos.reduce((sum, l) => sum + parseFloat(l.leite || 0), 0);
    const totalLaHoje = todayLancamentos.reduce((sum, l) => sum + parseFloat(l.la || 0), 0);
    document.getElementById('totalOvosHoje').textContent = totalOvosHoje;
    document.getElementById('totalLeiteHoje').textContent = totalLeiteHoje.toFixed(1) + ' L';
    document.getElementById('totalLaHoje').textContent = totalLaHoje.toFixed(1) + ' kg';
    renderUltimosLancamentos();
}

function renderUltimosLancamentos() {
    const container = document.getElementById('ultimosLancamentos');
    const recentLancamentos = [...lancamentosData].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
    if (recentLancamentos.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum lançamento registrado</p>';
        return;
    }
    container.innerHTML = recentLancamentos.map(l => `\n        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">\n            <div>\n                <p class="font-medium text-gray-800">${formatDate(l.data)}</p>\n                <p class="text-sm text-gray-500">Leite: ${l.leite}L | Ovos: ${l.ovos} | Lã: ${l.la}kg</p>\n            </div>\n        </div>\n    `).join('');
}

function renderGalinhasList() {
    const container = document.getElementById('listaGalinhas');
    if (!galinhasData.length) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum lote cadastrado</p>';
        return;
    }
    container.innerHTML = galinhasData.map(l => `\n        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">\n            <div>\n                <p class="font-bold text-green-800">${l.lote}</p>\n                <p class="text-sm text-gray-600">Raça: ${l.linhagem}</p>\n                <p class="text-sm text-gray-600">Quantidade: ${l.quantidade} aves</p>\n            </div>\n            <button onclick="deleteGalinha(${l.id})" class="btn-delete">Excluir</button>\n        </div>\n    `).join('');
}

async function deleteGalinha(id) {
    if (!confirm('Tem certeza que deseja excluir este lote?')) return;
    try {
        const { error } = await _supabase.from('galinhas').delete().eq('id', id);
        if (error) throw error;
        await carregarGalinhas();
        updateDashboard();
    } catch (error) {
        alert('Erro ao excluir lote: ' + error.message);
    }
}

function renderVacasList() {
    const tbody = document.getElementById('tbodyVacas');
    if (!vacasData.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum animal cadastrado</td></tr>';
        return;
    }
    tbody.innerHTML = vacasData.map(v => `\n        <tr class="border-b border-gray-100">\n            <td class="px-4 py-3">${v.idBrinco}</td>\n            <td class="px-4 py-3">${v.raca}</td>\n            <td class="px-4 py-3"><span class="badge badge-green">${v.categoria}</span></td>\n            <td class="px-4 py-3">${v.peso} kg</td>\n            <td class="px-4 py-3">\n                <button onclick="deleteVaca(${v.id})" class="btn-delete">Excluir</button>\n            </td>\n        </tr>\n    `).join('');
}

async function deleteVaca(id) {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return;
    try {
        const { error } = await _supabase.from('vacas').delete().eq('id', id);
        if (error) throw error;
        await carregarVacas();
        updateDashboard();
    } catch (error) {
        alert('Erro ao excluir vaca: ' + error.message);
    }
}

function renderCavalosList() {
    const tbody = document.getElementById('tbodyCavalos');
    if (!cavalosData.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum cavalo cadastrado</td></tr>';
        return;
    }
    tbody.innerHTML = cavalosData.map(c => `\n        <tr class="border-b border-gray-100">\n            <td class="px-4 py-3 font-medium">${c.nome}</td>\n            <td class="px-4 py-3">${c.raca}</td>\n            <td class="px-4 py-3"><span class="badge badge-blue">${c.funcao}</span></td>\n            <td class="px-4 py-3">${formatDate(c.nascimento)}</td>\n            <td class="px-4 py-3">\n                <button onclick="deleteCavalo(${c.id})" class="btn-delete">Excluir</button>\n            </td>\n        </tr>\n    `).join('');
}

async function deleteCavalo(id) {
    if (!confirm('Tem certeza que deseja excluir este cavalo?')) return;
    try {
        const { error } = await _supabase.from('cavalos').delete().eq('id', id);
        if (error) throw error;
        await carregarCavalos();
        updateDashboard();
    } catch (error) {
        alert('Erro ao excluir cavalo: ' + error.message);
    }
}

function renderOvelhasList() {
    const tbody = document.getElementById('tbodyOvelhas');
    if (!ovelhasData.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhuma ovelha cadastrada</td></tr>';
        return;
    }
    tbody.innerHTML = ovelhasData.map(o => `\n        <tr class="border-b border-gray-100">\n            <td class="px-4 py-3">${o.idOvelha}</td>\n            <td class="px-4 py-3">${o.raca}</td>\n            <td class="px-4 py-3"><span class="badge badge-purple">${o.tipoLa}</span></td>\n            <td class="px-4 py-3">${o.idade} anos</td>\n            <td class="px-4 py-3">\n                <button onclick="deleteOvelha(${o.id})" class="btn-delete">Excluir</button>\n            </td>\n        </tr>\n    `).join('');
}

async function deleteOvelha(id) {
    if (!confirm('Tem certeza que deseja excluir esta ovelha?')) return;
    try {
        const { error } = await _supabase.from('ovelhas').delete().eq('id', id);
        if (error) throw error;
        await carregarOvelhas();
        updateDashboard();
    } catch (error) {
        alert('Erro ao excluir ovelha: ' + error.message);
    }
}

function renderLancamentosList() {
    const tbody = document.getElementById('tbodyLancamentos');
    if (!lancamentosData.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum lançamento registrado</td></tr>';
        return;
    }
    const sortedLancamentos = [...lancamentosData].sort((a, b) => new Date(b.data) - new Date(a.data));
    tbody.innerHTML = sortedLancamentos.map(l => `\n        <tr class="border-b border-gray-100">\n            <td class="px-4 py-3 font-medium">${formatDate(l.data)}</td>\n            <td class="px-4 py-3">${l.leite} L</td>\n            <td class="px-4 py-3">${l.ovos}</td>\n            <td class="px-4 py-3">${l.la} kg</td>\n            <td class="px-4 py-3">\n                <button onclick="deleteLancamento(${l.id})" class="btn-delete">Excluir</button>\n            </td>\n        </tr>\n    `).join('');
}

async function deleteLancamento(id) {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;
    try {
        const { error } = await _supabase.from('lancamentos').delete().eq('id', id);
        if (error) throw error;
        await carregarLancamentos();
        updateDashboard();
    } catch (error) {
        alert('Erro ao excluir lançamento: ' + error.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}
