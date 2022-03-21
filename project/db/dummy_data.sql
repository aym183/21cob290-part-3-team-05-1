-- Dummy data as of 10.03.22 (March 10)

INSERT INTO `analyst` (`employee_id`, `user_id`) VALUES
(3, 3),
(7, 6);


INSERT INTO `dropped` (`drop_id`, `reason`, `drop_date`, `drop_time`, `ticket_id`, `handler_id`) VALUES
(1, 'Employee ran Windows network diagnostics - specialist not needed', '2022-03-02', '15:25:03', 1002, 1);

INSERT INTO `employee` (`employee_id`, `name`, `job`, `department`, `telephone`) VALUES
(1, 'Marie Kelle', 'Specialist', 'Legal', '+44 5283 803529'),
(2, 'Bern Duck', 'Specialist', 'Hardware', '+44 3452 345924'),
(3, 'Dionis Scriviner', 'Analyst', 'Marketing', '+44 1115 701834'),
(4, 'Cathrin Knowller', 'Specialist ', 'Creative', '+44 2048 284870'),
(5, 'Abby Haskell', 'Developer ', 'Business Development', '+44 4081 804861'),
(6, 'Joshua Sells', 'Call Centre Employee', 'Sales', '+44 2835 283467'),
(7, 'Audrey Barker', 'Analyst', 'Technical', '+44 0923 956322'),
(8, 'Billy Marsden', 'Support', 'Sales', '+44 2935 828593'),
(9, 'Ryan Jenson', 'Specialist', 'Mobile ', '+44 9324 945921'),
(10, 'Edwin Smith', 'Specialist', 'OS', '+44 1328 502231'),
(11, 'Darcie Bueller', 'Admin', 'Operations', '+44 0990 355442');

INSERT INTO `external_specialist` (`external_specialist_id`, `name`) VALUES
(4, 'Blake Summers'),
(11, 'Oscar Thompson');

INSERT INTO `handler` (`user_id`) VALUES
(1),
(2),
(4),
(5),
(9),
(10),
(11);

INSERT INTO `hardware` (`hardware_id`, `manufacturer`, `make`, `model`, `warranty_status`) VALUES
(1, 'Dell', 'Inspiron', '2022', 'active'),
(2, 'Apple', 'Macbook Pro', '2016', 'active'),
(3, 'Canon ', 'Pixma', '2022', 'active'),
(4, 'EPSON', 'Perfection Scanner', '2021', 'active'),
(5, 'Apple', 'iPad Pro', '2021', 'active'),
(6, 'Acer', 'Monitor', 'KG271G ', 'active'),
(7, 'Acer', 'Monitor', 'ED273Bbmiix', 'expired');

INSERT INTO `internal_specialist` (`employee_id`, `handler_id`) VALUES
(1, 1),
(2, 2),
(4, 5),
(9, 9),
(10, 10);

INSERT INTO `operating_system` (`name`) VALUES
('Apple iOS 14'),
('Apple iOS 15'),
('Apple Mac OSX 12'),
('Microsoft Windows 10'),
('Microsoft Windows 11');

INSERT INTO `problem_type` (`problem_type_id`, `name`, `links_to`) VALUES
(1, 'Software', NULL),
(2, 'Hardware', NULL),
(3, 'Office', 1),
(4, 'Zoom', 1),
(5, 'PC (Conventional)', 2),
(6, 'Apple ', 2),
(7, 'Printers', 2),
(8, 'Scanners', 2),
(9, 'Monitors', 2),
(10, 'Excel', 3),
(11, 'Word', 3),
(12, 'Browser', 1),
(13, 'Creative', 1);


INSERT INTO `skillset` (`skill_id`, `handler_id`, `problem_type_id`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 2, 2),
(4, 1, 4),
(5, 9, 2),
(6, 9, 6),
(7, 10, 1),
(8, 10, 6),
(9, 10, 5),
(10, 11, 2),
(11, 11, 7),
(12, 11, 8),
(13, 4, 11),
(14, 4, 10),
(15, 5, 13);

INSERT INTO `software` (`software_id`, `name`, `supported`, `licensed`) VALUES
(1, 'Zoom Meetings', 1, 1),
(2, 'Microsoft Office 365', 1, 1),
(3, 'Skype', 1, 1),
(4, 'Sage', 1, 1),
(5, 'Google Chrome', 1, 1),
(6, 'Microsoft Edge', 1, 1),
(7, 'Adobe Photoshop', 1, 1),
(8, 'Movie Studio 13', 0, 0);

INSERT INTO `solution` (`solution_id`, `solution_description`) VALUES
(2001, 'Reboot printer and reinsert cartridges'),
(2002, 'Boot OS from an external hard drive or USB');

INSERT INTO `ticket` (`ticket_id`, `employee_id`, `status`, `priority`, `solution_description`, `notes`, `creation_date`, `last_updated`, `handler_id`, `solved_by`, `operating_system`, `hardware_id`, `software_id`, `problem_type_id`, `number_of_drops`, `closing_date`, `closing_time`) VALUES
(1001, 5, 'active', 'medium', NULL, 'PC stuck on black screen when turning on', '2022-03-09', '2022-03-09', 2, NULL, NULL, 1, NULL, 2, 0, NULL, NULL),
(1002, 5, 'dropped', 'low', 'Employee ran Windows network diagnostics - specialist not needed', 'Zoom connection unstable', '2022-03-01', '2022-03-02', 1, NULL, 'Microsoft Windows 11', NULL, 1, 4, 1, '2022-03-02', '15:24:36'),
(1003, 8, 'closed', 'low', 'Reboot system and replace cartridges', 'Canon Pixma not detecting ink cartridges', '2022-03-01', '2022-03-03', 11, 11, NULL, 3, NULL, 7, 0, '2022-03-03', '01:00:30'),
(1004, 8, 'closed', 'high', 'Boot OS from an external hard drive or USB', 'Apple OS refuses to boot', '2022-02-23', '2022-02-24', 10, 10, 'Apple iOS 14', 2, NULL, 6, 0, '2022-02-24', '12:34:00');

INSERT INTO `ticket_solution` (`ticket_id`, `solution_id`, `solution_status`, `handler_id`) VALUES
(1003, 2001, 'successful', 11),
(1004, 2002, 'successful', 10);

INSERT INTO `users` (`user_id`, `username`, `password`) VALUES
(1, 'MarieK', ''),
(2, 'BernD', ''),
(3, 'Dio', ''),
(4, 'BlakeS', ''),
(5, 'CatK', '');

