-- ============================================================
-- i9+ Baterias — Sistema de Inventário ESG (BESS)
-- Script de criação do banco de dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS i9plus_bess
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE i9plus_bess;

CREATE TABLE IF NOT EXISTS baterias (
    -- Identificação
    id              INT AUTO_INCREMENT PRIMARY KEY,
    codigo_unico    VARCHAR(50)  NOT NULL UNIQUE COMMENT 'ID/Código único da bateria',
    fabricante      VARCHAR(100) NOT NULL,
    modelo          VARCHAR(100) NOT NULL,
    quimica         ENUM('LFP','NMC','LCO','NCA','Outro') NOT NULL COMMENT 'Química da célula',
    data_fabricacao DATE         NOT NULL,

    -- Estado Técnico
    soh_percentual      DECIMAL(5,2) NOT NULL COMMENT 'State of Health em %',
    capacidade_original DECIMAL(8,2) NOT NULL COMMENT 'Capacidade original em kWh',
    ciclos_anteriores   INT          NOT NULL DEFAULT 0,

    -- Rastreabilidade
    status          ENUM('Em estoque','Segunda vida ativa','Descartada') NOT NULL DEFAULT 'Em estoque',
    data_entrada    DATE         NOT NULL,
    localizacao     VARCHAR(200) NOT NULL COMMENT 'Localização atual',
    origem          VARCHAR(200) NOT NULL COMMENT 'Procedência (ex: montadora, modelo do VE)',

    -- ESG
    motivo_saida    VARCHAR(300) NULL COMMENT 'Motivo de retirada de operação',
    destino_final   VARCHAR(200) NULL COMMENT 'Destino após descarte / reuso',

    -- Metadados
    criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dados de exemplo para demonstração na call
INSERT INTO baterias (
    codigo_unico, fabricante, modelo, quimica,
    data_fabricacao, soh_percentual, capacidade_original, ciclos_anteriores,
    status, data_entrada, localizacao, origem
) VALUES
(
    'I9-2024-001', 'CATL', 'LiFePO4-100', 'LFP',
    '2019-06-15', 78.50, 100.00, 1240,
    'Segunda vida ativa', '2024-03-10', 'Galpão A - Prateleira 3', 'BYD Han EV 2019'
),
(
    'I9-2024-002', 'Panasonic', 'NCR18650B', 'NMC',
    '2020-01-20', 72.00, 75.00, 980,
    'Em estoque', '2024-05-22', 'Galpão A - Prateleira 1', 'Tesla Model 3 2020'
),
(
    'I9-2025-003', 'Samsung SDI', 'INR21700-50E', 'NMC',
    '2021-11-08', 81.30, 82.00, 650,
    'Em estoque', '2025-01-15', 'Galpão B - Prateleira 2', 'Hyundai Ioniq 5 2021'
);
