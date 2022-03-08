
CREATE DATABASE markr;

\c markr;

CREATE TABLE TestResults (
    id SERIAL PRIMARY KEY,
    scan_date TIMESTAMP WITH TIME ZONE,
    student_first_name VARCHAR(250),
    student_last_name VARCHAR(250),
    student_number INTEGER,
    test_id INTEGER,
    marks_available SMALLINT,
    marks_obtained SMALLINT,
    marks_percentage DECIMAL
);

-- DB test
-- INSERT INTO TestResults (scan_date, student_first_name, student_last_name, student_number, test_id, marks_available, marks_obtained, marks_percentage) values ('2017-12-04T12:12:10+11:00', 'Jane', 'Austen', '521585128', '1234', '20', '13', '0.65');