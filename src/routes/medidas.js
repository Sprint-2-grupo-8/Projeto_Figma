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







module.exports = router;