CREATE DATABASE PI;
USE PI;


CREATE TABLE empresa (
    idempresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    cnpj CHAR(14) NOT NULL,
    telefone VARCHAR(20),
    emailCorporativo VARCHAR(220),
    codigo_acesso VARCHAR(45)
);

CREATE TABLE funcionario (
    idfuncionario INT PRIMARY KEY AUTO_INCREMENT,
    fkEmpresa INT,
    nome VARCHAR(45),
    cpf CHAR(11),
    email VARCHAR(220),
    senha VARCHAR(255),
    cargo VARCHAR(45),
    CONSTRAINT cFkEmpresa_func FOREIGN KEY (fkEmpresa)
        REFERENCES empresa (idempresa),
    CONSTRAINT ckcargo CHECK (
        cargo IN ('Funcionário Comum', 'Administrador')
    )
);



CREATE TABLE estufa (
    idestufa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    gasMinimo INT,
    gasMaximo INT,
    fkEmpresa INT,
    CONSTRAINT cFkEmpresa_estuf FOREIGN KEY (fkEmpresa)
        REFERENCES empresa (idempresa)
);


CREATE TABLE sensor (
    idSensor INT PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(45),
    dtInstalacao DATE,
    sensor_status VARCHAR(45),
    fkEstufa INT,
    CONSTRAINT cFkEstufa FOREIGN KEY (fkEstufa)
        REFERENCES estufa (idestufa),
    CONSTRAINT cStatus CHECK (
        sensor_status IN ('Ativo', 'Inativo')
    )
);


CREATE TABLE registro (
    idRegistro INT PRIMARY KEY AUTO_INCREMENT,
    fkSensor INT,
    PPM FLOAT,
    dtHrRegistro DATETIME DEFAULT NOW(),
    CONSTRAINT cFkSensor FOREIGN KEY (fkSensor)
        REFERENCES sensor (idSensor)
);


INSERT INTO empresa
(nome, cnpj, telefone, emailCorporativo, codigo_acesso)
VALUES
('Red Berry Company', '45083604000187', '11975519892', 'redberrycompanyy@gmail.com', 'rbc123'),
('Berry House', '12345678000199', '11988887777', 'contato@berryhouse.com.br', 'bh123');


INSERT INTO funcionario
(nome, cpf, email, senha, cargo, fkEmpresa)
VALUES
('Arthur Lima Azevedo', '96255467802','arthur.lazev@redberry.com', 'l4am0Pr@_01', 'Administrador', 1),

('Lucas Pereira Silva', '12345678901', 'lucas.silva@redberry.com', 'luc@S123', 'Funcionário Comum', 1),

('Mariana Costa Souza', '23456789012', 'mariana.souza@berryhouse.com.br', 'mar!2026', 'Funcionário Comum', 2),

('Carlos Eduardo Lima', '34567890123', 'carlos.lima@redberry.com', 'carl0s#adm', 'Administrador', 2),

('Suporte', '00000000000', 'gascontrol.suporte@gmail.com','G45.Control','Administrador', NULL),

('Isabella Martins', '45678901234', 'isabella.martins@redberry.com', 'Isa@2026', 'Funcionário Comum', 1),

('Mateus Oliveira', '56789012345', 'mateus.oliveira@redberry.com', 'Mat#2026', 'Funcionário Comum', 1),

('Amanda Ferreira', '67890123456', 'amanda.ferreira@berryhouse.com.br', 'Ama!2026', 'Administrador', 2),

('Manuella Arantes', '78901234567', 'manuella.arantes@berryhouse.com.br', 'Manu@2026', 'Funcionário Comum', 2),

('Arthur Souza', '89012345678', 'arthur.souza@redberry.com', 'Art#2026', 'Funcionário Comum', 1),

('Miguel Costa', '90123456789', 'miguel.costa@berryhouse.com.br', 'Mig@2026', 'Funcionário Comum', 2);




INSERT INTO estufa
(nome, fkEmpresa, gasMinimo, gasMaximo)
VALUES
('Estufa M01', 1, 300, 900),
('Estufa M02', 1, 350, 850),
('Estufa M03', 1, 400, 800),
('Estufa H01', 2, 300, 900),
('Estufa H02', 2, 450, 850),
('Estufa H03', 2, 390, 880),
('Estufa M04', 1, 320, 870),
('Estufa M05', 1, 350, 900),
('Estufa H04', 2, 400, 850),
('Estufa H05', 2, 450, 920);


INSERT INTO sensor
(modelo, dtInstalacao, sensor_status, fkEstufa)
VALUES
('Arduino MQ-2 UNO', '2026-04-22', 'Ativo', 1),
('Arduino MQ-2 UNO', '2026-04-22', 'Ativo', 1),
('Arduino MQ-2 UNO', '2026-04-23', 'Ativo', 2),
('Arduino MQ-2 UNO', '2026-04-23', 'Ativo', 2),
('Arduino MQ-2 UNO', '2026-04-24', 'Ativo', 3),
('Arduino MQ-2 UNO', '2026-04-24', 'Ativo', 3),
('Arduino MQ-2 UNO', '2026-04-25', 'Inativo', 4),
('Arduino MQ-2 UNO', '2026-04-25', 'Ativo', 4),
('Arduino MQ-2 UNO', '2026-04-26', 'Ativo', 5),
('Arduino MQ-2 UNO', '2026-04-26', 'Ativo', 5),
('Arduino MQ-2 UNO', '2026-04-27', 'Inativo', 6),
('Arduino MQ-2 UNO', '2026-04-27', 'Ativo', 6),
('Arduino MQ-2 UNO', '2026-05-01', 'Ativo', 7),
('Arduino MQ-2 UNO', '2026-05-01', 'Ativo', 7),
('Arduino MQ-2 UNO', '2026-05-02', 'Ativo', 8),
('Arduino MQ-2 UNO', '2026-05-02', 'Ativo', 8),
('Arduino MQ-2 UNO', '2026-05-03', 'Ativo', 9),
('Arduino MQ-2 UNO', '2026-05-03', 'Ativo', 9),
('Arduino MQ-2 UNO', '2026-05-04', 'Ativo', 10),
('Arduino MQ-2 UNO', '2026-05-04', 'Ativo', 10);



INSERT INTO registro (fkSensor, PPM) VALUES
(1,420),(1,450),(1,470),
(2,390),(2,410),
(3,550),(3,580),
(4,700),(4,720),
(5,810),(5,850),
(6,920),(6,940),
(7,500),(7,520),
(8,610),(8,620),
(9,450),(9,480),
(10,890),(10,910),
(11,760),(11,780),
(12,350),(12,380),
(13,430),(13,450),
(14,560),(14,580),
(15,670),(15,690),
(16,810),(16,850);


-- Exibe a última leitura registrada por sensor
CREATE VIEW vw_ultima_leitura_sensor AS
SELECT
    s.idSensor,
    s.modelo,
    MAX(r.dtHrRegistro) AS ultimaLeitura
FROM sensor s
JOIN registro r
ON s.idSensor = r.fkSensor
GROUP BY s.idSensor, s.modelo;

-- Exibe dados completos para dashboards
CREATE VIEW vw_dashboard_estufas AS
SELECT
    e.idestufa,
    e.nome AS estufa,
    emp.nome AS empresa,
    s.idSensor,
    s.sensor_status,
    r.PPM,
    r.dtHrRegistro
FROM estufa e
JOIN empresa emp
ON e.fkEmpresa = emp.idempresa
JOIN sensor s
ON s.fkEstufa = e.idestufa
LEFT JOIN registro r
ON r.fkSensor = s.idSensor;


-- Quantidade de funcionários por empresa
CREATE VIEW vw_funcionarios_empresa AS
SELECT
    emp.nome AS empresa,
    COUNT(f.idfuncionario) AS totalFuncionarios
FROM empresa emp
LEFT JOIN funcionario f
ON emp.idempresa = f.fkEmpresa
GROUP BY emp.nome;


-- Quantidade de sensores por status
CREATE VIEW vw_status_sensores AS
SELECT
    sensor_status,
    COUNT(*) AS quantidade
FROM sensor
GROUP BY sensor_status;


-- Lista todos os funcionários e suas empresas

SELECT
    f.nome,
    f.cargo,
    emp.nome AS empresa
FROM funcionario f
LEFT JOIN empresa emp
ON f.fkEmpresa = emp.idempresa;


-- Lista todas as estufas cadastradas
SELECT
    e.nome,
    emp.nome AS empresa,
    e.gasMinimo,
    e.gasMaximo
FROM estufa e
JOIN empresa emp
ON e.fkEmpresa = emp.idempresa;


-- Quantidade de sensores em cada estufa
SELECT
    e.nome AS estufa,
    COUNT(s.idSensor) AS totalSensores
FROM estufa e
LEFT JOIN sensor s
ON s.fkEstufa = e.idestufa
GROUP BY e.nome;


-- Média de PPM por sensor
SELECT
    s.idSensor,
    ROUND(AVG(r.PPM),2) AS mediaPPM
FROM sensor s
JOIN registro r
ON s.idSensor = r.fkSensor
GROUP BY s.idSensor;


-- Sensores acima do limite máximo permitido

SELECT
    e.nome AS estufa,
    s.idSensor,
    r.PPM,
    e.gasMaximo
FROM registro r
JOIN sensor s
ON r.fkSensor = s.idSensor
JOIN estufa e
ON s.fkEstufa = e.idestufa
WHERE r.PPM > e.gasMaximo;


-- Última leitura de cada sensor
SELECT
    s.idSensor,
    MAX(r.dtHrRegistro) AS ultimaLeitura
FROM sensor s
JOIN registro r
ON s.idSensor = r.fkSensor
GROUP BY s.idSensor;


-- Ranking de empresas por quantidade de estufas
SELECT
    emp.nome,
    COUNT(e.idestufa) AS totalEstufas
FROM empresa emp
JOIN estufa e
ON emp.idempresa = e.fkEmpresa
GROUP BY emp.nome
ORDER BY totalEstufas DESC;


-- Ranking de sensores por média de PPM
SELECT
    s.idSensor,
    ROUND(AVG(r.PPM),2) AS mediaPPM
FROM sensor s
JOIN registro r
ON s.idSensor = r.fkSensor
GROUP BY s.idSensor
ORDER BY mediaPPM DESC;


-- Quantidade de funcionários por cargo
SELECT
    cargo,
    COUNT(*) AS quantidade
FROM funcionario
GROUP BY cargo;


-- Total de registros armazenados por sensor
SELECT
    s.idSensor,
    COUNT(r.idRegistro) AS totalRegistros
FROM sensor s
LEFT JOIN registro r
ON s.idSensor = r.fkSensor
GROUP BY s.idSensor;