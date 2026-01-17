from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workouts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise = db.Column(db.String(100), nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/api/workouts', methods=['GET', 'POST'])
def handle_workouts():
    if request.method == 'POST':
        data = request.json
        workout = Workout(exercise=data['exercise'], reps=data['reps'])
        db.session.add(workout)
        db.session.commit()
        return jsonify({'id': workout.id}), 201
    
    workouts = Workout.query.order_by(Workout.date_added.desc()).all()
    return jsonify([{
        'id': w.id, 'exercise': w.exercise, 'reps': w.reps, 
        'date': w.date_added.strftime('%Y-%m-%d %H:%M')
    } for w in workouts])

@app.route('/api/workouts/<int:workout_id>', methods=['PUT'])
def update_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    data = request.json
    workout.exercise = data['exercise']
    workout.reps = data['reps']
    db.session.commit()
    return jsonify({
        'id': workout.id, 
        'exercise': workout.exercise, 
        'reps': workout.reps,
        'date': workout.date_added.strftime('%Y-%m-%d %H:%M')
    })

@app.route('/api/workouts/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    db.session.delete(workout)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
