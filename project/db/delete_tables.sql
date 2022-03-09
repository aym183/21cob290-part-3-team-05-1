/* Deletes all rows from all tables in the Helpify's database. */

DELETE IGNORE FROM hardware;
DELETE IGNORE FROM software;
DELETE IGNORE FROM internal_specialist;
DELETE IGNORE FROM external_specialist;
DELETE IGNORE FROM analyst;
DELETE IGNORE FROM problem_type;
DELETE IGNORE FROM employee;
DELETE IGNORE FROM ticket;
DELETE IGNORE FROM solution;
DELETE IGNORE FROM ticket_solution;
DELETE IGNORE FROM handler;
DELETE IGNORE FROM users;
DELETE IGNORE FROM dropped;
DELETE IGNORE FROM operating_system;
DELETE IGNORE FROM skillset;