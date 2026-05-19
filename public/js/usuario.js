
function obterEmpresas() {
    fetch("/empresas/listar")
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (empresas) {
                    let select = document.getElementById("slc_empresa");
                    if (select) {
                        select.innerHTML = '<option value="" disabled selected>Selecione sua empresa</option>';
                        empresas.forEach(function (empresa) {
                            let option = document.createElement("option");
                            option.value = empresa.id;
                            option.textContent = empresa.nome;
                            select.appendChild(option);
                        });
                    }
                });
            } else {
                console.error("Nenhuma empresa encontrada ou erro na requisição.");
            }
        })
        .catch(function (erro) {
            console.error("Erro ao obter empresas:", erro);
        });
}

// Executa obterEmpresas quando a página carrega, se o dropdown estiver presente
window.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("slc_empresa")) {
        obterEmpresas();
    }
});

function cadastrar_func() {
    let nome_func = ipt_nome_func.value;
    let email_func = ipt_email_func.value;
    let senha_cadastro = ipt_senha.value;
    let senha_confirmacao = ipt_c_senha.value;
    let cpf_func = ipt_cpf_func.value;
    let idEmpresaVincular = document.getElementById("slc_empresa") ? document.getElementById("slc_empresa").value : "";


    if (nome_func == "" || email_func == "" || senha_cadastro == "" || senha_confirmacao == "" || cpf_func == "") {
        erro_senha.innerHTML = "Preencha todos os campos";
        return;
    }

    if (idEmpresaVincular == "") {
        erro_senha.innerHTML = "Selecione uma empresa";
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
            alert("Usuário cadastrado com sucesso!");
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