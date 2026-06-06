function cadastrar_func() {
    let nome_func = ipt_nome_func.value;
    let email_func = ipt_email_func.value;
    let senha_cadastro = ipt_senha.value;
    let senha_confirmacao = ipt_c_senha.value;
    let cpf_func = ipt_cpf_func.value;
    let token_empresa = document.getElementById("ipt_token") ? ipt_token.value.trim() : "";

    // Valida se todos os campos do formulário estão preenchidos
    if (nome_func == "" || email_func == "" || senha_cadastro == "" || senha_confirmacao == "" || cpf_func == "") {
        erro_senha.innerHTML = "Preencha todos os campos";
        return;
    }

    // Valida preenchimento do token da empresa
    if (token_empresa == "") {
        erro_senha.innerHTML = "Digite o token da sua empresa";
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

    // Envia requisição de cadastro passando o token para vínculo com a empresa
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
            tokenEmpresaServer: token_empresa
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location = "login.html";
        } 
        else {
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
                
                if (email_login == "gascontrol.suporte@gmail.com" && senha_login == "G45.Control") {
                     setTimeout(function () {
                    window.location = "bob.html";
                }, 1000);
                }
                else {
                    setTimeout(function () {
                        window.location = "painel.html";
                    }, 1000);
                }

            });

        }         

        
        else {
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