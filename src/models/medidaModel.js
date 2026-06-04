var database = require("../database/config");

function buscarUltimasMedidas(idEstufa) {

    var instrucaoSql = `
        SELECT
            ROUND(AVG(ppm), 2) AS media_ppm,
            CASE 
                WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
                THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
                ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
            END AS momento_grafico   
        FROM registro
        JOIN sensor ON fkSensor = idSensor
        WHERE dtHrRegistro >= CURDATE() - INTERVAL 1 DAY
	    AND dtHrRegistro < CURDATE()
        AND fkEstufa = ${idEstufa}
        GROUP BY DATE(dtHrRegistro),
        CASE 
                WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
                THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
                ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
        END
        ORDER BY MIN(dtHrRegistro) ASC;
    `;
    console.log("Executar  SQL:" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarRegistros(idEstufa) {

    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) ppm
    FROM registro
    JOIN sensor ON fkSensor = idSensor
    WHERE dtHrRegistro >= NOW() - INTERVAL 1 DAY
        AND fkEstufa = ${idEstufa}`;

    console.log("Executando a instrução SQL de buscarRegistros:" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDistribuicao(idEstufa) {
    var instrucaoSql = `
    SELECT
	    ROUND(AVG(ppm), 0) AS media_ppm,
	    DATE_FORMAT(MIN(dtHrRegistro), '%H:00') AS momento_grafico
    FROM registro
    JOIN sensor ON fkSensor = idSensor
        WHERE dtHrRegistro >= CURDATE() - INTERVAL 1 DAY
	    AND dtHrRegistro < CURDATE()
        AND fkEstufa = ${idEstufa}
    GROUP BY
	    DATE(dtHrRegistro),
	    HOUR(dtHrRegistro)
    ORDER BY MIN(dtHrRegistro);`

    console.log("Executando o SQL" + instrucaoSql);
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

    console.log("Executando o SQL:" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarConcentracao(idEstufa) {
    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) as ppm
    FROM registro
    JOIN sensor ON fkSensor = idSensor
    WHERE fkEstufa = ${idEstufa}
    ORDER BY dtHrRegistro DESC
    LIMIT 1;`

    console.log("Executando o SQL:" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarConcentracao(idEstufa) {
    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) as ppm
    FROM registro
    JOIN sensor ON fkSensor = idSensor
    WHERE fkEstufa = ${idEstufa}
    ORDER BY dtHrRegistro DESC
    LIMIT 1;`

    console.log("atualizarConcentracao SQL" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMaiorConcentracaoGeral() {

    var instrucaoSql = `
        SELECT
            e.nome,
            ROUND(r.ppm, 0) AS ppm
        FROM registro r
        JOIN sensor s
            ON r.fkSensor = s.idSensor
        JOIN estufa e
            ON s.fkEstufa = e.idestufa
        WHERE r.dtHrRegistro = (
            SELECT MAX(r2.dtHrRegistro)
            FROM registro r2
            WHERE r2.fkSensor = r.fkSensor
        )
        ORDER BY r.ppm DESC
        LIMIT 1;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarRegistros,
    buscarDistribuicao,
    buscarDistribuicaoTempoReal,
    buscarConcentracao,
    atualizarConcentracao,
    buscarMaiorConcentracaoGeral
}
