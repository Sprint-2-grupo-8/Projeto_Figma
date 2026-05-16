var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  var cnpj = req.body.cnpj;
  var nome = req.body.nome;
  var telefone = req.body.telefone;
  var email = req.body.email;

  if (cnpj == undefined || cnpj.length !== 14 || isNaN(Number(cnpj))) {
    res.status(400).send("Seu CNPJ está inválido (deve conter 14 dígitos numéricos)!");
  } else if (nome == undefined || nome.length < 3) {
    res.status(400).send("Sua razão social está inválida (mínimo 3 caracteres)!");
  } else if (telefone == undefined || (telefone.length !== 10 && telefone.length !== 11) || isNaN(Number(telefone))) {
    res.status(400).send("Seu telefone está inválido (10 ou 11 dígitos numéricos)!");
  } else if (email == undefined || email.indexOf("@") == -1 || email.indexOf(".") == -1) {
    res.status(400).send("Seu e-mail está inválido (deve conter '@' e '.')!");
  } else {
    empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
      if (resultado.length > 0) {
        res
          .status(401)
          .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
      } else {
        empresaModel.cadastrar(nome, cnpj, telefone, email).then((resultado) => {
          res.status(201).json(resultado);
        });
      }
    });
  }
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
};
