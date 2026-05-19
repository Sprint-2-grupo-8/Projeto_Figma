var database = require("../database/config");

function buscarPorId(id) {
  var instrucaoSql = `SELECT idempresa as id, nome, cnpj, telefone, emailCorporativo FROM empresa WHERE idempresa = '${id}'`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT idempresa as id, nome, cnpj, telefone, emailCorporativo FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
  var instrucaoSql = `SELECT idempresa as id, nome, cnpj, telefone, emailCorporativo FROM empresa WHERE cnpj = '${cnpj}'`;

  return database.executar(instrucaoSql);
}

function cadastrar(nome, cnpj, telefone, email) {
  var instrucaoSql = `INSERT INTO empresa (nome, cnpj, telefone, emailCorporativo) VALUES ('${nome}', '${cnpj}', '${telefone}', '${email}')`;

  return database.executar(instrucaoSql);
}

function buscarPorToken(token) {
  var instrucaoSql = `SELECT idempresa as id, nome FROM empresa WHERE codigo_acesso = '${token}'`;
  return database.executar(instrucaoSql);
}

module.exports = { buscarPorCnpj, buscarPorId, cadastrar, listar, buscarPorToken };
