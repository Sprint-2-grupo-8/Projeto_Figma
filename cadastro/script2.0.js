let dados = localStorage.getItem("cadastro_json"); 

let usuarios = [];
let empresa = {};
let funcionarios = [];
let estufas = [];

if (dados != null) {
    usuarios = JSON.parse(dados); // Tirar o json de string
}

function cadastrarfunc() {
    let nome_funcionario = ipt_funcionario.value;
    let perm_funcionario = tipo_usuario.value;

    funcionarios.push(
        {
            nome: nome_funcionario,
            permissao: perm_funcionario
        }
    );
    alert("Funcionário cadadastrado");
    ipt_funcionario.value = "";
}

function cadastrarestufa() {
    let nome_estufa = ipt_estufa.value;
    let min_ppm = Number(ipt_minimo.value);
    let max_ppm = Number(ipt_max.value);
    if (min_ppm = max_ppm) {
        estufas.push(
            {
                id_estufa: nome_estufa,
                ppm_min: min_ppm,
                ppm_max: max_ppm
            }
        );
        alert("Estufa cadadastrada");
    }
    else {
        alert("ppm mínimo deve ser menor que máximo");
    }
}


function cadastrar() {
    ipt_nome.value = "";
    ipt_email_criado.value = "";
    ipt_senha_criada.value = "";
    ipt_c_senha.value = "";

    if (
        senha_cadastro == ""
        || senha_confirmacao == ""
        || senha_cadastro != senha_confirmacao
    ) {
        confirmacao_senha.innerHTML = `Campo senha não coincide com a confirmação ou campo em branco<br>`
        senha_cadastro = ""
        senha_confirmacao = ""
    }
    else {
        alert("Usuário cadastrado");

        empresa = {
            nome: nome_usuario,
            email: email_cadastro,
            senha: senha_cadastro
        }
        usuarios.push(
            {
                empresa: {
                    nome: empresa.nome,
                    email: empresa.email,
                    senha: empresa.senha
                },
                funcionarios: funcionarios.slice(),
                estufas: estufas.slice()
            }
        );
    }
    funcionarios = []
    estufas = []
    nome_usuario = "";
    email_cadastro = "";
    senha_cadastro = "";
    senha_confirmacao = "";

    let cadastro_json = JSON.stringify(usuarios); //criar json
    localStorage.setItem("cadastro_json", cadastro_json) // para salvar em local
}


function logar() {
    let email_login = ipt_email.value
    let senha_login = ipt_senha.value
    let logou = false

    for (let i = 0; i < usuarios.length && !logou; i++) {

        if (email_login == usuarios[i].empresa.email && senha_login == usuarios[i].empresa.senha) {
            window.location.href = "Dashes.html" // simula oq acontecerá se logar
            logou = true
        }
    }

    if (!logou) {
        confirmacao_login.innerHTML = `Usuário ou senha incorretos`
    }
}

function ir_login() {
    window.location.href = "login.html"
}
function ir_cadastro() {
    window.location.href = "cadastro.html"
}