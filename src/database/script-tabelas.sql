-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!


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
    CONSTRAINT ckcargo CHECK (cargo IN('Funcionário Comum', 'Administrador'))
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
    CONSTRAINT cStatus CHECK (sensor_status IN ('Ativo' , 'Inativo'))
);

CREATE TABLE registro (
    idRegistro INT PRIMARY KEY AUTO_INCREMENT,
    fkSensor INT,
    PPM float,
    dtHrRegistro DATETIME DEFAULT (NOW()),
    CONSTRAINT cFkSensor FOREIGN KEY (fkSensor)
        REFERENCES sensor (idSensor)
);

INSERT INTO empresa (nome, cnpj, telefone, emailCorporativo, codigo_acesso) VALUES
('Red Berry Company', '45083604000187', '11975519892', 'redberrycompanyy@gmail.com', 'rbc123'),
('Berry House', '12345678000199', '11988887777', 'contato@berryhouse.com.br', 'bh123');

INSERT INTO funcionario (fkEmpresa, nome, cpf, email, senha, cargo) VALUES
(1, 'Arthur Lima Azevedo', 96255467802,'arthur.lazev@redberry.com.br', 'l4am0Pr@_01', 'Administrador'),
(1, 'Lucas Pereira Silva', '12345678901', 'lucas.silva@redberry.com.br', 'luc@S123', 'Funcionário Comum'),
(2, 'Mariana Costa Souza', '23456789012', 'mariana.souza@redberry.com.br', 'mar!2026', 'Funcionário Comum'),
(2, 'Carlos Eduardo Lima', '34567890123', 'carlos.lima@redberry.com.br', 'carl0s#adm', 'Administrador');


INSERT INTO estufa (nome, fkEmpresa, gasMinimo, gasMaximo) VALUES
('Estufa M01', 1, 300, 900),
('Estufa M02', 1, 350, 850),
('Estufa M03', 1, 400, 800),
('Estufa H01', 2, 300, 900),
('Estufa H01', 2, 450, 850),
('Estufa H01', 2, 390, 880);

INSERT INTO sensor (modelo, dtInstalacao, sensor_status, fkEstufa) VALUES
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
('Arduino MQ-2 UNO', '2026-04-27', 'Inativo', 6);