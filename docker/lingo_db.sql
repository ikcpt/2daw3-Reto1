DROP DATABASE IF EXISTS lingo_db;
CREATE DATABASE lingo_db;

USE lingo_db;

CREATE TABLE IF NOT EXISTS usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    intentos INT ,
    rondas_ganadas INT,
    mejor_tiempo INT
);