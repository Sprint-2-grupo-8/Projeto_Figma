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
        WHERE dtHrRegistro >= NOW() - INTERVAL 24 HOUR
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
        WHERE dtHrRegistro >= NOW() - INTERVAL 24 HOUR
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

function buscarMenorConcentracaoGeral() {

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
        ORDER BY r.ppm ASC
        LIMIT 1;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarEstufasEmAlerta() {

    var instrucaoSql = `
        SELECT
            COUNT(DISTINCT e.idestufa) AS qtd_estufas_alerta
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
        AND (r.ppm < e.gasMinimo OR r.ppm > e.gasMaximo);
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarRankingAlertas() {

    var instrucaoSql = `
        SELECT
            e.nome,
            COUNT(r.idRegistro) AS qtd_alertas
        FROM registro r
        JOIN sensor s
            ON r.fkSensor = s.idSensor
        JOIN estufa e
            ON s.fkEstufa = e.idestufa
        WHERE r.dtHrRegistro >= NOW() - INTERVAL 7 DAY
        AND (r.ppm < e.gasMinimo OR r.ppm > e.gasMaximo)
        GROUP BY e.idestufa, e.nome
        ORDER BY qtd_alertas DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPercentualRegistrosPorFaixa() {

    var instrucaoSql = `
        SELECT
            SUM(CASE WHEN r.ppm BETWEEN e.gasMinimo AND e.gasMaximo THEN 1 ELSE 0 END) AS ideal,
            SUM(CASE WHEN 
                (r.ppm >= e.gasMinimo - 100 AND r.ppm < e.gasMinimo)
                OR
                (r.ppm > e.gasMaximo AND r.ppm <= e.gasMaximo + 100)
            THEN 1 ELSE 0 END) AS intermediaria,
            SUM(CASE WHEN 
                r.ppm < e.gasMinimo - 100
                OR
                r.ppm > e.gasMaximo + 100
            THEN 1 ELSE 0 END) AS critica
        FROM registro r
        JOIN sensor s
            ON r.fkSensor = s.idSensor
        JOIN estufa e
            ON s.fkEstufa = e.idestufa
        WHERE r.dtHrRegistro >= NOW() - INTERVAL 7 DAY;
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
    buscarMaiorConcentracaoGeral,
    buscarMenorConcentracaoGeral,
    buscarEstufasEmAlerta,
    buscarRankingAlertas,
    buscarPercentualRegistrosPorFaixa
}
