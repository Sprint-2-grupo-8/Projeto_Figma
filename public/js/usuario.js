
let idEmpresaVincular = null;

function cadastrar_empresa() {
    let nome_empresa = ipt_nome.value;
    let email_empresa = ipt_email_criado.value;
    let cnpj = ipt_cnpj.value;
    let telefone = ipt_telefone.value;


    // Validação - Todos os campos devem ser preenchidos
    if (nome_empresa == "" || email_empresa == "" || cnpj == "" || telefone == "") {
        erro_cadastro.innerHTML = "Todos os campos devem estar preenchidos";
        return;
    }

    if (email_empresa.indexOf("@") == -1 || email_empresa.indexOf(".") == -1) {
        erro_cadastro.innerHTML = "O e-mail deve conter '@' e '.'";
        return;
    }

    // Validação do CNPJ: deve ter 14 dígitos e só números
    if (cnpj.length !== 14 || isNaN(Number(cnpj))) {
        erro_cadastro.innerHTML = "O CNPJ deve conter exatamente 14 números (apenas dígitos, sem pontos ou traços)";
        return;
    }

    // Validação do Telefone: deve ter 10 (fixo) ou 11 (celular) - apenas números
    if ((telefone.length !== 10 && telefone.length !== 11) || isNaN(Number(telefone))) {
        erro_cadastro.innerHTML = "O telefone deve conter 10 ou 11 números (com DDD, apenas dígitos)";
        return;
    }

    fetch("/empresas/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: nome_empresa,
            email: email_empresa,
            cnpj: cnpj,
            telefone: telefone
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            alert("Empresa cadastrada com sucesso!");
            resposta.json().then(json => {
                console.log(json);
                idEmpresaVincular = json.insertId; // Captura o ID gerado
                document.getElementById("empresa").style.display = "none";
                document.getElementById("funcionario").style.display = "flex";
            });
        } else {
            resposta.text().then(texto => {
                console.error(texto);
                erro_cadastro.innerHTML = texto;
            });
        }
    })
    .catch(function (erro) {
        console.log(erro);
    });
}

function cadastrar_func() {
    let nome_func = ipt_nome_func.value;
    let email_func = ipt_email_func.value;
    let senha_cadastro = ipt_senha.value;
    let senha_confirmacao = ipt_c_senha.value;
    let cpf_func = ipt_cpf_func.value;


    if (nome_func == "" || email_func == "" || senha_cadastro == "" || senha_confirmacao == "" || cpf_func == "") {
        erro_senha.innerHTML = "Preencha todos os campos";
        return;
    }

    if (nome_func.length < 3) {
        erro_senha.innerHTML = "O nome deve ter pelo menos 3 caracteres";
        return;
    }

    if (email_func.indexOf("@") == -1 || email_func.indexOf(".") == -1) {
        erro_senha.innerHTML = "O e-mail deve conter '@' e '.'";
        return;
    }

    if (cpf_func.length !== 11 || isNaN(Number(cpf_func))) {
        erro_senha.innerHTML = "O CPF deve conter exatamente 11 números";
        return;
    }

    if (senha_cadastro.length < 6) {
        erro_senha.innerHTML = "A senha deve ter pelo menos 6 caracteres";
        return;
    }

    if (senha_cadastro !== senha_confirmacao) {
        erro_senha.innerHTML = "As senhas não coincidem";
        return;
    }

    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nomeServer: nome_func,
            emailServer: email_func,
            senhaServer: senha_cadastro,
            cpfServer : cpf_func,


            idEmpresaVincularServer: idEmpresaVincular
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            alert("Funcionário cadastrado com sucesso!");
            window.location = "login.html";
        } else {
            resposta.text().then(texto => {
                console.error(texto);
                erro_senha.innerHTML = texto;
            });
        }
    })
    .catch(function (erro) {
        console.log(erro);
    });
}

function logar() {
    let email_login = ipt_email.value;
    let senha_login = ipt_senha.value;

    if (email_login == "" || senha_login == "") {
        confirmacao_login.innerHTML = "Preencha todos os campos";
        return;
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            emailServer: email_login,
            senhaServer: senha_login
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(json => {
                console.log(json);
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.ID_USUARIO = json.id;
                sessionStorage.CPF_USUARIO = json.cpf;
                
                setTimeout(function () {
                    window.location = "dashboard.html";
                }, 1000);
            });
        } else {
            resposta.text().then(texto => {
                console.error(texto);
                confirmacao_login.innerHTML = texto;
            });
        }
    })
    .catch(function (erro) {
        console.log(erro);
    });
}

function ir_login() {
    window.location.href = "./login.html"
}
function ir_cadastro() {
    window.location.href = "./cadastro.html"
}