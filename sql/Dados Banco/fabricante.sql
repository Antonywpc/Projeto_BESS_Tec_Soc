-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 13-Maio-2026 às 17:21
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
-- Estrutura da tabela `fabricante`
--

CREATE TABLE `fabricante` (
  `id_fabricante` int(11) NOT NULL,
  `fabricante` varchar(22) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `fabricante`
--

INSERT INTO `fabricante` (`id_fabricante`, `fabricante`) VALUES
(1, '4GVEVW'),
(2, 'AGRALE'),
(3, 'AIMA'),
(4, 'AIPAO GLOOV'),
(5, 'ANHUI'),
(6, 'ANHUINEON'),
(7, 'ANKAI'),
(8, 'AOXIN HITECH'),
(9, 'ARROW'),
(10, 'AUDI'),
(11, 'BENTLEY'),
(12, 'BIMOTA'),
(13, 'BMW'),
(14, 'BORAM'),
(15, 'BRAMONT'),
(16, 'BRAVA'),
(17, 'BUSSCAR'),
(18, 'BYD'),
(19, 'CAOA CHERY'),
(20, 'CHEVROLET'),
(21, 'CHRYSLERFCA'),
(22, 'CICLO WAY'),
(23, 'CITROEN'),
(24, 'CITY SPIRIT'),
(25, 'DAIMLER SMART'),
(26, 'DAYANG'),
(27, 'DAYI'),
(28, 'DFSK'),
(29, 'DODGE'),
(30, 'DONGFENG'),
(31, 'DONGGUAN TAILG'),
(32, 'FEVERRAP'),
(33, 'FIAT'),
(34, 'FISKER'),
(35, 'FLASH MV'),
(36, 'FNM'),
(37, 'FORD'),
(38, 'FOTON'),
(39, 'GAIA'),
(40, 'GEELY'),
(41, 'GIAFFONE'),
(42, 'GIRUZ'),
(43, 'GLOOV MANGOSTEEN'),
(44, 'GMC'),
(45, 'GS'),
(46, 'GUANGZHOU Z1 ELETRIC'),
(47, 'GURGEL'),
(48, 'GWM'),
(49, 'HANBIRD'),
(50, 'HAWK'),
(51, 'HIGER'),
(52, 'HONDA'),
(53, 'HORWIN'),
(54, 'HYUNDAI'),
(55, 'IWANJIN PEGASSI'),
(56, 'IWUXI'),
(57, 'IXINRI'),
(58, 'IYADEA'),
(59, 'JAC'),
(60, 'JAD'),
(61, 'JAGUAR'),
(62, 'JEEP'),
(63, 'JETOUR'),
(64, 'JIANGSU'),
(65, 'JIANGXINEON'),
(66, 'JINKANG SERES'),
(67, 'JINYNG SUPER SOCO'),
(68, 'JY'),
(69, 'KAINING'),
(70, 'KASINSKI'),
(71, 'KEYTON'),
(72, 'KIA'),
(73, 'KINMOTORS'),
(74, 'LAND ROVER'),
(75, 'LEOPARD'),
(76, 'LEXUS'),
(77, 'LUCID'),
(78, 'LUQI'),
(79, 'MARCOPOLO'),
(80, 'MASCAGRAN VIA'),
(81, 'MBENZ'),
(82, 'MILETO'),
(83, 'MINI'),
(84, 'MITSUBISHI'),
(85, 'MO DULEVO'),
(86, 'MPOLOTORINO ELETRICO'),
(87, 'MULTIEIXO ELETRA'),
(88, 'NANJING'),
(89, 'NDUSCAR'),
(90, 'NETA'),
(91, 'NEWSUMMIT'),
(92, 'NEXTEM ORCA'),
(93, 'NIFINITI'),
(94, 'NISSAN'),
(95, 'ORIGEM'),
(96, 'PEUGEOT'),
(97, 'PORSCHE'),
(98, 'POWERTRONIC MARCO POLO'),
(99, 'QINGLING ELF'),
(100, 'RENAULT'),
(101, 'REVA'),
(102, 'RIVIAN'),
(103, 'SAIC'),
(104, 'SHINERAY'),
(105, 'SINSKI'),
(106, 'SMARDA'),
(107, 'SMART'),
(108, 'SOKONDFSK'),
(109, 'SONIK EAGLEKING'),
(110, 'SOUSA'),
(111, 'SUBARU'),
(112, 'SUNHOU'),
(113, 'SUNSHINE'),
(114, 'TAILG'),
(115, 'TANK'),
(116, 'TESLA'),
(117, 'THINK'),
(118, 'TINBOT'),
(119, 'TINBOT KOLLTER'),
(120, 'TOYOTA'),
(121, 'TTOP ELET TRIC'),
(122, 'VMOTO'),
(123, 'VOLTZ'),
(124, 'VOLVO'),
(125, 'VW'),
(126, 'WAZN MOTORS'),
(127, 'WUXI GWS'),
(128, 'XCMG'),
(129, 'XINLING'),
(130, 'YADEA'),
(131, 'YUEJIN'),
(132, 'ZEEKR'),
(133, 'ZERO MOTORCYCLES'),
(134, 'ZHONGXING WIND'),
(135, 'GAC'),
(136, 'OMODA JAECOO');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `fabricante`
--
ALTER TABLE `fabricante`
  ADD PRIMARY KEY (`id_fabricante`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
