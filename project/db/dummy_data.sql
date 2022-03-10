-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 10, 2022 at 02:10 PM
-- Server version: 5.5.68-MariaDB
-- PHP Version: 8.0.16

-- Dummy data as of 10.03.22 (March 10)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teamb005`
--

-- --------------------------------------------------------

--
-- Table structure for table `analyst`
--

CREATE TABLE `analyst` (
  `employee_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `user_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `analyst`
--

INSERT INTO `analyst` (`employee_id`, `user_id`) VALUES
(3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `dropped`
--

CREATE TABLE `dropped` (
  `drop_id` mediumint(8) UNSIGNED NOT NULL,
  `reason` varchar(300) NOT NULL,
  `drop_date` date NOT NULL,
  `drop_time` time NOT NULL,
  `ticket_id` mediumint(8) UNSIGNED NOT NULL,
  `handler_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dropped`
--

INSERT INTO `dropped` (`drop_id`, `reason`, `drop_date`, `drop_time`, `ticket_id`, `handler_id`) VALUES
(1, 'Employee ran Windows network diagnostics - specialist not needed', '2022-03-02', '15:25:03', 1002, 1);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `employee_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `name` varchar(150) DEFAULT NULL,
  `job` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `telephone` char(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`employee_id`, `name`, `job`, `department`, `telephone`) VALUES
(1, 'Marie Kelle', 'Specialist', 'Legal', '+44 5283 803529'),
(2, 'Bern Duck', 'Specialist', 'Hardware', '+44 3452 345924'),
(3, 'Dionis Scriviner', 'Analyst', 'Marketing', '+44 1115 701834'),
(4, 'Cathrin Knowller', 'Specialist ', 'Support', '+44 2048 284870'),
(5, 'Abby Haskell', 'Developer II', 'Business Development', '+44 4081 804861');

-- --------------------------------------------------------

--
-- Table structure for table `external_specialist`
--

CREATE TABLE `external_specialist` (
  `external_specialist_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `name` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `external_specialist`
--

INSERT INTO `external_specialist` (`external_specialist_id`, `name`) VALUES
(4, 'Blake Summers');

-- --------------------------------------------------------

--
-- Table structure for table `handler`
--

CREATE TABLE `handler` (
  `user_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `handler`
--

INSERT INTO `handler` (`user_id`) VALUES
(1),
(2),
(4),
(5);

-- --------------------------------------------------------

--
-- Table structure for table `hardware`
--

CREATE TABLE `hardware` (
  `hardware_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `manufacturer` varchar(100) DEFAULT NULL,
  `make` varchar(100) DEFAULT NULL,
  `model` varchar(150) DEFAULT NULL,
  `warranty_status` enum('active','expired') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `hardware`
--

INSERT INTO `hardware` (`hardware_id`, `manufacturer`, `make`, `model`, `warranty_status`) VALUES
(1, 'Dell', 'Inspiron', '2022', 'active'),
(2, 'Apple', 'Macbook Pro', '2016', 'expired');

-- --------------------------------------------------------

--
-- Table structure for table `internal_specialist`
--

CREATE TABLE `internal_specialist` (
  `employee_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `handler_id` mediumint(8) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `internal_specialist`
--

INSERT INTO `internal_specialist` (`employee_id`, `handler_id`) VALUES
(1, 1),
(2, 2),
(4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `operating_system`
--

CREATE TABLE `operating_system` (
  `name` varchar(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `operating_system`
--

INSERT INTO `operating_system` (`name`) VALUES
('Apple Mac OSX 12'),
('Microsoft Windows 10'),
('Microsoft Windows 11');

-- --------------------------------------------------------

--
-- Table structure for table `problem_type`
--

CREATE TABLE `problem_type` (
  `problem_type_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `name` varchar(150) NOT NULL,
  `links_to` mediumint(8) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `problem_type`
--

INSERT INTO `problem_type` (`problem_type_id`, `name`, `links_to`) VALUES
(1, 'Software', NULL),
(2, 'Hardware', NULL),
(3, 'Office', 1),
(4, 'Zoom', 1);

-- --------------------------------------------------------

--
-- Table structure for table `skillset`
--

CREATE TABLE `skillset` (
  `skill_id` mediumint(8) UNSIGNED NOT NULL,
  `handler_id` mediumint(8) UNSIGNED NOT NULL,
  `problem_type_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `skillset`
--

INSERT INTO `skillset` (`skill_id`, `handler_id`, `problem_type_id`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 2, 2),
(4, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `software`
--

CREATE TABLE `software` (
  `software_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `supported` tinyint(1) DEFAULT NULL,
  `licensed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `software`
--

INSERT INTO `software` (`software_id`, `name`, `supported`, `licensed`) VALUES
(1, 'Zoom Meetings', 1, 1),
(2, 'Microsoft Office 365', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `solution`
--

CREATE TABLE `solution` (
  `solution_id` mediumint(8) UNSIGNED NOT NULL,
  `solution_description` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticket_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `employee_id` mediumint(8) UNSIGNED NOT NULL,
  `status` enum('active','dropped','submitted','pending','closed','unsuccessful') NOT NULL,
  `priority` enum('medium','low','high') NOT NULL,
  `solution_description` varchar(300) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `creation_date` date NOT NULL,
  `last_updated` date NOT NULL,
  `handler_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `solved_by` mediumint(8) UNSIGNED DEFAULT NULL,
  `operating_system` varchar(50) DEFAULT NULL,
  `hardware_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `software_id` mediumint(8) UNSIGNED DEFAULT NULL,
  `problem_type_id` mediumint(8) UNSIGNED NOT NULL,
  `number_of_drops` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `closing_date` date DEFAULT NULL,
  `closing_time` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`ticket_id`, `employee_id`, `status`, `priority`, `solution_description`, `notes`, `creation_date`, `last_updated`, `handler_id`, `solved_by`, `operating_system`, `hardware_id`, `software_id`, `problem_type_id`, `number_of_drops`, `closing_date`, `closing_time`) VALUES
(1001, 5, 'active', 'medium', NULL, 'PC stuck on black screen when turning on', '2022-03-09', '2022-03-09', 2, NULL, NULL, 1, NULL, 2, 0, NULL, NULL),
(1002, 5, 'dropped', 'low', 'Employee ran Windows network diagnostics - specialist not needed', 'Zoom connection unstable', '2022-03-01', '2022-03-02', 1, NULL, 'Microsoft Windows 11', NULL, 1, 4, 1, '2022-03-02', '15:24:36');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_solution`
--

CREATE TABLE `ticket_solution` (
  `ticket_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `solution_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `solution_status` enum('successful','unsuccessful','pending') NOT NULL,
  `handler_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` mediumint(8) UNSIGNED NOT NULL DEFAULT '0',
  `username` varchar(50) NOT NULL,
  `password` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`) VALUES
(1, 'MarieK', ''),
(2, 'BernD', ''),
(3, 'Dio', ''),
(4, 'BlakeS', ''),
(5, 'CatK', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analyst`
--
ALTER TABLE `analyst`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `dropped`
--
ALTER TABLE `dropped`
  ADD PRIMARY KEY (`drop_id`),
  ADD KEY `ticket_id` (`ticket_id`),
  ADD KEY `handler_id` (`handler_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `external_specialist`
--
ALTER TABLE `external_specialist`
  ADD PRIMARY KEY (`external_specialist_id`);

--
-- Indexes for table `handler`
--
ALTER TABLE `handler`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `hardware`
--
ALTER TABLE `hardware`
  ADD PRIMARY KEY (`hardware_id`) USING BTREE;

--
-- Indexes for table `internal_specialist`
--
ALTER TABLE `internal_specialist`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `handler_id` (`handler_id`);

--
-- Indexes for table `operating_system`
--
ALTER TABLE `operating_system`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `problem_type`
--
ALTER TABLE `problem_type`
  ADD PRIMARY KEY (`problem_type_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `skillset`
--
ALTER TABLE `skillset`
  ADD PRIMARY KEY (`skill_id`),
  ADD KEY `problem_type_id` (`problem_type_id`),
  ADD KEY `handler_id` (`handler_id`);

--
-- Indexes for table `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`software_id`);

--
-- Indexes for table `solution`
--
ALTER TABLE `solution`
  ADD PRIMARY KEY (`solution_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ticket_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `hardware_id` (`hardware_id`),
  ADD KEY `software_id` (`software_id`),
  ADD KEY `problem_type_id` (`problem_type_id`),
  ADD KEY `handler_id` (`handler_id`),
  ADD KEY `solved_by` (`solved_by`),
  ADD KEY `operating_system` (`operating_system`);

--
-- Indexes for table `ticket_solution`
--
ALTER TABLE `ticket_solution`
  ADD PRIMARY KEY (`ticket_id`,`solution_id`),
  ADD KEY `handler_id` (`handler_id`),
  ADD KEY `solution_id` (`solution_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dropped`
--
ALTER TABLE `dropped`
  MODIFY `drop_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `skillset`
--
ALTER TABLE `skillset`
  MODIFY `skill_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `solution`
--
ALTER TABLE `solution`
  MODIFY `solution_id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `analyst`
--
ALTER TABLE `analyst`
  ADD CONSTRAINT `analyst_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  ADD CONSTRAINT `analyst_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `dropped`
--
ALTER TABLE `dropped`
  ADD CONSTRAINT `dropped_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`),
  ADD CONSTRAINT `dropped_ibfk_2` FOREIGN KEY (`handler_id`) REFERENCES `handler` (`user_id`);

--
-- Constraints for table `external_specialist`
--
ALTER TABLE `external_specialist`
  ADD CONSTRAINT `external_specialist_ibfk_1` FOREIGN KEY (`external_specialist_id`) REFERENCES `handler` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `handler`
--
ALTER TABLE `handler`
  ADD CONSTRAINT `handler_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `internal_specialist`
--
ALTER TABLE `internal_specialist`
  ADD CONSTRAINT `internal_specialist_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  ADD CONSTRAINT `internal_specialist_ibfk_2` FOREIGN KEY (`handler_id`) REFERENCES `handler` (`user_id`);

--
-- Constraints for table `skillset`
--
ALTER TABLE `skillset`
  ADD CONSTRAINT `skillset_ibfk_1` FOREIGN KEY (`problem_type_id`) REFERENCES `problem_type` (`problem_type_id`),
  ADD CONSTRAINT `skillset_ibfk_2` FOREIGN KEY (`handler_id`) REFERENCES `handler` (`user_id`);

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`hardware_id`) REFERENCES `hardware` (`hardware_id`),
  ADD CONSTRAINT `ticket_ibfk_3` FOREIGN KEY (`software_id`) REFERENCES `software` (`software_id`),
  ADD CONSTRAINT `ticket_ibfk_4` FOREIGN KEY (`problem_type_id`) REFERENCES `problem_type` (`problem_type_id`),
  ADD CONSTRAINT `ticket_ibfk_5` FOREIGN KEY (`handler_id`) REFERENCES `handler` (`user_id`),
  ADD CONSTRAINT `ticket_ibfk_6` FOREIGN KEY (`solved_by`) REFERENCES `handler` (`user_id`),
  ADD CONSTRAINT `ticket_ibfk_7` FOREIGN KEY (`operating_system`) REFERENCES `operating_system` (`name`);

--
-- Constraints for table `ticket_solution`
--
ALTER TABLE `ticket_solution`
  ADD CONSTRAINT `ticket_solution_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`ticket_id`),
  ADD CONSTRAINT `ticket_solution_ibfk_2` FOREIGN KEY (`handler_id`) REFERENCES `handler` (`user_id`),
  ADD CONSTRAINT `ticket_solution_ibfk_3` FOREIGN KEY (`solution_id`) REFERENCES `solution` (`solution_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
