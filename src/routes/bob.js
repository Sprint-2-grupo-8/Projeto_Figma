var express = require("express");
var router = express.Router();
var bobController = require("../controllers/bobController");

router.post("/perguntar", function (req, res) {
    bobController.perguntar(req, res);
});

module.exports = router;