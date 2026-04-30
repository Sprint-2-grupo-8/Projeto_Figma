
let nome_padrao = 'Fernando';
let email_padrao = "brandao@email.com";
let senha_padrao = "urubu100";
let cpf_padrao = '12345678910'

let nomes = [nome_padrao];
let emails = [email_padrao];
let senhas = [senha_padrao];
let cpfs = [cpf_padrao];

function cadastrar() {
    let nome_usuario = ipt_nome.value;
    let email_cadastro = ipt_email_criado.value;
    let cpf = ipt_cpf.value;
    let senha_cadastro = ipt_senha_criada.value;
    let senha_confirmacao = ipt_c_senha.value;

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

        nome_usuario.push(nomes)
        emails.push(emails);
        senhas.push(senhas);
        cpfs.push(cpf);
    }

    ipt_nome.value = "";
    ipt_email_criado.value = "";
    ipt_senha_criada.value = "";
    ipt_c_senha.value = "";
}


function logar() {
    let email_login = ipt_email.value
    let senha_login = ipt_senha.value
    let logou = false

    for (let i = 0; i < emails.length; i++) {
        if (email_login === emails[i] && senha_login === senhas[i]) {
            window.location = "./dashboard.html" // simula oq acontecerá se logar
            logou = true

        }
    }

    if (!logou) {
        confirmacao_login.innerHTML = `Usuário ou senha incorretos`
    }
}

function ir_login() {
    window.location.href = "./login.html"
}
function ir_cadastro() {
    window.location.href = "./cadastro.html"
}