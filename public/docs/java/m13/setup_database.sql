-- CODEQUEST M13 — Base de Donnees
-- Script SQL a executer dans phpMyAdmin ou MySQL CLI

CREATE DATABASE IF NOT EXISTS labo_inventions;
USE labo_inventions;

CREATE TABLE IF NOT EXISTS inventions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    annee INT NOT NULL,
    inventeur VARCHAR(200),
    categorie VARCHAR(100) DEFAULT 'General'
);

-- Donnees de test
INSERT INTO inventions (nom, annee, inventeur, categorie) VALUES
('Telephone', 1876, 'Graham Bell', 'Communication'),
('Ampoule', 1879, 'Thomas Edison', 'Electricite'),
('Internet', 1969, 'ARPANET', 'Communication'),
('Java', 1995, 'James Gosling', 'Informatique'),
('Smartphone', 2007, 'Apple', 'Communication');

-- Requetes utiles
SELECT * FROM inventions;
SELECT * FROM inventions WHERE annee > 1900;
SELECT COUNT(*) AS total FROM inventions;
SELECT categorie, COUNT(*) AS nb FROM inventions GROUP BY categorie;
