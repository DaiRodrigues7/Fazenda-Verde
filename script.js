// ==========================================
// FUNÇÕES GLOBAIS DE FORMULÁRIOS (SUPABASE)
// ==========================================

window.salvarGalinha = async function() {
    try {
        const novoLote = {
            user_id: currentUser.id,
            lote: document.getElementById('loteGalinha').value,
            linhagem: document.getElementById('linhagemGalinha').value,
            quantidade: document.getElementById('quantidadeGalinha').value
        };
        
        const { error } = await _supabase.from('galinhas').insert([novoLote]);
        if (error) throw error;
        
        document.getElementById('formGalinhas').reset();
        await carregarGalinhas();
        renderGalinhasList();
        updateDashboard();
    } catch (error) {
        alert('Erro ao salvar galinha: ' + error.message);
    }
};

window.salvarVaca = async function() {
    try {
        const novaVaca = {
            user_id: currentUser.id,
            brinco: document.getElementById('idVaca').value,
            raca: document.getElementById('racaVaca').value,
            categoria: document.getElementById('categoriaVaca').value,
            peso: document.getElementById('pesoVaca').value,
            data_entrada: document.getElementById('dataEntradaVaca').value
        };
        
        const { error } = await _supabase.from('vacas').insert([novaVaca]);
        if (error) throw error;
        
        document.getElementById('formVacas').reset();
        await carregarVacas();
        renderVacasList();
        updateDashboard();
    } catch (error) {
        alert('Erro ao salvar vaca: ' + error.message);
    }
};

window.salvarCavalo = async function() {
    try {
        const novoCavalo = {
            user_id: currentUser.id,
            nome: document.getElementById('nomeCavalo').value,
            raca: document.getElementById('racaCavalo').value,
            pai: document.getElementById('paiCavalo').value || '-',
            mae: document.getElementById('maeCavalo').value || '-',
            nascimento: document.getElementById('nascimentoCavalo').value,
            funcao: document.getElementById('funcaoCavalo').value
        };
        
        const { error } = await _supabase.from('cavalos').insert([novoCavalo]);
        if (error) throw error;
        
        document.getElementById('formCavalos').reset();
        await carregarCavalos();
        renderCavalosList();
        updateDashboard();
    } catch (error) {
        alert('Erro ao salvar cavalo: ' + error.message);
    }
};

window.salvarOvelha = async function() {
    try {
        const novaOvelha = {
            user_id: currentUser.id,
            brinco: document.getElementById('idOvelha').value,
            raca: document.getElementById('racaOvelha').value,
            tipo_la: document.getElementById('tipoLaOvelha').value,
            idade: document.getElementById('idadeOvelha').value
        };
        
        const { error } = await _supabase.from('ovelhas').insert([novaOvelha]);
        if (error) throw error;
        
        document.getElementById('formOvelhas').reset();
        await carregarOvelhas();
        renderOvelhasList();
        updateDashboard();
    } catch (error) {
        alert('Erro ao salvar ovelha: ' + error.message);
    }
};

window.salvarLancamento = async function() {
    try {
        const dataInput = document.getElementById('dataLancamento');
        const leiteInput = document.getElementById('leiteLancamento');
        const ovosInput = document.getElementById('ovosLancamento');
        const laInput = document.getElementById('laLancamento');
        
        const novoLancamento = {
            user_id: currentUser.id,
            data: dataInput.value || new Date().toISOString().split('T')[0],
            leite: leiteInput.value,
            ovos: ovosInput.value,
            la: laInput.value
        };
        
        const { error } = await _supabase.from('lancamentos').insert([novoLancamento]);
        if (error) throw error;
        
        document.getElementById('formLancamento').reset();
        // Reset date to today
        dataInput.value = new Date().toISOString().split('T')[0];
        await carregarLancamentos();
        renderLancamentosList();
        updateDashboard();
    } catch (error) {
        alert('Erro ao salvar lançamento: ' + error.message);
    }
};

// ==========================================
// FUNÇÃO GLOBAL DE LOGOUT
// ==========================================

window.fazerLogout = async function() {
    try {
        const { error } = await _supabase.auth.signOut();
        if (error) throw error;
        
        // Limpa o currentUser e redireciona
        currentUser = null;
        window.location.replace('login.html');
    } catch (error) {
        alert("Erro ao sair: " + error.message);
        // Força o redirecionamento mesmo se o Supabase falhar
        window.location.replace('login.html');
    }
};

// ==========================================
// 1. CONFIGURAÇÃO DO SUPABASE - FAZENDA VERDE
// ==========================================

const SUPABASE_URL = "https://awwddyhfynaiudoflydg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3d2RkeWhmeW5haXVkb2ZseWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5ODM5MzMsImV4cCI6MjA5NDU1OTkzM30.hiWLY2iqOFnqCpItVggjMDUUHFdzSnVhymkIn4yWyMw";

// Inicializa o cliente do Supabase
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variável global para armazenar os dados do usuário conectado
let currentUser = null;

// Verifica se estamos na página de login ou no index.html
const isLoginPage = window.location.pathname.includes('login.html');
const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');

// Executa assim que a página carrega completamente
window.addEventListener('DOMContentLoaded', async () => {
    // Se estiver na página de login, configura os formulários de autenticação
    if (isLoginPage) {
        configurarFormulariosAutenticacao();
        return;
    }
    
    // Se estiver no index.html, verifica autenticação e carrega o sistema
    if (isIndexPage) {
        // 1. Verifica se o usuário já está logado de uma sessão anterior
        const { data: { session }, error } = await _supabase.auth.getSession();
        
        if (session && session.user) {
            configurarInterfaceLogado(session.user);
            // Set default date for lancamento form
            const dataLancamento = document.getElementById('dataLancamento');
            if (dataLancamento) {
                dataLancamento.value = new Date().toISOString().split('T')[0];
            }
            // Set active nav link
            document.querySelector('[data-section="dashboard"]').classList.add('active');
        } else {
            // Redireciona para login se não estiver autenticado
            window.location.href = 'login.html';
        }

        // 2. Escuta mudanças no estado da autenticação (Login/Logout/Password Recovery)
        _supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                // Mostra o formulário de nova senha quando o usuário clica no link de recuperação
                showSection('nova-senha');
            } else if (session && session.user) {
                configurarInterfaceLogado(session.user);
            } else {
                configurarInterfaceDeslogado();
            }
        });

        // 3. Inicializa os ouvintes dos formulários do sistema
        configurarFormulariosSistema();
    }
});

// ==========================================
// 2. CONTROLE DE INTERFACE E AUTENTICAÇÃO
// ==========================================

async function configurarInterfaceLogado(user) {
    currentUser = user;
    
    // Exibe o email do usuário na sidebar
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl) userEmailEl.textContent = user.email;

    // Exibe a saudação com o nome do usuário
    const userGreetingEl = document.getElementById('userGreeting');
    if (userGreetingEl) {
        const firstName = user.user_metadata?.first_name || 'Usuário';
        userGreetingEl.textContent = `Olá, ${firstName}`;
    }

    // Exibe o avatar do usuário
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

    // Carrega os dados das tabelas para exibir na tela
    await carregarDadosTodos();
}

function configurarInterfaceDeslogado() {
    currentUser = null;
    
    // Se estiver no index.html e não estiver logado, redireciona para login.html
    if (isIndexPage) {
        window.location.href = 'login.html';
    }
}

// ==========================================
// 3. EVENTOS DE ENVIO (SUBMIT) DOS FORMULÁRIOS DE AUTENTICAÇÃO
// ==========================================

function configurarFormulariosAutenticacao() {
    // FORMULÁRIO DE CADASTRO (SIGN UP)
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

    // FORMULÁRIO DE LOGIN (SIGN IN)
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
                // Redireciona para index.html após login bem-sucedido
                window.location.href = 'index.html';
            }
        });
    }

    // FORMULÁRIO DE RECUPERAÇÃO DE SENHA
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

    // FORMULÁRIO DE NOVA SENHA (após recuperação)
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
// 4. EVENTOS DE ENVIO (SUBMIT) DOS FORMULÁRIOS DO SISTEMA (SUPABASE)
// ==========================================

function configurarFormulariosSistema() {
    // BOTÃO DE MENU HAMBÚRGUER (MOBILE)
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
        });
    }

    // AVATAR UPLOAD
    const userAvatar = document.getElementById('userAvatar');
    const avatarInput = document.getElementById('avatarInput');
    if (userAvatar && avatarInput) {
        userAvatar.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Convert to Base64 with size limit (max 100kb)
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64String = event.target.result;
                
                // Check if file is too large (simple check)
                if (base64String.length > 100000) {
                    alert('A imagem é muito grande. Por favor, escolha uma imagem menor (máx 100kb).');
                    return;
                }

                // Update user avatar in Supabase
                const { error } = await _supabase.auth.updateUser({
                    data: { avatar_url: base64String }
                });

                if (error) {
                    alert('Erro ao atualizar avatar: ' + error.message);
                } else {
                    // Update avatar display
                    userAvatar.style.backgroundImage = `url(${base64String})`;
                    userAvatar.style.backgroundSize = 'cover';
                    userAvatar.style.backgroundPosition = 'center';
                    userAvatar.textContent = '';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // SESSION TIMEOUT (5 minutos de inatividade)
    let sessionTimeout;
    const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

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

    // Inicia o timeout
    resetSessionTimeout();

    // Reseta o timeout em atividades do usuário
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
        document.addEventListener(event, resetSessionTimeout);
    });
}

// ==========================================
// 5. FUNÇÕES AUXILIARES PARA TELA DE LOGIN
// ==========================================

// Função para alternar entre as seções da tela de login
function showSection(sectionId) {
    // Se estiver no index.html, usa a função original de navegação
    if (isIndexPage) {
        showSectionIndex(sectionId);
        return;
    }
    
    // Se estiver no login.html, alterna entre formulários de autenticação
    document.querySelectorAll('.auth-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    hideAuthMessage();
}

// Função para mostrar mensagens de erro/sucesso na tela de login
function showAuthMessage(message, type) {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.remove('hidden');
        
        if (type === 'error') {
            messageEl.classList.remove('bg-green-100', 'text-green-800');
            messageEl.classList.add('bg-red-100', 'text-red-800');
        } else if (type === 'success') {
            messageEl.classList.remove('bg-red-100', 'text-red-800');
            messageEl.classList.add('bg-green-100', 'text-green-800');
        }
    }
}

// Função para esconder mensagens
function hideAuthMessage() {
    const messageEl = document.getElementById('auth-message');
    if (messageEl) {
        messageEl.classList.add('hidden');
    }
}

// ==========================================
// 6. FUNÇÕES DO SISTEMA (SUPABASE)
// ==========================================

// Variáveis globais para armazenar dados do Supabase
let galinhasData = [];
let vacasData = [];
let cavalosData = [];
let ovelhasData = [];
let lancamentosData = [];

// Funções para carregar dados do Supabase
async function carregarGalinhas() {
    try {
        const { data, error } = await _supabase
            .from('galinhas')
            .select('*')
            .eq('user_id', currentUser.id);
        if (error) throw error;
        galinhasData = data || [];
    } catch (error) {
        galinhasData = [];
    }
}

async function carregarVacas() {
    try {
        const { data, error } = await _supabase
            .from('vacas')
            .select('*')
            .eq('user_id', currentUser.id);
        if (error) throw error;
        vacasData = data || [];
    } catch (error) {
        vacasData = [];
    }
}

async function carregarCavalos() {
    try {
        const { data, error } = await _supabase
            .from('cavalos')
            .select('*')
            .eq('user_id', currentUser.id);
        if (error) throw error;
        cavalosData = data || [];
    } catch (error) {
        cavalosData = [];
    }
}

async function carregarOvelhas() {
    try {
        const { data, error } = await _supabase
            .from('ovelhas')
            .select('*')
            .eq('user_id', currentUser.id);
        if (error) throw error;
        ovelhasData = data || [];
    } catch (error) {
        ovelhasData = [];
    }
}

async function carregarLancamentos() {
    try {
        const { data, error } = await _supabase
            .from('lancamentos')
            .select('*')
            .eq('user_id', currentUser.id);
        if (error) throw error;
        lancamentosData = data || [];
    } catch (error) {
        lancamentosData = [];
    }
}

async function carregarDadosTodos() {
    await Promise.all([
        carregarGalinhas(),
        carregarVacas(),
        carregarCavalos(),
        carregarOvelhas(),
        carregarLancamentos()
    ]);
    // Atualiza a interface após carregar todos os dados
    updateDashboard();
    renderGalinhasList();
    renderVacasList();
    renderCavalosList();
    renderOvelhasList();
    renderLancamentosList();
}

// Navigation for index.html
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
    const totalGalinhas = galinhasData.reduce((sum, lote) => sum + parseInt(lote.quantidade || 0), 0);
    const totalVacas = vacasData.length;
    const totalCavalos = cavalosData.length;
    const totalOvelhas = ovelhasData.length;
    const totalAnimais = totalGalinhas + totalVacas + totalCavalos + totalOvelhas;
    
    document.getElementById('totalAnimais').textContent = totalAnimais;
    document.getElementById('totalGalinhas').textContent = totalGalinhas;
    document.getElementById('totalVacas').textContent = totalVacas;
    document.getElementById('totalCavalos').textContent = totalCavalos;
    document.getElementById('totalOvelhas').textContent = totalOvelhas;
    
    // Show totals from all lancamentos (not just today)
    const totalOvosHoje = lancamentosData.reduce((sum, l) => sum + parseInt(l.ovos || 0), 0);
    const totalLeiteHoje = lancamentosData.reduce((sum, l) => sum + parseFloat(l.leite || 0), 0);
    const totalLaHoje = lancamentosData.reduce((sum, l) => sum + parseFloat(l.la || 0), 0);
    
    const ovosEl = document.getElementById('totalOvosHoje');
    const leiteEl = document.getElementById('totalLeiteHoje');
    const laEl = document.getElementById('totalLaHoje');
    
    if (ovosEl) ovosEl.textContent = totalOvosHoje;
    if (leiteEl) leiteEl.textContent = totalLeiteHoje.toFixed(1) + ' L';
    if (laEl) laEl.textContent = totalLaHoje.toFixed(1) + ' kg';
    
    renderUltimosLancamentos();
}

function renderUltimosLancamentos() {
    const container = document.getElementById('ultimosLancamentos');
    const recentLancamentos = [...lancamentosData].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
    
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
function renderGalinhasList() {
    const container = document.getElementById('listaGalinhas');
    
    if (galinhasData.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum lote cadastrado</p>';
        return;
    }
    
    container.innerHTML = galinhasData.map(l => `
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
                <p class="font-bold text-green-800">${l.lote}</p>
                <p class="text-sm text-gray-600">Raça: ${l.linhagem}</p>
                <p class="text-sm text-gray-600">Quantidade: ${l.quantidade} aves</p>
            </div>
            <button onclick="deleteGalinha('${l.id}')" class="btn-delete">Excluir</button>
        </div>
    `).join('');
}

window.deleteGalinha = async function(id) {
    if (confirm('Tem certeza que deseja excluir este lote?')) {
        try {
            const { error } = await _supabase.from('galinhas').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
            await carregarGalinhas();
            renderGalinhasList();
            updateDashboard();
        } catch (error) {
            alert('Erro ao excluir galinha: ' + error.message);
        }
    }
}

// Vacas functions
function renderVacasList() {
    const tbody = document.getElementById('tbodyVacas');
    
    if (vacasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum animal cadastrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = vacasData.map(v => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3">${v.brinco}</td>
            <td class="px-4 py-3">${v.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-green">${v.categoria}</span></td>
            <td class="px-4 py-3">${v.peso} kg</td>
            <td class="px-4 py-3">
                <button onclick="deleteVaca('${v.id}')" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

window.deleteVaca = async function(id) {
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        try {
            const { error } = await _supabase.from('vacas').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
            await carregarVacas();
            renderVacasList();
            updateDashboard();
        } catch (error) {
            alert('Erro ao excluir vaca: ' + error.message);
        }
    }
}

// Cavalos functions
function renderCavalosList() {
    const tbody = document.getElementById('tbodyCavalos');
    
    if (cavalosData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum cavalo cadastrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = cavalosData.map(c => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3 font-medium">${c.nome}</td>
            <td class="px-4 py-3">${c.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-blue">${c.funcao}</span></td>
            <td class="px-4 py-3">${formatDate(c.nascimento)}</td>
            <td class="px-4 py-3">
                <button onclick="deleteCavalo('${c.id}')" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

window.deleteCavalo = async function(id) {
    if (confirm('Tem certeza que deseja excluir este cavalo?')) {
        try {
            const { error } = await _supabase.from('cavalos').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
            await carregarCavalos();
            renderCavalosList();
            updateDashboard();
        } catch (error) {
            alert('Erro ao excluir cavalo: ' + error.message);
        }
    }
}

// Ovelhas functions
function renderOvelhasList() {
    const tbody = document.getElementById('tbodyOvelhas');
    
    if (ovelhasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhuma ovelha cadastrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = ovelhasData.map(o => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3">${o.brinco}</td>
            <td class="px-4 py-3">${o.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-purple">${o.tipo_la}</span></td>
            <td class="px-4 py-3">${o.idade} anos</td>
            <td class="px-4 py-3">
                <button onclick="deleteOvelha('${o.id}')" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

window.deleteOvelha = async function(id) {
    if (confirm('Tem certeza que deseja excluir esta ovelha?')) {
        try {
            const { error } = await _supabase.from('ovelhas').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
            await carregarOvelhas();
            renderOvelhasList();
            updateDashboard();
        } catch (error) {
            alert('Erro ao excluir ovelha: ' + error.message);
        }
    }
}

// Lancamento functions
function renderLancamentosList() {
    const tbody = document.getElementById('tbodyLancamentos');
    
    if (lancamentosData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum lançamento registrado</td></tr>';
        return;
    }
    
    const sortedLancamentos = [...lancamentosData].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    tbody.innerHTML = sortedLancamentos.map(l => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3 font-medium">${formatDate(l.data)}</td>
            <td class="px-4 py-3">${l.leite} L</td>
            <td class="px-4 py-3">${l.ovos}</td>
            <td class="px-4 py-3">${l.la} kg</td>
            <td class="px-4 py-3">
                <button onclick="deleteLancamento('${l.id}')" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');
}

window.deleteLancamento = async function(id) {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
        try {
            const { error } = await _supabase.from('lancamentos').delete().eq('id', id).eq('user_id', currentUser.id);
            if (error) throw error;
            await carregarLancamentos();
            renderLancamentosList();
            updateDashboard();
        } catch (error) {
            alert('Erro ao excluir lançamento: ' + error.message);
        }
    }
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}