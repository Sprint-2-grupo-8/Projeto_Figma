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

function buscarMedidasEmTempoReal() {

    var instrucaoSql = `
    SELECT
        	ROUND(AVG(ppm), 2) AS media_ppm,
	CASE 
		WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
		THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
		ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
	END AS momento_grafico   
    FROM registro
    WHERE fkSensor = 1
    GROUP BY DATE(dtHrRegistro), 
	CASE 
		WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
		THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
		ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
	END
    ORDER BY MIN(dtHrRegistro) DESC
    LIMIT 1;`;

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
}
module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    buscarDistribuicao,
    buscarDistribuicaoTempoReal
}
