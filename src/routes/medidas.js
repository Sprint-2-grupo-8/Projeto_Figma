var express = require("express");
var router = express.Router();

var medidaController = require("../controllers/medidaController");

router.get("/ultimas/", function (req, res) {
    medidaController.buscarUltimasMedidas(req, res);
});

router.get("/registros/", function (req, res) {
    medidaController.buscarRegistros(req, res);
})

router.get("/distribuicao", function (req,res) {
    medidaController.buscarDistribuicao(req,res);
})

router.get("/tempo-real/distribuicao", function (req,res) {
    medidaController.buscarDistribuicaoTempoReal(req,res);
})

router.get("/concentracao", function (req,res) {
    medidaController.buscarConcentracao(req,res);
})

router.get("/tempo-real/concentracao", function (req,res) {
    medidaController.atualizarConcentracao(req,res);
})
module.exports = router;