var database = require("../database/config");

function buscarUltimasMedidas(limite_linhas) {

    var instrucaoSql = `
        SELECT 
            ROUND(AVG(ppm), 2) AS media_ppm,
            CASE 
                WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
                THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
                ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
            END AS momento_grafico   
        FROM registro
        WHERE TIMESTAMPDIFF(HOUR, dtHrRegistro, NOW()) <= 24 
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

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
}
