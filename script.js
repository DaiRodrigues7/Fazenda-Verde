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
        const form = document.getElementById('formVacas');
        const editId = form?.dataset.editing;
        const vacaData = {
            user_id: currentUser.id,
            brinco: document.getElementById('idVaca').value,
            raca: document.getElementById('racaVaca').value,
            categoria: document.getElementById('categoriaVaca').value,
            peso: document.getElementById('pesoVaca').value,
            data_entrada: document.getElementById('dataEntradaVaca').value
        };

        if (editId) {
            const { error } = await _supabase.from('vacas').update(vacaData).eq('id', editId).eq('user_id', currentUser.id);
            if (error) throw error;
            delete form.dataset.editing;
            document.querySelector('#formVacas button[type="button"]').textContent = 'Cadastrar Animal';
        } else {
            const { error } = await _supabase.from('vacas').insert([vacaData]);
            if (error) throw error;
        }
        
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
        const form = document.getElementById('formCavalos');
        const editId = form?.dataset.editing;
        const cavaloData = {
            user_id: currentUser.id,
            nome: document.getElementById('nomeCavalo').value,
            raca: document.getElementById('racaCavalo').value,
            pai: document.getElementById('paiCavalo').value || '-',
            mae: document.getElementById('maeCavalo').value || '-',
            nascimento: document.getElementById('nascimentoCavalo').value,
            funcao: document.getElementById('funcaoCavalo').value
        };
        
        if (editId) {
            const { error } = await _supabase.from('cavalos').update(cavaloData).eq('id', editId).eq('user_id', currentUser.id);
            if (error) throw error;
            delete form.dataset.editing;
            document.querySelector('#formCavalos button[type="button"]').textContent = 'Cadastrar Cavalo';
        } else {
            const { error } = await _supabase.from('cavalos').insert([cavaloData]);
            if (error) throw error;
        }
        
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
        const form = document.getElementById('formOvelhas');
        const editId = form?.dataset.editing;
        const ovelhaData = {
            user_id: currentUser.id,
            brinco: document.getElementById('idOvelha').value,
            raca: document.getElementById('racaOvelha').value,
            tipo_la: document.getElementById('tipoLaOvelha').value,
            idade: document.getElementById('idadeOvelha').value
        };
        
        if (editId) {
            const { error } = await _supabase.from('ovelhas').update(ovelhaData).eq('id', editId).eq('user_id', currentUser.id);
            if (error) throw error;
            delete form.dataset.editing;
            document.querySelector('#formOvelhas button[type="button"]').textContent = 'Cadastrar Ovelha';
        } else {
            const { error } = await _supabase.from('ovelhas').insert([ovelhaData]);
            if (error) throw error;
        }
        
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
let profileAvatarBase64 = null;
let currentActionPopup = null;
let currentEditContext = null;
let currentReportData = null;

// Verifica se estamos na página de login ou no index.html
const isLoginPage = window.location.pathname.includes('login.html');
const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
const isProfilePage = window.location.pathname.includes('perfil.html') || window.location.pathname.includes('profile.html');

// Executa assim que a página carrega completamente
window.addEventListener('DOMContentLoaded', async () => {
    // Se estiver na página de login, configura os formulários de autenticação
    if (isLoginPage) {
        configurarFormulariosAutenticacao();
        return;
    }
    
    // Se estiver na página de perfil, verifica autenticação e carrega o perfil
    if (isProfilePage) {
        const { data: { session }, error } = await _supabase.auth.getSession();
        if (session && session.user) {
            configurarInterfaceLogado(session.user);
            configurarFormulariosSistema();
        } else {
            window.location.href = 'login.html';
        }

        _supabase.auth.onAuthStateChange((event, session) => {
            if (session && session.user) {
                configurarInterfaceLogado(session.user);
            } else {
                configurarInterfaceDeslogado();
            }
        });
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

    if (isProfilePage) {
        loadProfileForm();
    }
}

function loadProfileForm() {
    if (!currentUser) return;

    const nameField = document.getElementById('profileName');
    const emailField = document.getElementById('profileEmail');
    const phoneField = document.getElementById('profilePhone');
    const displayName = document.getElementById('profileDisplayName');
    const displayEmail = document.getElementById('profileDisplayEmail');
    const displayPhone = document.getElementById('profileDisplayPhone');
    const profileAvatarPreview = document.getElementById('profileAvatarPreview');

    const firstName = currentUser.user_metadata?.first_name || '';
    const lastName = currentUser.user_metadata?.last_name || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || currentUser.email;
    const email = currentUser.email || '';
    const phone = currentUser.user_metadata?.phone || '';
    const avatarUrl = currentUser.user_metadata?.avatar_url || '';

    if (nameField) nameField.value = fullName;
    if (emailField) emailField.value = email;
    if (phoneField) phoneField.value = phone;
    if (displayName) displayName.textContent = fullName;
    if (displayEmail) displayEmail.textContent = email;
    if (displayPhone) displayPhone.textContent = phone || 'Não informado';

    const avatarFallback = avatarUrl || fullName.charAt(0).toUpperCase();
    setProfileAvatarPreview(avatarFallback);
    profileAvatarBase64 = avatarUrl && avatarUrl.startsWith('data:') ? avatarUrl : null;
}

function setProfileAvatarPreview(value) {
    const profileAvatarPreview = document.getElementById('profileAvatarPreview');
    if (!profileAvatarPreview) return;

    if (!value) {
        profileAvatarPreview.style.backgroundImage = 'none';
        profileAvatarPreview.textContent = 'U';
        return;
    }

    if (value.startsWith('data:')) {
        profileAvatarPreview.style.backgroundImage = `url(${value})`;
        profileAvatarPreview.style.backgroundSize = 'cover';
        profileAvatarPreview.style.backgroundPosition = 'center';
        profileAvatarPreview.textContent = '';
        return;
    }

    if (value.length === 1) {
        profileAvatarPreview.style.backgroundImage = 'none';
        profileAvatarPreview.textContent = value.toUpperCase();
        return;
    }

    profileAvatarPreview.style.backgroundImage = `url(${value})`;
    profileAvatarPreview.style.backgroundSize = 'cover';
    profileAvatarPreview.style.backgroundPosition = 'center';
    profileAvatarPreview.textContent = '';
}

function showProfileMessage(message, type) {
    const messageEl = document.getElementById('profile-message');
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
    messageEl.classList.add(type === 'error' ? 'bg-red-100' : 'bg-green-100', type === 'error' ? 'text-red-800' : 'text-green-800');
}

function hideProfileMessage() {
    const messageEl = document.getElementById('profile-message');
    if (messageEl) {
        messageEl.classList.add('hidden');
    }
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(phone) {
    return phone.trim() === '' || /^\+?[0-9\s()-]{8,20}$/.test(phone);
}

async function salvarPerfil(e) {
    if (e) e.preventDefault();
    hideProfileMessage();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const nameField = document.getElementById('profileName');
    const emailField = document.getElementById('profileEmail');
    const phoneField = document.getElementById('profilePhone');
    const passwordField = document.getElementById('profileSenha');
    const confirmPasswordField = document.getElementById('profileConfirmarSenha');
    const saveButton = document.getElementById('saveProfileButton');

    const name = nameField?.value.trim() || '';
    const email = emailField?.value.trim() || '';
    const phone = phoneField?.value.trim() || '';
    const senha = passwordField?.value || '';
    const confirmarSenha = confirmPasswordField?.value || '';

    if (!name) {
        showProfileMessage('O nome de usuário é obrigatório.', 'error');
        return;
    }

    if (!validarEmail(email)) {
        showProfileMessage('Informe um e-mail válido.', 'error');
        return;
    }

    if (!validarTelefone(phone)) {
        showProfileMessage('Informe um número de contato válido.', 'error');
        return;
    }

    if (senha && senha !== confirmarSenha) {
        showProfileMessage('As senhas não coincidem.', 'error');
        return;
    }

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';
    }

    try {
        const [firstName, ...restName] = name.split(' ');
        const lastName = restName.join(' ');
        const updates = {
            data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                avatar_url: profileAvatarBase64 || ''
            }
        };

        if (email !== currentUser.email) updates.email = email;
        if (senha) updates.password = senha;

        const { data, error } = await _supabase.auth.updateUser(updates);
        if (error) throw error;

        // Re-fetch fresh user state to ensure metadata persisted
        const { data: userData, error: userFetchError } = await _supabase.auth.getUser();
        const updatedUser = (userData && userData.user) ? userData.user : (data?.user || currentUser);
        currentUser = updatedUser;
        configurarInterfaceLogado(currentUser);
        loadProfileForm();
        showProfileMessage('Perfil atualizado com sucesso.', 'success');
        if (passwordField) passwordField.value = '';
        if (confirmPasswordField) confirmPasswordField.value = '';
    } catch (error) {
        showProfileMessage('Erro ao salvar perfil: ' + error.message, 'error');
    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = 'Salvar alterações';
        }
    }
}

async function excluirConta() {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação removerá seus dados do aplicativo e encerrará sua sessão.')) {
        return;
    }

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const deleteButton = document.getElementById('deleteAccountButton');
    if (deleteButton) {
        deleteButton.disabled = true;
        deleteButton.textContent = 'Excluindo...';
    }

    try {
        const tables = ['galinhas', 'vacas', 'cavalos', 'ovelhas', 'lancamentos'];
        for (const table of tables) {
            await _supabase.from(table).delete().eq('user_id', currentUser.id);
        }

        await _supabase.auth.signOut();
        alert('Sua conta e dados foram removidos localmente. Faça login novamente para criar uma nova conta.');
        window.location.href = 'login.html';
    } catch (error) {
        showProfileMessage('Erro ao excluir conta: ' + error.message, 'error');
    } finally {
        if (deleteButton) {
            deleteButton.disabled = false;
            deleteButton.textContent = 'Excluir conta';
        }
    }
}

function setupProfileActions() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', salvarPerfil);
    }

    const deleteButton = document.getElementById('deleteAccountButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', excluirConta);
    }
}

function renderProfileCurrentUser() {
    if (isProfilePage) {
        setupProfileActions();
    }
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
    
    function toggleSidebar(e) {
        e.preventDefault(); // Evita fantasmas de clique no iOS
        if (window.innerWidth < 768) {
            // Em mobile, alterna entre escondido e visível
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('translate-x-0');
            } else {
                sidebar.classList.add('-translate-x-full');
                sidebar.classList.remove('translate-x-0');
            }
        }
    }
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', toggleSidebar);
        menuToggle.addEventListener('touchstart', toggleSidebar, { passive: false });
    }
    
    // Fecha o menu ao clicar fora dele em mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && 
            sidebar && 
            !sidebar.contains(e.target) && 
            menuToggle && 
            !menuToggle.contains(e.target) &&
            !sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
        }
    });

    // AVATAR CLICK / UPLOAD
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        if (isIndexPage) {
            userAvatar.addEventListener('click', () => {
                window.location.href = 'perfil.html';
            });
        }

        if (isProfilePage) {
            const profileAvatarInput = document.getElementById('profileAvatarInput');
            const profileAvatarPreview = document.getElementById('profileAvatarPreview');

            if (profileAvatarPreview) {
                profileAvatarPreview.addEventListener('click', () => {
                    if (profileAvatarInput) {
                        profileAvatarInput.click();
                    }
                });
            }

            if (profileAvatarInput) {
                profileAvatarInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64String = event.target.result;
                        if (base64String.length > 100000) {
                            showProfileMessage('A imagem é muito grande. Escolha um arquivo menor (máx 100kb).', 'error');
                            return;
                        }
                        profileAvatarBase64 = base64String;
                        if (profileAvatarPreview) {
                            profileAvatarPreview.style.backgroundImage = `url(${base64String})`;
                            profileAvatarPreview.style.backgroundSize = 'cover';
                            profileAvatarPreview.style.backgroundPosition = 'center';
                            profileAvatarPreview.textContent = '';
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    }

    if (isProfilePage) {
        setupProfileActions();
    }

    if (isIndexPage) {
        setupReportModule();
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
        case 'relatorios':
            renderReportSection();
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

function getAnimalById(type, id) {
    switch (type) {
        case 'vacas': return vacasData.find(item => String(item.id) === String(id));
        case 'cavalos': return cavalosData.find(item => String(item.id) === String(id));
        case 'ovelhas': return ovelhasData.find(item => String(item.id) === String(id));
        default: return null;
    }
}

function showAnimalActionMenu(type, id, label, event) {
    event.stopPropagation();
    const popup = document.getElementById('animal-action-popup');
    if (!popup) return;

    const rect = event.currentTarget.getBoundingClientRect();
    popup.style.top = `${window.scrollY + rect.bottom + 8}px`;
    popup.style.left = `${Math.min(window.scrollX + rect.left, window.innerWidth - 300)}px`;

    popup.innerHTML = `
        <div class="font-semibold text-gray-800 mb-2">${label}</div>
        <button type="button" class="animal-action-option" onclick="onAnimalActionSelect('editar', '${type}', '${id}')">Editar dados</button>
        <button type="button" class="animal-action-option" onclick="onAnimalActionSelect('vacina', '${type}', '${id}')">Registrar vacina</button>
        <button type="button" class="animal-action-option" onclick="onAnimalActionSelect('pesagem', '${type}', '${id}')">Registrar pesagem</button>
        <button type="button" class="animal-action-option" onclick="onAnimalActionSelect('producao', '${type}', '${id}')">Registrar produção</button>
        <button type="button" class="animal-action-option" onclick="onAnimalActionSelect('historico', '${type}', '${id}')">Histórico</button>
    `;

    popup.classList.remove('hidden');
    currentActionPopup = popup;
}

function hideAnimalActionPopup() {
    const popup = document.getElementById('animal-action-popup');
    if (popup) {
        popup.classList.add('hidden');
    }
    currentActionPopup = null;
}

function onAnimalActionSelect(action, type, id) {
    hideAnimalActionPopup();
    const item = getAnimalById(type, id);
    if (!item) return;

    switch (action) {
        case 'editar':
            openEditAnimal(type, id);
            break;
        case 'vacina':
            openActionModal('Registrar vacina', `Registro de vacina para ${type === 'cavalos' ? item.nome : item.brinco}.`);
            break;
        case 'pesagem':
            openActionModal('Registrar pesagem', `Atualize o peso em quilogramas para ${type === 'cavalos' ? item.nome : item.brinco}.`);
            break;
        case 'producao':
            showSection('lancamento');
            break;
        case 'historico':
            showSection('lancamento');
            break;
    }
}

function openActionModal(title, content) {
    const modal = document.getElementById('animal-action-modal');
    const contentEl = document.getElementById('animal-action-modal-content');
    const titleEl = document.getElementById('animal-action-modal-title');
    if (!modal || !contentEl || !titleEl) return;

    titleEl.textContent = title;
    contentEl.innerHTML = `<p class="text-gray-600">${content}</p>`;
    modal.classList.add('open');
}

function closeAnimalActionModal() {
    const modal = document.getElementById('animal-action-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function openEditAnimal(type, id) {
    const item = getAnimalById(type, id);
    if (!item) return;

    showSection(type);
    currentEditContext = { type, id };

    if (type === 'vacas') {
        const form = document.getElementById('formVacas');
        if (form) form.dataset.editing = id;
        document.getElementById('idVaca').value = item.brinco || '';
        document.getElementById('racaVaca').value = item.raca || '';
        document.getElementById('categoriaVaca').value = item.categoria || '';
        document.getElementById('pesoVaca').value = item.peso || '';
        document.getElementById('dataEntradaVaca').value = item.data_entrada || '';
        document.querySelector('#formVacas button[type="button"]').textContent = 'Atualizar animal';
    }
    if (type === 'cavalos') {
        const form = document.getElementById('formCavalos');
        if (form) form.dataset.editing = id;
        document.getElementById('nomeCavalo').value = item.nome || '';
        document.getElementById('racaCavalo').value = item.raca || '';
        document.getElementById('paiCavalo').value = item.pai || '';
        document.getElementById('maeCavalo').value = item.mae || '';
        document.getElementById('nascimentoCavalo').value = item.nascimento || '';
        document.getElementById('funcaoCavalo').value = item.funcao || '';
        document.querySelector('#formCavalos button[type="button"]').textContent = 'Atualizar animal';
    }
    if (type === 'ovelhas') {
        const form = document.getElementById('formOvelhas');
        if (form) form.dataset.editing = id;
        document.getElementById('idOvelha').value = item.brinco || '';
        document.getElementById('racaOvelha').value = item.raca || '';
        document.getElementById('tipoLaOvelha').value = item.tipo_la || '';
        document.getElementById('idadeOvelha').value = item.idade || '';
        document.querySelector('#formOvelhas button[type="button"]').textContent = 'Atualizar animal';
    }
}

document.addEventListener('click', (event) => {
    if (currentActionPopup) {
        const popup = currentActionPopup;
        if (!popup.contains(event.target)) {
            hideAnimalActionPopup();
        }
    }
});

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
    const cards = document.getElementById('cardsVacas');
    
    if (vacasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum animal cadastrado</td></tr>';
        if (cards) cards.innerHTML = '<div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500">Nenhum animal cadastrado</div>';
        return;
    }
    
    tbody.innerHTML = vacasData.map(v => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3">
                <button type="button" class="text-left text-green-700 font-medium hover:underline" onclick="showAnimalActionMenu('vacas', '${v.id}', '${v.brinco}', event)">${v.brinco}</button>
            </td>
            <td class="px-4 py-3">${v.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-green">${v.categoria}</span></td>
            <td class="px-4 py-3">${v.peso} kg</td>
            <td class="px-4 py-3">
                <button onclick="deleteVaca('${v.id}')" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');

    if (cards) {
        cards.innerHTML = vacasData.map(v => `
            <div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <button type="button" class="text-left text-green-700 font-semibold text-base hover:underline" onclick="showAnimalActionMenu('vacas', '${v.id}', '${v.brinco}', event)">${v.brinco}</button>
                    <button onclick="deleteVaca('${v.id}')" class="btn-delete">Excluir</button>
                </div>
                <p class="text-sm text-gray-600">Raça: ${v.raca}</p>
                <p class="text-sm text-gray-600">Categoria: ${v.categoria}</p>
                <p class="text-sm text-gray-600">Peso: ${v.peso} kg</p>
            </div>
        `).join('');
    }
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
    const cards = document.getElementById('cardsCavalos');
    
    if (cavalosData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum cavalo cadastrado</td></tr>';
        if (cards) cards.innerHTML = '<div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500">Nenhum cavalo cadastrado</div>';
        return;
    }
    
    tbody.innerHTML = cavalosData.map(c => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3 font-medium">
                <button type="button" class="text-left text-green-700 font-medium hover:underline" onclick="showAnimalActionMenu('cavalos', '${c.id}', '${c.nome}', event)">${c.nome}</button>
            </td>
            <td class="px-4 py-3">${c.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-blue">${c.funcao}</span></td>
            <td class="px-4 py-3">${formatDate(c.nascimento)}</td>
            <td class="px-4 py-3">
                <button onclick="deleteCavalo('${c.id}')" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');

    if (cards) {
        cards.innerHTML = cavalosData.map(c => `
            <div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <button type="button" class="text-left text-green-700 font-semibold text-base hover:underline" onclick="showAnimalActionMenu('cavalos', '${c.id}', '${c.nome}', event)">${c.nome}</button>
                    <button onclick="deleteCavalo('${c.id}')" class="btn-delete">Excluir</button>
                </div>
                <p class="text-sm text-gray-600">Raça: ${c.raca}</p>
                <p class="text-sm text-gray-600">Função: ${c.funcao}</p>
                <p class="text-sm text-gray-600">Nascimento: ${formatDate(c.nascimento)}</p>
            </div>
        `).join('');
    }
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
    const cards = document.getElementById('cardsOvelhas');
    
    if (ovelhasData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhuma ovelha cadastrada</td></tr>';
        if (cards) cards.innerHTML = '<div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500">Nenhuma ovelha cadastrada</div>';
        return;
    }
    
    tbody.innerHTML = ovelhasData.map(o => `
        <tr class="border-b border-gray-100">
            <td class="px-4 py-3">
                <button type="button" class="text-left text-green-700 font-medium hover:underline" onclick="showAnimalActionMenu('ovelhas', '${o.id}', '${o.brinco}', event)">${o.brinco}</button>
            </td>
            <td class="px-4 py-3">${o.raca}</td>
            <td class="px-4 py-3"><span class="badge badge-purple">${o.tipo_la}</span></td>
            <td class="px-4 py-3">${o.idade} anos</td>
            <td class="px-4 py-3">
                <button onclick="deleteOvelha('${o.id}')" class="btn-delete">Excluir</button>
            </td>
        </tr>
    `).join('');

    if (cards) {
        cards.innerHTML = ovelhasData.map(o => `
            <div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <button type="button" class="text-left text-green-700 font-semibold text-base hover:underline" onclick="showAnimalActionMenu('ovelhas', '${o.id}', '${o.brinco}', event)">${o.brinco}</button>
                    <button onclick="deleteOvelha('${o.id}')" class="btn-delete">Excluir</button>
                </div>
                <p class="text-sm text-gray-600">Raça: ${o.raca}</p>
                <p class="text-sm text-gray-600">Tipo de lã: ${o.tipo_la}</p>
                <p class="text-sm text-gray-600">Idade: ${o.idade} anos</p>
            </div>
        `).join('');
    }
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
    const cards = document.getElementById('cardsLancamentos');
    
    if (lancamentosData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-4 text-center text-gray-500">Nenhum lançamento registrado</td></tr>';
        if (cards) cards.innerHTML = '<div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500">Nenhum lançamento registrado</div>';
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

    if (cards) {
        cards.innerHTML = sortedLancamentos.map(l => `
            <div class="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <p class="font-semibold text-gray-800">${formatDate(l.data)}</p>
                    <button onclick="deleteLancamento('${l.id}')" class="btn-delete">Excluir</button>
                </div>
                <p class="text-sm text-gray-600">Leite: ${l.leite} L</p>
                <p class="text-sm text-gray-600">Ovos: ${l.ovos}</p>
                <p class="text-sm text-gray-600">Lã: ${l.la} kg</p>
            </div>
        `).join('');
    }
}

function setupReportModule() {
    const reportPeriod = document.getElementById('reportPeriod');
    const startDateInput = document.getElementById('reportStartDate');
    const endDateInput = document.getElementById('reportEndDate');
    const generateButton = document.getElementById('generateReportBtn');
    const downloadButton = document.getElementById('downloadReportBtn');

    function updateCustomDateFields() {
        const custom = reportPeriod && reportPeriod.value === 'personalizado';
        if (startDateInput) startDateInput.disabled = !custom;
        if (endDateInput) endDateInput.disabled = !custom;
    }

    if (reportPeriod) {
        reportPeriod.addEventListener('change', () => {
            updateCustomDateFields();
            renderReportSection();
        });
    }

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            const result = generateReportData();
            if (result) {
                currentReportData = result;
                renderReportPreview(result);
                if (downloadButton) {
                    downloadButton.disabled = false;
                }
            }
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            if (!currentReportData) return;
            downloadPdfReport(currentReportData);
        });
    }

    updateCustomDateFields();
}

function renderReportSection() {
    const reportPreview = document.getElementById('reportPreview');
    const message = document.getElementById('reportMessage');
    const downloadButton = document.getElementById('downloadReportBtn');
    currentReportData = null;
    if (message) message.classList.add('hidden');
    if (reportPreview) reportPreview.classList.add('hidden');
    if (downloadButton) downloadButton.disabled = true;
}

function getReportRange() {
    const period = document.getElementById('reportPeriod')?.value || 'dia';
    const startInput = document.getElementById('reportStartDate');
    const endInput = document.getElementById('reportEndDate');
    const today = new Date();
    let start = new Date(today.setHours(0,0,0,0));
    let end = new Date(today.setHours(23,59,59,999));

    switch (period) {
        case 'semana':
            start = new Date();
            start.setDate(start.getDate() - 6);
            start.setHours(0,0,0,0);
            break;
        case 'mes':
            start = new Date();
            start.setDate(1);
            start.setHours(0,0,0,0);
            break;
        case 'ano':
            start = new Date();
            start.setMonth(0,0);
            start.setHours(0,0,0,0);
            break;
        case 'personalizado':
            if (startInput && startInput.value) {
                start = new Date(startInput.value);
                start.setHours(0,0,0,0);
            }
            if (endInput && endInput.value) {
                end = new Date(endInput.value);
                end.setHours(23,59,59,999);
            }
            break;
        case 'dia':
        default:
            start = new Date();
            start.setHours(0,0,0,0);
            break;
    }

    return { start, end, label: getReportPeriodLabel(period, start, end) };
}

function getReportPeriodLabel(period, start, end) {
    const format = (date) => date.toLocaleDateString('pt-BR');
    switch (period) {
        case 'dia':
            return `Dia (${format(start)})`;
        case 'semana':
            return `Semana (${format(start)} - ${format(end)})`;
        case 'mes':
            return `Mês (${format(start)} - ${format(end)})`;
        case 'ano':
            return `Ano (${format(start).slice(-4)})`;
        case 'personalizado':
            return `${format(start)} até ${format(end)}`;
        default:
            return `${format(start)} - ${format(end)}`;
    }
}

function filterItemsByPeriod(items, dateField, start, end) {
    return items.filter(item => {
        const value = item[dateField] || item.created_at;
        if (!value) return false;
        const date = new Date(value);
        return date >= start && date <= end;
    });
}

function generateReportData() {
    const range = getReportRange();
    const report = {
        generatedAt: new Date(),
        periodLabel: range.label,
        farmName: currentUser?.user_metadata?.farm_name || currentUser?.user_metadata?.first_name || 'Fazenda Agropecuária',
        period: `${range.start.toLocaleDateString('pt-BR')} - ${range.end.toLocaleDateString('pt-BR')}`,
        animals: {
            totalVacas: vacasData.length,
            totalCavalos: cavalosData.length,
            totalOvelhas: ovelhasData.length,
            raças: {},
            entriesInPeriod: 0
        },
        production: {
            records: [],
            totalLeite: 0,
            totalOvos: 0,
            totalLa: 0
        },
        vaccines: { records: [], distinctAnimals: 0, upcoming: 0 },
        weights: { records: [], lastWeights: [], averageWeight: 0, count: 0 },
        history: []
    };

    const productionRecords = filterItemsByPeriod(lancamentosData, 'data', range.start, range.end);
    report.production.records = productionRecords;
    report.production.totalLeite = productionRecords.reduce((sum, item) => sum + parseFloat(item.leite || 0), 0);
    report.production.totalOvos = productionRecords.reduce((sum, item) => sum + parseInt(item.ovos || 0), 0);
    report.production.totalLa = productionRecords.reduce((sum, item) => sum + parseFloat(item.la || 0), 0);

    const animalEntries = [...vacasData, ...cavalosData, ...ovelhasData].filter(item => {
        const date = item.created_at ? new Date(item.created_at) : new Date(item.data_entrada || item.nascimento || null);
        return date instanceof Date && !isNaN(date) && date >= range.start && date <= range.end;
    });
    report.animals.entriesInPeriod = animalEntries.length;

    const allAnimals = [...vacasData, ...cavalosData, ...ovelhasData];
    allAnimals.forEach(item => {
        const key = item.raca || item.tipo_la || 'Indefinido';
        report.animals.raças[key] = (report.animals.raças[key] || 0) + 1;
    });

    report.weights.lastWeights = vacasData.map(item => ({
        id: item.id,
        name: item.brinco || 'Vaca',
        lastWeight: item.peso ? `${item.peso} kg` : 'Não informado'
    }));
    const weights = vacasData.map(item => parseFloat(item.peso || 0)).filter(Boolean);
    report.weights.count = weights.length;
    report.weights.averageWeight = weights.length ? (weights.reduce((sum, v) => sum + v, 0) / weights.length).toFixed(1) : 0;
    report.weights.records = report.weights.lastWeights;

    report.vaccines.records = []; // No vaccine table available in current schema
    report.vaccines.distinctAnimals = 0;
    report.vaccines.upcoming = 0;

    const historyItems = [];
    productionRecords.forEach(item => {
        historyItems.push({
            date: new Date(item.data),
            message: `Produção registrada: ${item.leite || 0}L, ${item.ovos || 0} ovos, ${item.la || 0}kg de lã.`
        });
    });
    animalEntries.forEach(item => {
        const date = item.created_at ? new Date(item.created_at) : new Date(item.data_entrada || item.nascimento || null);
        if (!(date instanceof Date) || isNaN(date)) return;
        const label = item.brinco || item.nome || 'Animal';
        historyItems.push({
            date,
            message: `Entrada cadastrada: ${label} (${item.raca || item.tipo_la || 'sem raça'})`
        });
    });
    report.history = historyItems.sort((a, b) => a.date - b.date).map(item => `${item.date.toLocaleDateString('pt-BR')} - ${item.message}`);

    return report;
}

function renderReportPreview(report) {
    document.getElementById('reportPreview')?.classList.remove('hidden');
    document.getElementById('reportTotalVacas').textContent = report.animals.totalVacas;
    document.getElementById('reportTotalCavalos').textContent = report.animals.totalCavalos;
    document.getElementById('reportTotalOvelhas').textContent = report.animals.totalOvelhas;
    document.getElementById('reportProductionCount').textContent = report.production.records.length;
    document.getElementById('reportTotalLeite').textContent = report.production.totalLeite.toFixed(1);
    document.getElementById('reportTotalOvos').textContent = report.production.totalOvos;
    document.getElementById('reportTotalLa').textContent = report.production.totalLa.toFixed(1);
    document.getElementById('reportVaccineCount').textContent = report.vaccines.records.length;
    document.getElementById('reportVaccinatedAnimals').textContent = report.vaccines.distinctAnimals;
    document.getElementById('reportUpcomingVaccines').textContent = report.vaccines.upcoming;
    document.getElementById('reportWeightCount').textContent = report.weights.records.length;
    document.getElementById('reportLastWeights').textContent = report.weights.records.length ? report.weights.records.map(item => `${item.name}: ${item.lastWeight}`).join(' | ') : 'Nenhum registro';
    document.getElementById('reportAverageWeight').textContent = report.weights.averageWeight || '0';
    const history = document.getElementById('reportHistory');
    if (history) {
        history.innerHTML = report.history.length ? report.history.map(item => `<p>${item}</p>`).join('') : '<p class="text-gray-500">Nenhum evento registrado neste período.</p>';
    }
}

function downloadPdfReport(report) {
    const doc = new window.jspdf.jsPDF({unit: 'pt', format: 'a4'});
    const margin = 40;
    let y = margin;

    doc.setFontSize(18);
    doc.text('Relatório da Fazenda', margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.text(`Nome da fazenda: ${report.farmName}`, margin, y);
    y += 18;
    doc.text(`Período: ${report.period}`, margin, y);
    y += 18;
    doc.text(`Data de emissão: ${report.generatedAt.toLocaleDateString('pt-BR')} ${report.generatedAt.toLocaleTimeString('pt-BR')}`, margin, y);
    y += 25;

    doc.setFontSize(14);
    doc.text('1. Animais', margin, y);
    y += 18;
    doc.setFontSize(11);
    doc.text(`Total de vacas e bois: ${report.animals.totalVacas}`, margin, y);
    y += 16;
    doc.text(`Total de cavalos: ${report.animals.totalCavalos}`, margin, y);
    y += 16;
    doc.text(`Total de ovelhas: ${report.animals.totalOvelhas}`, margin, y);
    y += 18;

    const raceRows = Object.entries(report.animals.raças).map(([raça, qtd]) => [raça, String(qtd)]);
    if (raceRows.length) {
        doc.autoTable({
            head: [['Raça', 'Quantidade']],
            body: raceRows,
            startY: y,
            margin: { left: margin, right: margin },
            theme: 'grid',
            headStyles: { fillColor: [22, 163, 74] },
            styles: { fontSize: 10 }
        });
        y = doc.lastAutoTable.finalY + 10;
    }

    if (report.animals.entriesInPeriod >= 0) {
        doc.text(`Entradas cadastradas no período: ${report.animals.entriesInPeriod}`, margin, y);
        y += 25;
    }

    doc.setFontSize(14);
    doc.text('2. Produção', margin, y);
    y += 18;
    doc.setFontSize(11);
    doc.text(`Produções registradas: ${report.production.records.length}`, margin, y);
    y += 16;
    doc.text(`Total de leite: ${report.production.totalLeite.toFixed(1)} L`, margin, y);
    y += 16;
    doc.text(`Total de ovos: ${report.production.totalOvos}`, margin, y);
    y += 16;
    doc.text(`Total de lã: ${report.production.totalLa.toFixed(1)} kg`, margin, y);
    y += 25;

    doc.setFontSize(14);
    doc.text('3. Vacinas', margin, y);
    y += 18;
    doc.setFontSize(11);
    if (report.vaccines.records.length) {
        doc.text(`Vacinas registradas: ${report.vaccines.records.length}`, margin, y);
        y += 16;
    } else {
        doc.text('Nenhum registro de vacinas encontrado no sistema.', margin, y);
        y += 16;
    }
    doc.text(`Animais vacinados: ${report.vaccines.distinctAnimals}`, margin, y);
    y += 16;
    doc.text(`Próximas vacinas registradas: ${report.vaccines.upcoming}`, margin, y);
    y += 25;

    doc.setFontSize(14);
    doc.text('4. Pesagens', margin, y);
    y += 18;
    doc.setFontSize(11);
    if (report.weights.records.length) {
        const weightsText = report.weights.records.slice(0, 5).map(item => `${item.name}: ${item.lastWeight}`).join(' | ');
        doc.text(`Último peso registrado: ${weightsText}`, margin, y);
        y += 16;
        doc.text(`Média de peso (vacas): ${report.weights.averageWeight} kg`, margin, y);
        y += 18;
    } else {
        doc.text('Nenhum registro de pesagem disponível no sistema.', margin, y);
        y += 18;
    }

    doc.setFontSize(14);
    doc.text('5. Histórico', margin, y);
    y += 18;
    doc.setFontSize(11);
    if (report.history.length) {
        report.history.slice(0, 20).forEach(line => {
            if (y > 730) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, margin, y);
            y += 14;
        });
    } else {
        doc.text('Nenhum evento registrado no período.', margin, y);
    }

    const fileName = `relatorio-fazenda-${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fileName);
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