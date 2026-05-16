-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 13-Maio-2026 às 17:20
-- Versão do servidor: 5.7.44-48
-- versão do PHP: 8.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dados: `inovem55_bancodadosve`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `classificacao_veiculo`
--

CREATE TABLE `classificacao_veiculo` (
  `id_classificacao` int(11) NOT NULL,
  `classificacao` varchar(19) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `classificacao_veiculo`
--

INSERT INTO `classificacao_veiculo` (`id_classificacao`, `classificacao`) VALUES
(1, 'AMBULANCIA'),
(2, 'AUTOMOVEL'),
(3, 'BICICLETA'),
(4, 'CAMINHAO'),
(5, 'CAMIONETA'),
(6, 'CICLOMOTOR'),
(7, 'MAQUINA AGRICOLA'),
(8, 'MAQUINA OPERACIONAL'),
(9, 'MAQUINA RODOVIARIA'),
(10, 'MOTO'),
(11, 'MOTO CARGA'),
(12, 'MOTOCICLETA'),
(13, 'MOTONETA'),
(14, 'MOTOR-CASA'),
(15, 'ONIBUS'),
(16, 'QUADRICICLO'),
(17, 'REBOQUE'),
(18, 'SEMI-REBOQUE'),
(19, 'SEMI-REBOQUE MOTO'),
(20, 'TRICICLO'),
(21, 'VAN'),
(22, 'VUC');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `classificacao_veiculo`
--
ALTER TABLE `classificacao_veiculo`
  ADD PRIMARY KEY (`id_classificacao`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
