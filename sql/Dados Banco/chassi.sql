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
-- Estrutura da tabela `chassi`
--

CREATE TABLE `chassi` (
  `id_chassi` int(11) NOT NULL,
  `numero_chassi` varchar(17) COLLATE utf8_unicode_ci NOT NULL,
  `modelo_veiculo` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ano_fabricacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `chassi`
--
ALTER TABLE `chassi`
  ADD PRIMARY KEY (`id_chassi`),
  ADD UNIQUE KEY `numero_chassi` (`numero_chassi`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `chassi`
--
ALTER TABLE `chassi`
  MODIFY `id_chassi` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
