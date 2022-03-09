/* Defines schema for Helpify's database. */

CREATE DATABASE IF NOT EXISTS teamb005;

CREATE TABLE IF NOT EXISTS employee (
    employee_id MEDIUMINT UNSIGNED,
    name VARCHAR(150),
    job VARCHAR(100),
    department VARCHAR(100),
    telephone CHAR(10),
    PRIMARY KEY (employee_id)
);

CREATE TABLE IF NOT EXISTS users (
    user_id MEDIUMINT UNSIGNED,
    username VARCHAR(50) NOT NULL UNIQUE,
    password BLOB NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS handler (
    user_id MEDIUMINT UNSIGNED,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS hardware (
    hardware_id MEDIUMINT UNSIGNED,
    manufacturer VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(150),
    warranty_status ENUM('active', 'expired') NOT NULL,
    PRIMARY KEY (hardware_id)
);

CREATE TABLE IF NOT EXISTS operating_system (
    name VARCHAR(50),
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS software (
    software_id MEDIUMINT UNSIGNED,
    name      VARCHAR(255),
    supported  BOOLEAN,
    licensed  BOOLEAN,
    PRIMARY KEY (software_id)
);

CREATE TABLE IF NOT EXISTS problem_type (
    problem_type_id MEDIUMINT UNSIGNED,
    name      VARCHAR(150) NOT NULL UNIQUE,
    links_to MEDIUMINT UNSIGNED,
    PRIMARY KEY (problem_type_id)
);

CREATE TABLE IF NOT EXISTS solution (
    solution_id MEDIUMINT UNSIGNED AUTO_INCREMENT,
    solution_description VARCHAR(500),
    PRIMARY KEY (solution_id)
);

CREATE TABLE IF NOT EXISTS internal_specialist (
    employee_id MEDIUMINT UNSIGNED,
    handler_id MEDIUMINT UNSIGNED,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (handler_id) REFERENCES handler(user_id)
);

CREATE TABLE IF NOT EXISTS external_specialist (
    external_specialist_id MEDIUMINT UNSIGNED,
    name VARCHAR(150),
    PRIMARY KEY (external_specialist_id),
    FOREIGN KEY (external_specialist_id) REFERENCES handler(user_id)
);

CREATE TABLE IF NOT EXISTS analyst (
    employee_id MEDIUMINT UNSIGNED,
    user_id MEDIUMINT UNSIGNED NOT NULL UNIQUE,
    PRIMARY KEY (employee_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS ticket (
    ticket_id MEDIUMINT UNSIGNED,
    employee_id MEDIUMINT UNSIGNED NOT NULL,
    status ENUM('active', 'dropped', 'submitted', 'pending', 'closed', 'unsuccessful') NOT NULL,
    priority ENUM('medium', 'low', 'high') NOT NULL,
    solution_description VARCHAR(300),
    notes VARCHAR(1000),
    creation_date DATE NOT NULL,
    last_updated DATE NOT NULL,
    handler_id MEDIUMINT UNSIGNED NOT NULL,
    solved_by MEDIUMINT UNSIGNED NOT NULL,
    operating_system VARCHAR(50),
    hardware_id MEDIUMINT UNSIGNED, /* Hardware id bit */
    software_id MEDIUMINT UNSIGNED,
    problem_type_id MEDIUMINT UNSIGNED NOT NULL,
    number_of_drops MEDIUMINT UNSIGNED DEFAULT 0 NOT NULL,
    closing_date DATE,
    closing_time TIME,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (hardware_id) REFERENCES hardware(hardware_id),
    FOREIGN KEY (software_id) REFERENCES software(software_id),
    FOREIGN KEY (problem_type_id) REFERENCES problem_type(problem_type_id),
    FOREIGN KEY (handler_id) REFERENCES handler(user_id),
    FOREIGN KEY (solved_by) REFERENCES handler(user_id),
    FOREIGN KEY (operating_system) REFERENCES operating_system(name)
);

CREATE TABLE IF NOT EXISTS ticket_solution (
    ticket_id MEDIUMINT UNSIGNED,
    solution_id MEDIUMINT UNSIGNED,
    solution_status ENUM('successful', 'unsuccessful', 'pending') NOT NULL,
    handler_id MEDIUMINT UNSIGNED NOT NULL,
    PRIMARY KEY (ticket_id, solution_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id),
    FOREIGN KEY (handler_id) REFERENCES handler(user_id),
    FOREIGN KEY (solution_id) REFERENCES solution(solution_id)
    
);

CREATE TABLE IF NOT EXISTS dropped (
    drop_id MEDIUMINT UNSIGNED AUTO_INCREMENT,
    reason VARCHAR(300) NOT NULL,
    drop_date DATE NOT NULL,
    drop_time TIME NOT NULL,
    ticket_id MEDIUMINT UNSIGNED NOT NULL,
    -- internal_specialist_id MEDIUMINT UNSIGNED,
    -- external_specialist_id MEDIUMINT UNSIGNED,
    handler_id MEDIUMINT UNSIGNED NOT NULL,
    PRIMARY KEY (drop_id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id),
    FOREIGN KEY (handler_id) REFERENCES handler(user_id)
    -- FOREIGN KEY (internal_specialist_id) REFERENCES internal_specialist(employee_id),
    -- FOREIGN KEY (external_specialist_id) REFERENCES external_specialist(external_specialist_id),
    -- CONSTRAINT either_internal_or_external CHECK
    --     ((internal_specialist_id IS NOT NULL AND external_specialist_id IS NULL)
    --     OR (internal_specialist_id IS NULL AND external_specialist_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS skillset (
    skill_id MEDIUMINT UNSIGNED AUTO_INCREMENT,
    handler_id MEDIUMINT UNSIGNED NOT NULL,
    problem_type_id MEDIUMINT UNSIGNED NOT NULL,
    PRIMARY KEY (skill_id),
    FOREIGN KEY (problem_type_id) REFERENCES problem_type(problem_type_id),
    FOREIGN KEY (handler_id) REFERENCES handler(user_id)
);