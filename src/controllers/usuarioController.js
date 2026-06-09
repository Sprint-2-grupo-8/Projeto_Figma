var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");
var empresaModel = require("../models/empresaModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        cpf: resultadoAutenticar[0].cpf,
                                        senha: resultadoAutenticar[0].senha,
                                        empresa: resultadoAutenticar[0].empresaId,
                                        aquarios: resultadoAquarios
                                    });
                                } else {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        cpf: resultadoAutenticar[0].cpf,
                                        senha: resultadoAutenticar[0].senha,
                                        empresa: resultadoAutenticar[0].empresaId,
                                        aquarios: []
                                    });
                                }
                            }).catch(function (erro) {
                                console.log(erro);
                                res.status(500).json(erro.sqlMessage);
                            });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\Houve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cpf = req.body.cpfServer;
    var tokenEmpresa = req.body.tokenEmpresaServer;

    // Valida os campos obrigatórios do usuário
    if (nome == undefined || nome.length < 3) {
        res.status(400).send("Seu nome está inválido (mínimo 3 caracteres)!");
    } else if (email == undefined || email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        res.status(400).send("Seu email está inválido (deve conter '@' e '.')!");
    } else if (senha == undefined || senha.length < 6) {
        res.status(400).send("Sua senha está inválida (mínimo 6 caracteres)!");
    } else if (cpf == undefined || cpf.length !== 11 || isNaN(Number(cpf))) {
        res.status(400).send("Seu CPF está inválido (deve conter 11 dígitos numéricos)!");
    } else if (tokenEmpresa == undefined || tokenEmpresa === "") {
        res.status(400).send("O token da empresa está inválido ou vazio!");
    } else {
        // Valida se o token de acesso pertence a alguma empresa cadastrada
        empresaModel.buscarPorToken(tokenEmpresa)
            .then(function (resultadoEmpresa) {
                if (resultadoEmpresa.length === 0) {
                    res.status(400).send("Token de empresa inválido!");
                } else {
                    var fkEmpresa = resultadoEmpresa[0].id;

                    // Verifica se o email de usuário já está em uso
                    usuarioModel.buscarPorEmail(email)
                        .then(function (resultadoBusca) {
                            if (resultadoBusca.length > 0) {
                                res.status(409).send("Email já cadastrado.");
                            } else {
                                // Cria o novo usuário vinculando-o à empresa encontrada
                                usuarioModel.cadastrar(nome, email, senha, cpf, fkEmpresa)
                                    .then(function (resultado) {
                                        res.json(resultado);
                                    })
                                    .catch(function (erro) {
                                        console.log(erro);
                                        console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                                        res.status(500).json(erro.sqlMessage);
                                    });
                            }
                        })
                        .catch(function (erro) {
                            console.log(erro);
                            res.status(500).json(erro.sqlMessage);
                        });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json("Erro ao validar token da empresa.");
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
};