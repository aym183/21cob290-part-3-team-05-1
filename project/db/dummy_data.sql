-- Dummy data as of 10.03.22 (March 10)

INSERT INTO `analyst` (`employee_id`, `user_id`) VALUES
(3, 3);

INSERT INTO `dropped` (`drop_id`, `reason`, `drop_date`, `drop_time`, `ticket_id`, `handler_id`) VALUES
(1, 'Employee ran Windows network diagnostics - specialist not needed', '2022-03-02', '15:25:03', 1002, 1);

INSERT INTO `employee` (`employee_id`, `name`, `job`, `department`, `telephone`) VALUES
(1, 'Marie Kelle', 'Specialist', 'Legal', '+44 5283 803529'),
(2, 'Bern Duck', 'Specialist', 'Hardware', '+44 3452 345924'),
(3, 'Dionis Scriviner', 'Analyst', 'Marketing', '+44 1115 701834'),
(4, 'Cathrin Knowller', 'Specialist ', 'Support', '+44 2048 284870'),
(5, 'Abby Haskell', 'Developer II', 'Business Development', '+44 4081 804861');

INSERT INTO `external_specialist` (`external_specialist_id`, `name`) VALUES
(4, 'Blake Summers');

INSERT INTO `handler` (`user_id`) VALUES
(1),
(2),
(4),
(5);

INSERT INTO `hardware` (`hardware_id`, `manufacturer`, `make`, `model`, `warranty_status`) VALUES
(1, 'Dell', 'Inspiron', '2022', 'active'),
(2, 'Apple', 'Macbook Pro', '2016', 'expired');

INSERT INTO `internal_specialist` (`employee_id`, `handler_id`) VALUES
(1, 1),
(2, 2),
(4, 5);

INSERT INTO `operating_system` (`name`) VALUES
('Apple Mac OSX 12'),
('Microsoft Windows 10'),
('Microsoft Windows 11');

INSERT INTO `problem_type` (`problem_type_id`, `name`, `links_to`) VALUES
(1, 'Software', NULL),
(2, 'Hardware', NULL),
(3, 'Office', 1),
(4, 'Zoom', 1);

INSERT INTO `skillset` (`skill_id`, `handler_id`, `problem_type_id`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 2, 2),
(4, 1, 4);

INSERT INTO `software` (`software_id`, `name`, `supported`, `licensed`) VALUES
(1, 'Zoom Meetings', 1, 1),
(2, 'Microsoft Office 365', 1, 1);

INSERT INTO `ticket` (`ticket_id`, `employee_id`, `status`, `priority`, `solution_description`, `notes`, `creation_date`, `last_updated`, `handler_id`, `solved_by`, `operating_system`, `hardware_id`, `software_id`, `problem_type_id`, `number_of_drops`, `closing_date`, `closing_time`) VALUES
(1001, 5, 'active', 'medium', NULL, 'PC stuck on black screen when turning on', '2022-03-09', '2022-03-09', 2, NULL, NULL, 1, NULL, 2, 0, NULL, NULL),
(1002, 5, 'dropped', 'low', 'Employee ran Windows network diagnostics - specialist not needed', 'Zoom connection unstable', '2022-03-01', '2022-03-02', 1, NULL, 'Microsoft Windows 11', NULL, 1, 4, 1, '2022-03-02', '15:24:36');

INSERT INTO `users` (`user_id`, `username`, `password`) VALUES
(1, 'MarieK', ''),
(2, 'BernD', ''),
(3, 'Dio', ''),
(4, 'BlakeS', ''),
(5, 'CatK', '');

