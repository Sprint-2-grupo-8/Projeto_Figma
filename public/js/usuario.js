// Variable to store the recently created empresa ID
let idEmpresaVincular = null;

function cadastrar_empresa() {
    let nome_empresa = ipt_nome.value;
    let email_empresa = ipt_email_criado.value;
    let cnpj = ipt_cnpj.value;
    let telefone = ipt_telefone.value;

    if (nome_empresa == "" || email_empresa == "" || cnpj == "" || telefone == "") {
        erro_cadastro.innerHTML = "Todos os campos devem estar preenchidos";
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
                idEmpresaVincular = json.insertId; // Capture the new ID
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

    if (nome_func == "" || email_func == "" || senha_cadastro == "" || senha_confirmacao == "") {
        erro_senha.innerHTML = "Preencha todos os campos";
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