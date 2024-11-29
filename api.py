from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://Lalo2034:Carbus600@Lalo2034.mysql.pythonanywhere-services.com:3306/Lalo2034$AC'
db = SQLAlchemy(app)
CORS(app)

# Modelo de Actividades
class Activity(db.Model):
    __tablename__ = 'Activities'
    activity_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    total_hours = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    deleted_at = db.Column(db.DateTime, nullable=True)

# Modelo de Estudiantes
class Student(db.Model):
    __tablename__ = 'Students'
    student_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    major = db.Column(db.String(50), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    complementary_credits = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    deleted_at = db.Column(db.DateTime, nullable=True)

# Modelo de Maestros
class Teacher(db.Model):
    __tablename__ = 'Teachers'
    teacher_id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('Activities.activity_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    deleted_at = db.Column(db.DateTime, nullable=True)

# Modelo de Clases en Progreso
class InProgress(db.Model):
    __tablename__ = 'In_Progress'
    course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.Integer, db.ForeignKey('Students.student_id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('Teachers.teacher_id'), nullable=False)
    day_of_week = db.Column(db.String(20), nullable=False)
    schedule = db.Column(db.String(50), nullable=False)
    hours_completed = db.Column(db.Integer, nullable=False)
    hours_pending = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    deleted_at = db.Column(db.DateTime, nullable=True)

# Rutas para Actividades
@app.route('/activities', methods=['POST'])
def create_activity():
    data = request.get_json()
    new_activity = Activity(name=data['name'], total_hours=data['total_hours'])
    db.session.add(new_activity)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Actividad creada'}), 201

@app.route('/activities', methods=['GET'])
def get_activities():
    activities = Activity.query.filter(Activity.deleted_at.is_(None)).all()
    return jsonify([{
        'activity_id': a.activity_id,
        'name': a.name,
        'total_hours': a.total_hours
    } for a in activities]), 200

@app.route('/activities/<int:id>', methods=['PUT'])
def update_activity(id):
    activity = Activity.query.get(id)
    if activity is None:
        return jsonify({'status': 'Error', 'message': 'Actividad no encontrada'}), 404

    data = request.get_json()
    activity.name = data.get('name', activity.name)
    activity.total_hours = data.get('total_hours', activity.total_hours)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Actividad actualizada'}), 200

@app.route('/activities/<int:id>', methods=['DELETE'])
def delete_activity(id):
    activity = Activity.query.get(id)
    if activity is None:
        return jsonify({'status': 'Error', 'message': 'Actividad no encontrada'}), 404

    activity.deleted_at = db.func.current_timestamp()
    db.session.commit()
    return jsonify({'status': 'Success', 'message': 'Actividad eliminada lógicamente'}), 200

# Rutas para Estudiantes
@app.route('/students', methods=['POST'])
def create_student():
    data = request.get_json()
    new_student = Student(
        student_id=data['student_id'],
        full_name=data['full_name'],
        major=data['major'],
        semester=data['semester'],
        age=data['age'],
        complementary_credits=data.get('complementary_credits', 0)
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Estudiante creado'}), 201

@app.route('/students', methods=['GET'])
def get_students():
    students = Student.query.filter(Student.deleted_at.is_(None)).all()
    return jsonify([{
        'student_id': s.student_id,
        'full_name': s.full_name,
        'major': s.major,
        'semester': s.semester,
        'age': s.age,
        'complementary_credits': s.complementary_credits
    } for s in students]), 200

@app.route('/students/<int:id>', methods=['PUT'])
def update_student(id):
    student = Student.query.get(id)
    if student is None:
        return jsonify({'status': 'Error', 'message': 'Estudiante no encontrado'}), 404

    data = request.get_json()
    student.full_name = data.get('full_name', student.full_name)
    student.major = data.get('major', student.major)
    student.semester = data.get('semester', student.semester)
    student.age = data.get('age', student.age)
    student.complementary_credits = data.get('complementary_credits', student.complementary_credits)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Estudiante actualizado'}), 200

@app.route('/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    student = Student.query.get(id)
    if student is None:
        return jsonify({'status': 'Error', 'message': 'Estudiante no encontrado'}), 404

    student.deleted_at = db.func.current_timestamp()
    db.session.commit()
    return jsonify({'status': 'Success', 'message': 'Estudiante eliminado lógicamente'}), 200

# Rutas para Maestros
@app.route('/teachers', methods=['POST'])
def create_teacher():
    data = request.get_json()
    new_teacher = Teacher(
        teacher_id=data['teacher_id'],
        full_name=data['full_name'],
        activity_id=data['activity_id']
    )
    db.session.add(new_teacher)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Maestro creado'}), 201

@app.route('/teachers', methods=['GET'])
def get_teachers():
    teachers = Teacher.query.filter(Teacher.deleted_at.is_(None)).all()
    return jsonify([{
        'teacher_id': t.teacher_id,
        'full_name': t.full_name,
        'activity_id': t.activity_id
    } for t in teachers]), 200

@app.route('/teachers/<int:id>', methods=['PUT'])
def update_teacher(id):
    teacher = Teacher.query.get(id)
    if teacher is None:
        return jsonify({'status': 'Error', 'message': 'Maestro no encontrado'}), 404

    data = request.get_json()
    teacher.full_name = data.get('full_name', teacher.full_name)
    teacher.activity_id = data.get('activity_id', teacher.activity_id)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Maestro actualizado'}), 200

@app.route('/teachers/<int:id>', methods=['DELETE'])
def delete_teacher(id):
    teacher = Teacher.query.get(id)
    if teacher is None:
        return jsonify({'status': 'Error', 'message': 'Maestro no encontrado'}), 404

    teacher.deleted_at = db.func.current_timestamp()
    db.session.commit()
    return jsonify({'status': 'Success', 'message': 'Maestro eliminado lógicamente'}), 200

# Rutas para Clases en Progreso
@app.route('/in_progress', methods=['POST'])
def create_in_progress():
    data = request.get_json()
    new_course = InProgress(
        student_id=data['student_id'],
        teacher_id=data['teacher_id'],
        day_of_week=data['day_of_week'],
        schedule=data['schedule'],
        hours_completed=data['hours_completed'],
        hours_pending=data['hours_pending']
    )
    db.session.add(new_course)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Clase creada'}), 201

@app.route('/in_progress', methods=['GET'])
def get_in_progress():
    courses = InProgress.query.filter(InProgress.deleted_at.is_(None)).all()
    return jsonify([{
        'course_id': c.course_id,
        'student_id': c.student_id,
        'teacher_id': c.teacher_id,
        'day_of_week': c.day_of_week,
        'schedule': c.schedule,
        'hours_completed': c.hours_completed,
        'hours_pending': c.hours_pending
    } for c in courses]), 200

@app.route('/in_progress/<int:id>', methods=['PUT'])
def update_in_progress(id):
    course = InProgress.query.get(id)
    if course is None:
        return jsonify({'status': 'Error', 'message': 'Clase no encontrada'}), 404

    data = request.get_json()
    course.hours_completed = data.get('hours_completed', course.hours_completed)
    course.hours_pending = data.get('hours_pending', course.hours_pending)
    db.session.commit()
    return jsonify({'status': 'Success', 'data': 'Clase actualizada'}), 200

@app.route('/in_progress/<int:id>', methods=['DELETE'])
def delete_in_progress(id):
    course = InProgress.query.get(id)
    if course is None:
        return jsonify({'status': 'Error', 'message': 'Clase no encontrada'}), 404

    course.deleted_at = db.func.current_timestamp()
    db.session.commit()
    return jsonify({'status': 'Success', 'message': 'Clase eliminada lógicamente'}), 200

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/')
def hello_world():
    return 'Bienvenido a mi API "BUSTAMANTE"!'

@app.route('/login')
def hello_world2():
    return 'LOGIN'

@app.route('/test_db')
def test_db_connection():
    try:
        # Query
        result = db.session.execute('SELECT 1').scalar()
        return jsonify({"success": True, "message": "Database connection is working!", "result": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500