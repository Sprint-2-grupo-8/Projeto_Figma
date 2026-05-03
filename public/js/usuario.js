// Empresa_mockada
let nome_empresa_padrao = 'Morango_consulting'
let email_empresa_padrao = 'morango@gmail.com'
let cnpj_padrao = '12345678/0001-91'
let telefone_padrao = '11996105127'

// Funcionario_mockado
let nome_padrao = 'Fernando';
let cpf_padrao = '12345678910'
let email_padrao = "brandao@email.com";
let cargo_padrao = "ADM"
let senha_padrao = "urubu100";

// Arryas de empresas
let raz_social = [nome_empresa_padrao];
let email_empresas = [email_empresa_padrao];
let cnpjs = [cnpj_padrao];
let telefones = [telefone_padrao];

//arrays de funcionarios
let nomes = [nome_padrao];
let cpfs = [cpf_padrao];
let cargos = [cargo_padrao];
let emails = [email_padrao];
let senhas = [senha_padrao];

function cadastrar_empresa() {

    let nome_empresa = ipt_nome.value;
    let email_empresa = ipt_email_criado.value;
    let cnpj = ipt_cnpj.value;
    let telefone = ipt_telefone.value;
    if (nome_empresa != "" &&
        email_empresa != "" &&
        cnpj != "" &&
        telefone != "") {

        alert("Empresa cadastrada");

        raz_social.push(nome_empresa);
        email_empresas.push(email_empresa);
        telefones.push(telefone);
        cnpjs.push(cnpj);

        document.getElementById("empresa").style.display = "none";
        document.getElementById("funcionario").style.display = "flex";
    }
    else {
        erro_cadastro.innerHTML = "Todos os campos devem estar devidamente cadastrados"
    }
}

function cadastrar_func() {

    let nome_func = ipt_nome_func.value;
    let cpf = ipt_cpf_func.value;
    let email_func = ipt_email_func.value;
    let cargo = slc_cargo.value;
    let senha_cadastro = ipt_senha.value;
    let senha_confirmacao = ipt_c_senha.value;

    if (senha_cadastro === senha_confirmacao && senha_cadastro != "" && senha_confirmacao != "") {

        nomes.push(nome_func);
        cpfs.push(cpf);
        cargos.push(cargo);
        emails.push(email_func);
        senhas.push(senha_cadastro);

        alert("Funcionario cadastrado");
        window.location = './login.html'

    }
    else {
        erro_senha.innerHTML = "Campos senha e confirmação de senha não coincidem ou estão vazios"
    }


    document.getElementById("empresa").style.display = "none";
    document.getElementById("funcionario").style.display = "flex";
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