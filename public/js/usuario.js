
let email_padrao = "mateus@email.com";
let senha_padrao = "urubu100";
let funcionario_padrao = "Miguel";
let perm_funcionario_padrao = 1;
let nome_estufa_padrao = "moranguinho"
let min_ppm_padrao = 800
let max_ppm_padrao = 1200

let emails = [email_padrao];
let senhas = [senha_padrao];
let funcionarios = [funcionario_padrao];
let perm_funcionarios = [perm_funcionario_padrao];
let nome_estufas = [nome_estufa_padrao];
let min_ppms = [min_ppm_padrao];
let max_ppms = [max_ppm_padrao];


function cadastrarfunc() {
    let nome_funcionario = ipt_funcionario.value;
    let perm_funcionario = tipo_usuario.value;
    funcionarios.push(funcionario_padrao);
    perm_funcionarios.push(perm_funcionario_padrao);
    alert("Funcionário cadadastrado");
    ipt_funcionario.value = "";
}


function cadastrarestufa() {
    let nome_estufa = ipt_estufa.value;
    let min_ppm = ipt_minimo.value;
    let max_ppm = ipt_max.value;
    if (min_ppm < max_ppm) {

        nome_estufas.push(nome_estufa_padrao);
        min_ppms.push(min_ppm_padrao);
        max_ppms.push(max_ppm_padrao);
        alert("Estufa cadadastrada");
    }
    else {
        alert("ppm mínimo maior que máximo");
    }
}


function cadastrar() {
    let nome_usuario = ipt_nome.value;
    let email_cadastro = ipt_email_criado.value;
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

        emails.push(email_padrao);
        senhas.push(senha_padrao);
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