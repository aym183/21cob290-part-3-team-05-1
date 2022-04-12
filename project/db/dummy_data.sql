-- Dummy data as of 21.03.22 (March 21)

INSERT INTO `employee` (`employee_id`, `name`, `job`, `department`, `telephone`) VALUES
(2001 , 'Marie Kelle' ,'Specialist'  ,'Legal' ,'+44 5283 803529' ),
(2002 , 'Bern Duck' ,'Specialist' ,'Hardware' ,'+44 3452 345924' ),
(2003 , 'Dionis Scriviner' , 'Analyst' , 'Marketing'  , '+44 1115 701834'),
(2004 , 'Abby Haskell', 'Developer' ,'Business Development' ,'+44 4081 804861'),
(2005 , 'Joshua Sells' ,'Call Centre Employee' ,'Sales' ,'+44 2835 283467'),
(2006 , 'Cathrin Knowller', 'Specialist' ,'Creative'  ,'+44 2048 284870' ),
(2007 , 'Audrey Barker' , 'Analyst' ,'Technical '  ,'+44 0923 956322'),
(2008 ,'Billy Marsden  '  ,'Support'  ,'Sales' ,'+44 2935 828593' ),
(2009 , 'Ryan Jenson' ,'Specialist' , 'Mobile ',  '+44 9324 945921'),
(2010 , 'Edwin Smith' ,'Specialist ','OS' ,'+44 1328 502231' ),
(2011 ,'Darcie Bueller', 'Admin' ,'Operations','+44 0990 355442' ),
(2012 ,'Rob Davidson' , 'Designer'  ,'Creative' ,'+44 9235 183503'),
(2013 , 'Holly Livingstone' , 'Reports'  ,'Accounting'  ,'+44 9123 868942' ),
(2014 ,'Will Taha' ,'Clerk' , 'Customer Relations ' , '+44 1273 503022' ),
(2015, 'Ali Hannaford', 'Supervisor' , 'Technical' , '+44 2385 858534' );


INSERT INTO `users` VALUES
(2001 , 'MarieK'  , AES_ENCRYPT('Marie_PW',SHA2("MarieK",256))),
(2002 ,'BernD'  ,  AES_ENCRYPT('Bern_Pw',SHA2("BernD",256))),
(2003 , 'Dio'   ,  AES_ENCRYPT('Dio_Pw',SHA2("Dio",256))),
(2004 , 'AbbyH'  ,   AES_ENCRYPT('Abby_Pw',SHA2("AbbyH",256))),
(2005 , 'JoshuaS'  ,   AES_ENCRYPT('Joshua_Pw',SHA2("JoshuaS",256))),
(2006 , 'CatK'  ,   AES_ENCRYPT('Cat_Pw',SHA2("CatK",256))),
(2007 , 'AudreyB' , AES_ENCRYPT('Audrey_Pw',SHA2("AudreyB",256))),
(2008 , 'BillyM'  ,   AES_ENCRYPT('Billy_Pw',SHA2("BillyM",256))),
(2009 , 'RyanJ' , AES_ENCRYPT('Ryan_Pw',SHA2("RyanJ",256))),
(2010 ,'EdwinS' , AES_ENCRYPT('Edwin_Pw',SHA2("EdwinS",256))),
(2011 ,'DarcieB' , AES_ENCRYPT('Darcie_Pw',SHA2("DarcieB",256))),
(2012 ,'RobD' , AES_ENCRYPT('Rob_Pw',SHA2("RobD",256))),
(2013 ,'HollyL' , AES_ENCRYPT('Holly_Pw',SHA2("HollyL",256))),
(2014 ,'Will Taha' , AES_ENCRYPT('Will_Pw',SHA2("Will Taha",256))),
(2015 ,'AliH' , AES_ENCRYPT('Ali_Pw',SHA2("AliH",256))),
(1011 , 'OscarT' , AES_ENCRYPT('OscarPw',SHA2("OscarT",256)));

INSERT INTO `handler` VALUES
(2001),
(2002),
(2004),
(2009),
(2010),
(1011);

INSERT INTO `hardware` 
VALUES (1, 'Dell', 'Inspiron', '2022', 'active'),
(2, 'Apple', 'Macbook Pro', '2016', 'active'),
(3, 'Canon', 'Pixma', '2022', 'active'),
(4, 'EPSON', 'Perfection Scanner', '2021', 'active'),
(5, 'Apple', 'iPad Pro', '2021', 'active'),
(6, 'Acer', 'Monitor', 'KG271G ', 'active'),
(7, 'Acer', 'Monitor', 'ED273Bbmiix', 'expired');

INSERT INTO `operating_system` 
VALUES ('Apple iOS 14'),
('Apple iOS 15'),
('Apple Mac OSX 12'),
('Microsoft Windows 10'),
('Microsoft Windows 11');

INSERT INTO `software`  
VALUES (1, 'Zoom Meetings', 1, 1),
(2, 'Microsoft Office 365', 1, 1),
(3, 'Skype', 1, 1),
(4, 'Sage', 1, 1),
(5, 'Google Chrome', 1, 1),
(6, 'Microsoft Edge', 1, 1),
(7, 'Adobe Photoshop', 1, 1),
(8, 'Movie Studio 13', 0, 0);

INSERT INTO `problem_type`  
VALUES (1, 'Software', NULL),
(2, 'Hardware', NULL),
(3, 'Office', '1'),
(4, 'Zoom', '1'),
(5, 'PC (Conventional)', '2'),
(6, 'Apple ', '2'),
(7, 'Printer', '2'),
(8, 'Scanner', '2'),
(9, 'Monitor', "2"),
(10, 'Excel', '1, 3'),
(11, 'Word', '1, 3'),
(12, 'Browser', '1'),
(13, 'Printer ink empty', '2, 7');

INSERT INTO `internal_specialist` VALUES
(2001 , 2001),
(2002 , 2002),
(2004 , 2004 ),
(2009 , 2009),
(2010 , 2010 );

INSERT INTO `external_specialist` VALUES
(1011, 'Oscar Thompson');


INSERT INTO `analyst` VALUES
(2003, 2003),
(2007, 2007);

INSERT INTO `ticket` (`ticket_id`, `employee_id`, `status`, `priority`, `problem_description`, `notes`, `creation_date`, `last_updated`, `handler_id`, `operating_system`, `hardware_id`, `software_id`, `problem_type_id`, `number_of_drops`, `closing_date`, `closing_time`) VALUES
(1, 2005, 'active' , 'medium' ,'Computer not working' ,'C stuck on black screen when turning on' , '2022-03-09' , '2022-03-09' , 2002 ,  'Apple iOS 14', 1 ,  2 ,  2 , 1,  NULL , NULL ),
(2, 2005, 'dropped','low' , 'Zoom meeting not connecting', 'Zoom connection unstable' , '2022-03-01', '2022-03-02' ,  2001, 'Microsoft Windows 11' ,  4, 1 ,    4 , 1 ,NULL ,NULL),
(3, 2008, 'active' ,'low', 'Reboot system and replace cartridges', 'Canon Pixma not detecting ink cartridges '  ,'2022-03-01' , '2022-03-03', 1011, 'Microsoft Windows 11' , 3, 2,  7 , 0 ,'2022-03-03', '01:00:30'),
(4, 2008, 'closed','high' , 'Boot OS from an external hard drive or USB' ,'Apple OS refuses to boot' , '2022-02-23', '2022-02-24' , 2010, 'Apple iOS 14' ,  5 ,2,  6 , 0 ,'2022-02-24','12:34:00'),
(5, 2014, 'active' ,'medium' ,  'Credentials not working' ,'Department MS Office credentials not working' , '2022-03-01' ,'2022-03-01', 2001,'Microsoft Windows 10' ,  2,   2 ,  3 , 0 ,NULL , NULL    ),
(6, 2005, 'submitted' , 'high' ,  'Excel not opening' , 'Screen just freezes' , '2022-03-01' ,'2022-03-01', 2001,'Microsoft Windows 10', 2, 2, 10, 0 , NULL , NULL    );    


INSERT INTO `solution` VALUES
(1, "Reboot system and replace cartridges"),  
(2, "Boot OS from an external hard drive or USB");


INSERT INTO `ticket_solution`  VALUES
(4 , 1, 'successful' ,2010),
(6 , 2, 'pending' ,2001);


INSERT INTO `skillset` (`skill_id`, `handler_id`, `problem_type_id`) VALUES
(1, 2001 , 1),
(2, 2001 , 3 ),
(3, 2002 ,  2),
(4, 2001, 4),
(5 ,2009 ,  2 ),
(6 , 2009 , 6 ),
(7 , 2010 ,    1 ),
(8 ,   2010, 6 ),
(9,   2010 , 5 ),
(10 ,  1011 , 2 ),
(11 , 1011 ,    7 ),
(12 , 1011,  8),
(13 ,  2004 , 11),
(14, 2004 , 10),
(17 , 2002,  13),
(18 , 2002, 9 );

INSERT INTO `dropped`  VALUES
(1, 'Employee ran Windows network diagnostics - specialist not needed', '2022-03-02', '15:25:03', 1, 2002),
(2, 'Solution is not in my area of expertise', '2022-03-02', '15:25:03', 2, 2001);