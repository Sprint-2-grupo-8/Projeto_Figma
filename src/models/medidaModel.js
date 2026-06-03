var database = require("../database/config");

function buscarUltimasMedidas() {

    var instrucaoSql = `
        SELECT
            ROUND(AVG(ppm), 2) AS media_ppm,
            CASE 
                WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
                THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
                ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
            END AS momento_grafico   
        FROM registro
        WHERE dtHrRegistro >= CURDATE() - INTERVAL 1 DAY
	    AND dtHrRegistro < CURDATE()
            AND fkSensor = 1
        GROUP BY DATE(dtHrRegistro),
        CASE 
                WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
                THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
                ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
        END
        ORDER BY MIN(dtHrRegistro) ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarRegistros() {

    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) ppm
    FROM registro
    WHERE dtHrRegistro >= CURDATE() - INTERVAL 1 DAY
	    AND dtHrRegistro < CURDATE()`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDistribuicao() {
    var instrucaoSql = `
    SELECT
	    ROUND(AVG(ppm), 0) AS media_ppm,
	    DATE_FORMAT(MIN(dtHrRegistro), '%H:00') AS momento_grafico
    FROM registro
    WHERE dtHrRegistro >= CURDATE() - INTERVAL 1 DAY
	    AND dtHrRegistro < CURDATE()
    GROUP BY
	    DATE(dtHrRegistro),
	    HOUR(dtHrRegistro)
    ORDER BY MIN(dtHrRegistro);`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDistribuicaoTempoReal() {
    var instrucaoSql = `
    SELECT
        ROUND(AVG(ppm), 0) AS media_ppm,
        DATE_FORMAT(NOW(), '%H:00') AS momento_grafico
    FROM registro
    WHERE DATE(dtHrRegistro) = CURDATE()
        AND HOUR(dtHrRegistro) = HOUR(NOW());`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarConcentracao() {
    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) as ppm
    FROM registro
    ORDER BY dtHrRegistro DESC
    LIMIT 1;`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarConcentracao() {
    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) as ppm
    FROM registro
    ORDER BY dtHrRegistro DESC
    LIMIT 1;`

    console.log("Executando a instrução de atualizarConcentracao SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
module.exports = {
    buscarUltimasMedidas,
    buscarRegistros,
    buscarDistribuicao,
    buscarDistribuicaoTempoReal,
    buscarConcentracao,
    atualizarConcentracao
}
