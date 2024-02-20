DROP DATABASE IF EXISTS dieArtbeit;
CREATE DATABASE dieArbeit;
USE dieArbeit;

CREATE TABLE department
(
    id   INT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE role
(
    id            INT,
    title         VARCHAR(30) NOT NULL,
    salary        DECIMAL     NOT NULL,
    department_id INT         NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee
(
    id         INT,
    first_name VARCHAR(30) NOT NULL,
    last_name  VARCHAR(30) NOT NULL,
    role_id    INT         NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);