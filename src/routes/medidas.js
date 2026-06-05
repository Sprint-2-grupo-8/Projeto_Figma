var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/ultimas/:id", function (req, res) {
    medidaController.buscarUltimasMedidas(req, res);
});

router.get("/registros/:id", function (req, res) {
    medidaController.buscarRegistros(req, res);
})

router.get("/distribuicao/:id", function (req,res) {
    medidaController.buscarDistribuicao(req,res);
})

router.get("/tempo-real/distribuicao", function (req,res) {
    medidaController.buscarDistribuicaoTempoReal(req,res);
})

router.get("/concentracao/:id", function (req,res) {
    medidaController.buscarConcentracao(req,res);
})

router.get("/tempo-real/concentracao:id", function (req,res) {
    medidaController.atualizarConcentracao(req,res);
})

router.get("/maior-concentracao-geral", function (req, res) {
    medidaController.buscarMaiorConcentracaoGeral(req, res);
});

router.get("/menor-concentracao-geral", function (req, res) {
    medidaController.buscarMenorConcentracaoGeral(req, res);
});

router.get("/estufas-em-alerta", function (req, res) {
    medidaController.buscarEstufasEmAlerta(req, res);
});

router.get("/ranking-alertas", function (req, res) {
    medidaController.buscarRankingAlertas(req, res);
});

module.exports = router;