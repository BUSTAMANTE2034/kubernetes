
-- Crear base de datos
CREATE DATABASE AC;  -- Actividades Complementarias
USE AC;

-- Crear tabla de Actividades
CREATE TABLE Activities (
    activity_id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(50) NOT NULL,
    total_hours INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Crear tabla de Estudiantes
CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    major VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    age INT NOT NULL,
    complementary_credits INT DEFAULT 0 CHECK (complementary_credits BETWEEN 0 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Crear tabla de Maestros
CREATE TABLE Teachers (
    teacher_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    activity_id INT NOT NULL,
    FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Crear tabla En Curso
CREATE TABLE In_Progress (
    course_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    schedule VARCHAR(50) NOT NULL,  -- Ejemplo: "10:00 - 13:00"
    hours_completed INT NOT NULL,
    hours_pending INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Operaciones CRUD para Activities
-- INSERT
INSERT INTO Activities (name, total_hours) VALUES ('Fútbol', 20);
-- UPDATE
UPDATE Activities SET name = 'Fútbol Sala', total_hours = 25 WHERE activity_id = 1;
-- SELECT
SELECT * FROM Activities;
-- DELETE
DELETE FROM Activities WHERE activity_id = 1;

-- Operaciones CRUD para Students
-- INSERT
INSERT INTO Students (student_id, full_name, major, semester, age, complementary_credits) VALUES (12345, 'Juan Pérez', 'Ingeniería', 3, 20, 2);
-- UPDATE
UPDATE Students SET full_name = 'Juan Pérez González', age = 21 WHERE student_id = 12345;
-- SELECT
SELECT * FROM Students;
-- DELETE
DELETE FROM Students WHERE student_id = 12345;

-- Operaciones CRUD para Teachers
-- INSERT
INSERT INTO Teachers (teacher_id, full_name, activity_id) VALUES (54321, 'María López', 1);
-- UPDATE
UPDATE Teachers SET full_name = 'María López Fernández' WHERE teacher_id = 54321;
-- SELECT
SELECT * FROM Teachers;
-- DELETE
DELETE FROM Teachers WHERE teacher_id = 54321;

-- Operaciones CRUD para In_Progress
-- INSERT
INSERT INTO In_Progress (student_id, teacher_id, day_of_week, schedule, hours_completed, hours_pending) VALUES (12345, 54321, 'Lunes', '10:00 - 13:00', 5, 5);
-- UPDATE
UPDATE In_Progress SET hours_completed = 6, hours_pending = 4 WHERE course_id = 1;
-- SELECT
SELECT * FROM In_Progress;
-- DELETE
DELETE FROM In_Progress WHERE course_id = 1;



--FLUJO
/*
Registro de Actividades:

Cuando se crea una nueva actividad en la tabla Activities, 
se proporciona el nombre y el total de horas requeridas. 
Este registro puede ser gestionado (actualizado o eliminado) más adelante.
______________________________________________________________________________________________

Registro de Estudiantes:

Los estudiantes se registran en la tabla Students, 
proporcionando información relevante. 
Cada estudiante puede estar asociado con múltiples actividades a través de la tabla In_Progress.
________________________________________________________________________________________________

Registro de Maestros:

Los maestros se registran en la tabla Teachers, 
vinculándolos con las actividades que imparten.
___________________________________________________________________________________________________________

Asignación de Clases:

En la tabla In_Progress, se registra cada clase que un estudiante toma con un maestro, 
incluyendo el horario y el progreso en horas. 
Esto permite un seguimiento claro de quién enseña qué, y qué estudiantes están inscritos en qué actividades.
__________________________________________________________________________________________________________________

Actualización y Eliminación:

La base de datos utiliza marcas de tiempo (created_at, updated_at, deleted_at) 
para gestionar el ciclo de vida de los registros, 
permitiendo un manejo eficaz de los datos sin pérdida de información crítica.*/
