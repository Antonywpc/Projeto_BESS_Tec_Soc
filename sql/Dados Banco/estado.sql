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
-- Estrutura da tabela `estado`
--

CREATE TABLE `estado` (
  `id_estado` int(11) NOT NULL,
  `uf` varchar(2) DEFAULT NULL,
  `estado` varchar(19) DEFAULT NULL,
  `id_regiao` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `estado`
--

INSERT INTO `estado` (`id_estado`, `uf`, `estado`, `id_regiao`) VALUES
(1, 'AC', 'ACRE', 3),
(2, 'AL', 'ALAGOAS', 2),
(3, 'AP', 'AMAPA', 3),
(4, 'AM', 'AMAZONAS', 3),
(5, 'BA', 'BAHIA', 2),
(6, 'CE', 'CEARA', 2),
(7, 'DF', 'DISTRITO FEDERAL', 6),
(8, 'ES', 'ESPIRITO SANTO', 4),
(9, 'GO', 'GOIAS', 1),
(10, 'MA', 'MARANHAO', 2),
(11, 'MT', 'MATO GROSSO', 1),
(12, 'MS', 'MATO GROSSO DO SUL', 1),
(13, 'MG', 'MINAS GERAIS', 4),
(14, 'PA', 'PARA', 3),
(15, 'PB', 'PARAIBA', 2),
(16, 'PR', 'PARANA', 5),
(17, 'PE', 'PERNAMBUCO', 2),
(18, 'PI', 'PIAUI', 2),
(19, 'RJ', 'RIO DE JANEIRO', 4),
(20, 'RN', 'RIO GRANDE DO NORTE', 2),
(21, 'RS', 'RIO GRANDE DO SUL', 5),
(22, 'RO', 'RONDONIA', 3),
(23, 'RR', 'RORAIMA', 3),
(24, 'SC', 'SANTA CATARINA', 5),
(25, 'SP', 'SAO PAULO', 4),
(26, 'SE', 'SERGIPE', 2),
(27, 'TO', 'TOCANTINS', 3);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id_estado`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
