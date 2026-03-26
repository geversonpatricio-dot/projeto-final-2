/* 
   
    Eu uso variáveis (const e let) pra guardar informações e funções pra fazer as coisas.
*/

// 
// Aqui eu guardo as fotos que eu quero que apareçam quando eu clicar no botão.
const fotosAlternativas = [
    'images/escritorio1.jpg',
    'images/escritorio2.jpg',
    'images/computador1.jpg',
    'images/computador2.jpg'
];

//  Hobbies iniciais que o professor pediu.
const hobbiesIniciais = ['Sql', 'Web', 'Gestão de Projecto'];

// Aqui eu guardo o estado atual do site (se tá claro ou escuro, o nome, etc).
let estadoSite = {
    tema: 'claro',
    nome: 'Meu Portfólio',
    frase: 'Sou estudante de Programação Low Code...',
    cor: '#000000',
    foto: 'images/escritorio1.jpg',
    hobbies: hobbiesIniciais.slice(),
    contador: 0
};

// --- AGARRAR ELEMENTOS DO HTML (DOM) ---
// O document.getElementById serve pra o JavaScript achar as coisas no HTML pelo ID que eu dei.
const btnTema = document.getElementById('btnTema');
const btnTrocarFoto = document.getElementById('btnTrocarImagem');
const btnNovoHobby = document.getElementById('btnAdicionarHobby');
const btnCorAleatoria = document.getElementById('btnCorAleatoria');
const btnAPI = document.getElementById('btnCarregarAPI');
const btnReset = document.getElementById('btnReset');

const imgPerfil = document.getElementById('fotoPerfil');
const txtNome = document.getElementById('nomePerfil');
const txtFrase = document.getElementById('frasePerfil');
const cardPerfil = document.getElementById('cardPerfil');

const formPerfil = document.getElementById('formPerfil');
const inNome = document.getElementById('inputNome');
const inFrase = document.getElementById('inputFrase');
const inCor = document.getElementById('inputCor');
const inFoto = document.getElementById('inputFoto');

const listaHobbies = document.getElementById('listaHobbies');
const areaHobbies = document.getElementById('areaHobbies');
const areaAPI = document.getElementById('textoAPI');
const txtContador = document.getElementById('contadorAtualizacoes');

// --- 1. MUDAR O TEMA (CLARO/ESCURO) ---
// Função coloca ou tira a classe 'dark-mode' do body do HTML.
function aplicarTema(tema) {
    if (tema === 'escuro') {
        document.body.classList.add('dark-mode');
        btnTema.textContent = 'Mudar para Modo Claro';
        estadoSite.tema = 'escuro';
    } else {
        document.body.classList.remove('dark-mode');
        btnTema.textContent = 'Mudar para Modo Escuro';
        estadoSite.tema = 'claro';
    }
    // O localStorage serve pra o navegador lembrar do tema mesmo se eu fechar o site.
    localStorage.setItem('tema_salvo', tema);
}

// Quando eu clico no botão de tema, ele vê qual é o tema atual e muda pro outro.
btnTema.addEventListener('click', function() {
    const novoTema = estadoSite.tema === 'claro' ? 'escuro' : 'claro';
    aplicarTema(novoTema);
});

// --- 2. TROCAR A IMAGEM ---
// Eu uso um número (índice) pra saber qual foto da lista eu vou mostrar agora.
let indiceFoto = 0;

btnTrocarFoto.addEventListener('click', function() {
    indiceFoto = (indiceFoto + 1) % fotosAlternativas.length;
    const novaFoto = fotosAlternativas[indiceFoto];
    imgPerfil.src = novaFoto;
    estadoSite.foto = novaFoto;
});

// --- 3. ADICIONAR UM HOBBY ---
// O prompt abre uma janelinha pro usuário escrever o que ele gosta.

btnNovoHobby.addEventListener('click', function() {
    const hobby = prompt('O que você gosta de fazer?');
    
    if (hobby && hobby.trim() !== '') {
        const hobbyLimpo = hobby.trim();
        estadoSite.hobbies.push(hobbyLimpo);
        
        // O document.createElement cria um item novo na lista (li) dinamicamente.
        const novoItem = document.createElement('li');
        novoItem.className = 'list-group-item';
        novoItem.textContent = hobbyLimpo;
        
        listaHobbies.appendChild(novoItem);
        
        // Salva na memória do navegador.
        localStorage.setItem('hobbies_salvos', JSON.stringify(estadoSite.hobbies));
    }
});

// --- 4. FORMULÁRIO DE PERFIL ---
// Quando eu clico no botão de atualizar, o JavaScript pega o que eu escrevi nos campos.
formPerfil.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Isso aqui impede que a página recarregue sozinha.
    
    const nome = inNome.value.trim();
    const frase = inFrase.value.trim();
    const cor = inCor.value;
    const foto = inFoto.value.trim();
    
    if (!nome || !frase) {
        alert('Por favor, preencha o nome e a frase!');
        return;
    }
    
    // Atualiza o que tá aparecendo na tela.
    txtNome.textContent = nome;
    txtFrase.textContent = frase;
    if (foto) imgPerfil.src = foto;
    cardPerfil.style.borderColor = cor;
    
    // Aumenta o contador de atualizações.
    estadoSite.contador++;
    txtContador.textContent = estadoSite.contador;
    
    // Salva tudo no localStorage.
    localStorage.setItem('perfil_salvo', JSON.stringify({
        nome: nome,
        frase: frase,
        cor: cor,
        foto: foto || estadoSite.foto,
        contador: estadoSite.contador
    }));
    
    alert('Perfil atualizado com sucesso!');
    formPerfil.reset(); // Limpa os campos do formulário.
});

// --- 5. BUSCAR INSPIRAÇÃO (API) ---
// O fetch serve pra o JavaScript ir buscar informações em outro site (API).
async function buscarDadosAPI() {
    try {
        btnAPI.disabled = true;
        btnAPI.textContent = 'Carregando...';
        
        // Eu vou buscar uma piada aleatória nesse site aqui.
        const resposta = await fetch('https://v2.jokeapi.dev/joke/Any?format=json');
        const dados = await resposta.json();
        
        let texto = '';
        if (dados.type === 'single') {
            texto = `<p>"${dados.joke}"</p>`;
        } else {
            texto = `<p>"${dados.setup}"<br><em>${dados.delivery}</em></p>`;
        }
        
        // Coloca o texto da piada dentro da div no HTML.
        areaAPI.innerHTML = texto;
        
        btnAPI.disabled = false;
        btnAPI.textContent = 'BUSCAR INSPIRAÇÃO';
        
    } catch (erro) {
        areaAPI.innerHTML = `<p style="color: red;">Erro ao carregar dados da API.</p>`;
        btnAPI.disabled = false;
        btnAPI.textContent = 'BUSCAR INSPIRAÇÃO';
    }
}

btnAPI.addEventListener('click', buscarDadosAPI);

// --- 6. RESETAR TUDO ---
// Limpa o localStorage e recarrega a página pra ela voltar ao normal.
btnReset.addEventListener('click', function() {
    if (confirm('Deseja apagar todas as alterações e voltar ao início?')) {
        localStorage.clear();
        location.reload();
    }
});

// --- 7. COR ALEATÓRIA ---
// Gera uma cor aleatória de uma lista e coloca no fundo da área de hobbies.
btnCorAleatoria.addEventListener('click', function() {
    const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const corSorteada = cores[Math.floor(Math.random() * cores.length)];
    areaHobbies.style.backgroundColor = corSorteada;
});

// --- 8. TECLA ENTER ---
// Onde mostra um alerta quando apertar a tecla Enter.
document.addEventListener('keydown', function(evento) {
    if (evento.key === 'Enter') {
        alert('Tem a certeza que acabou o exercício?');
    }
});

// --- 9. INICIALIZAÇÃO ---
// Quando o site acaba de carregar, o JavaScript vê se tem algo salvo na memória.
document.addEventListener('DOMContentLoaded', function() {
    // Carrega o tema salvo.
    const temaSalvo = localStorage.getItem('tema_salvo');
    if (temaSalvo) aplicarTema(temaSalvo);
    
    // Carrega o perfil salvo.
    const perfilSalvo = localStorage.getItem('perfil_salvo');
    if (perfilSalvo) {
        const p = JSON.parse(perfilSalvo);
        txtNome.textContent = p.nome;
        txtFrase.textContent = p.frase;
        imgPerfil.src = p.foto;
        cardPerfil.style.borderColor = p.cor;
        txtContador.textContent = p.contador;
        estadoSite.contador = p.contador;
    }
    
    // Carrega os hobbies salvos.
    const hobbiesSalvos = localStorage.getItem('hobbies_salvos');
    if (hobbiesSalvos) {
        const h = JSON.parse(hobbiesSalvos);
        listaHobbies.innerHTML = ''; // Limpa a lista inicial.
        h.forEach(hobby => {
            const item = document.createElement('li');
            item.className = 'list-group-item';
            item.textContent = hobby;
            listaHobbies.appendChild(item);
        });
        estadoSite.hobbies = h;
    }
});
