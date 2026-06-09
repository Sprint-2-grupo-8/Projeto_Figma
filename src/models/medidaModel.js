var database = require("../database/config");

function buscarUltimasMedidas(idEstufa, idEmpresa) {

    var instrucaoSql = `
        SELECT
            ROUND(AVG(ppm), 2) AS media_ppm,
            CASE 
                WHEN FLOOR(HOUR(dtHrRegistro) / 4) * 4 < 10
                THEN CONCAT('0', FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
                ELSE CONCAT(FLOOR(HOUR(dtHrRegistro) / 4) * 4, ':00')
            END AS momento_grafico   
        FROM registro
<<<<<<< Updated upstream
        JOIN sensor ON fkSensor = idSensor
        WHERE dtHrRegistro >= NOW() - INTERVAL 24 HOUR  
        AND fkEstufa = ${idEstufa}
=======
        JOIN (
            SELECT
                idSensor,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
        WHERE dtHrRegistro >= NOW() - INTERVAL 24 HOUR
        AND sq_estufas.fkEstufa = ${idEstufa}
>>>>>>> Stashed changes
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

function buscarRegistros(idEstufa, idEmpresa) {

    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) AS ppm,
        dtHrRegistro
    FROM registro
    JOIN (
            SELECT
                idSensor,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
    WHERE dtHrRegistro >= NOW() - INTERVAL 1 DAY
        AND sq_estufas.fkEstufa = ${idEstufa}
    ORDER BY dtHrRegistro DESC`;

    console.log("Executando a instrução SQL de buscarRegistros:" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDistribuicao(idEstufa, idEmpresa) {
    var instrucaoSql = `
    SELECT
	    ROUND(AVG(ppm), 0) AS media_ppm,
	    DATE_FORMAT(MIN(dtHrRegistro), '%H:00') AS momento_grafico
    FROM registro
    JOIN (
            SELECT
                idSensor,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
        WHERE dtHrRegistro >= NOW() - INTERVAL 24 HOUR
        AND sq_estufas.fkEstufa = ${idEstufa}
    GROUP BY
	    DATE(dtHrRegistro),
	    HOUR(dtHrRegistro)
    ORDER BY MIN(dtHrRegistro);`

    console.log("Executando o SQL" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDistribuicaoTempoReal(idEstufa, idEmpresa) {
    var instrucaoSql = `
    SELECT
        ROUND(AVG(ppm), 0) AS media_ppm,
        DATE_FORMAT(NOW(), '%H:00') AS momento_grafico
    FROM registro
    JOIN (
            SELECT
                idSensor,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
    WHERE DATE(dtHrRegistro) = CURDATE()
        AND HOUR(dtHrRegistro) = HOUR(NOW())
        AND sq_estufas.fkEstufa = ${idEstufa};`

    console.log("Executando o SQL:" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarConcentracao(idEstufa, idEmpresa) {
    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) as ppm
    FROM registro
    JOIN (
            SELECT
                idSensor,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
    WHERE sq_estufas.fkEstufa = ${idEstufa}
    ORDER BY dtHrRegistro DESC
    LIMIT 1;`

    console.log("Executando o SQL:" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarConcentracao(idEstufa, idEmpresa) {
    var instrucaoSql = `
    SELECT
        ROUND(ppm, 0) as ppm
    FROM registro
    JOIN (
            SELECT
                idSensor,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
    WHERE sq_estufas.fkEstufa = ${idEstufa}
    ORDER BY dtHrRegistro DESC
    LIMIT 1;`

    console.log("atualizarConcentracao SQL" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMaiorConcentracaoGeral(idEmpresa) {

    var instrucaoSql = `
        SELECT
            sq_estufas.nome,
            ROUND(r.ppm, 0) AS ppm
        FROM registro r
        JOIN (
            SELECT
                idSensor,
                nome,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
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

function buscarMenorConcentracaoGeral(idEmpresa) {

    var instrucaoSql = `
        SELECT
            sq_estufas.nome,
            ROUND(r.ppm, 0) AS ppm
        FROM registro r
        JOIN (
            SELECT
                idSensor,
                nome,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) fkEstufa
            FROM sensor
            JOIN estufa ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
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

function buscarEstufasEmAlerta(idEmpresa) {

    var instrucaoSql = `
        SELECT
            COUNT(DISTINCT sq_estufas.fkEstufa) AS qtd_estufas_alerta
        FROM registro r
        JOIN (
            SELECT
                idSensor,
                e.gasMinimo,
                e.gasMaximo,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) AS fkEstufa
            FROM sensor
            JOIN estufa e ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
        WHERE r.dtHrRegistro = (
            SELECT MAX(r2.dtHrRegistro)
            FROM registro r2
            WHERE r2.fkSensor = r.fkSensor
        )
        AND (r.ppm < sq_estufas.gasMinimo OR r.ppm > sq_estufas.gasMaximo);
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarRankingAlertas(idEmpresa) {

    var instrucaoSql = `
        SELECT
            sq_estufas.nome_estufa AS nome,
            COUNT(r.idRegistro) AS qtd_alertas
        FROM registro r
        JOIN (
            SELECT
                idSensor,
                e.nome AS nome_estufa,
                e.gasMinimo,
                e.gasMaximo,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) AS fkEstufa
            FROM sensor
            JOIN estufa e ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
        WHERE r.dtHrRegistro >= NOW() - INTERVAL 7 DAY
        AND (r.ppm < sq_estufas.gasMinimo OR r.ppm > sq_estufas.gasMaximo)
        GROUP BY sq_estufas.fkEstufa, sq_estufas.nome_estufa
        ORDER BY qtd_alertas DESC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPercentualRegistrosPorFaixa(idEmpresa) {

    var instrucaoSql = `
        SELECT
            SUM(CASE WHEN r.ppm BETWEEN sq_estufas.gasMinimo AND sq_estufas.gasMaximo THEN 1 ELSE 0 END) AS ideal,
            SUM(CASE WHEN 
                (r.ppm >= sq_estufas.gasMinimo - 100 AND r.ppm < sq_estufas.gasMinimo)
                OR
                (r.ppm > sq_estufas.gasMaximo AND r.ppm <= sq_estufas.gasMaximo + 100)
            THEN 1 ELSE 0 END) AS intermediaria,
            SUM(CASE WHEN 
                r.ppm < sq_estufas.gasMinimo - 100
                OR
                r.ppm > sq_estufas.gasMaximo + 100
            THEN 1 ELSE 0 END) AS critica
        FROM registro r
        JOIN (
            SELECT
                idSensor,
                e.gasMinimo,
                e.gasMaximo,
                ROW_NUMBER() OVER (ORDER BY fkEstufa) AS fkEstufa
            FROM sensor
            JOIN estufa e ON fkEstufa = idEstufa
            WHERE fkEmpresa = ${idEmpresa}
            ) AS sq_estufas
        ON fkSensor = sq_estufas.idSensor
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
