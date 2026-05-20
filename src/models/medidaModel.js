var database = require("../database/config");

function buscarUltimasMedidas(limite_linhas) {

    var instrucaoSql = `SELECT 
                        ppm,
                        fkSensor,
                        DATE_FORMAT(dtHrRegistro,'%H:%i:%s') as momento_grafico
                    FROM registro
                    ORDER BY idRegistro DESC LIMIT 7`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal() {

    var instrucaoSql = `SELECT 
                        ppm,
                        DATE_FORMAT(dtHrRegistro,'%H:%i:%s') as momento_grafico, 
                        fkSensor 
                        FROM registro
                        ORDER BY idRegistro DESC LIMIT 1`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
}
