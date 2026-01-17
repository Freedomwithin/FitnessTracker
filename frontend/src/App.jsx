import { useState, useEffect } from 'react';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [totalReps, setTotalReps] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editExercise, setEditExercise] = useState('');
  const [editReps, setEditReps] = useState('');

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts');
      const data = await res.json();
      setWorkouts(data);
      setTotalReps(data.reduce((sum, w) => sum + parseInt(w.reps), 0));
    } catch (e) {
      console.log('Fetch error');
    }
  };

  const addWorkout = async () => {
    if (!exercise || !reps) return;
    try {
      await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise, reps: parseInt(reps) })
      });
      setExercise('');
      setReps('');
      fetchWorkouts();
    } catch (e) {
      console.log('Add error');
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/workouts/${id}`, { method: 'DELETE' });
      fetchWorkouts();
    } catch (e) {
      console.log('Delete error');
    }
  };

  const startEdit = (w) => {
    setEditingId(w.id);
    setEditExercise(w.exercise);
    setEditReps(w.reps);
  };

  const saveEdit = async () => {
    try {
      await fetch(`http://localhost:5000/api/workouts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise: editExercise, reps: parseInt(editReps) })
      });
      setEditingId(null);
      fetchWorkouts();
    } catch (e) {
      console.log('Edit error');
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#1e40af', textAlign: 'center', marginBottom: '30px' }}>Fitness Tracker</h1>
      
      <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
          <input
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Exercise (e.g. Pull-ups)"
            style={{ padding: '12px 16px', border: '2px solid #3b82f6', borderRadius: '8px', fontSize: '16px', flex: 1, minWidth: '200px' }}
          />
          <input
            value={reps}
            type="number"
            placeholder="Reps"
            onChange={(e) => setReps(e.target.value)}
            style={{ padding: '12px 16px', border: '2px solid #10b981', borderRadius: '8px', fontSize: '16px', width: '100px' }}
          />
          <button
            onClick={addWorkout}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Log Workout
          </button>
        </div>
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
          Total Reps: <strong style={{ color: '#1e40af', fontSize: '18px' }}>{totalReps}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {workouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No workouts yet. Log your first one above!</div>
        ) : (
          workouts.map((w) => (
            <div key={w.id} style={{
              padding: '20px',
              background: editingId === w.id ? '#fef3c7' : '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {editingId === w.id ? (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
                  <input
                    value={editExercise}
                    onChange={(e) => setEditExercise(e.target.value)}
                    style={{ padding: '12px', border: '2px solid #f59e0b', borderRadius: '8px', fontSize: '16px', flex: 1, minWidth: '200px' }}
                  />
                  <input
                    value={editReps}
                    type="number"
                    onChange={(e) => setEditReps(e.target.value)}
                    style={{ padding: '12px', border: '2px solid #f59e0b', borderRadius: '8px', fontSize: '16px', width: '100px' }}
                  />
                  <button
                    onClick={saveEdit}
                    style={{
                      padding: '12px 20px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: '12px 20px',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {w.exercise}: <span style={{ color: '#10b981', fontSize: '20px' }}>{w.reps} reps</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                    {w.date}
                  </div>
                </>
              )}
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => startEdit(w)}
                  style={{
                    padding: '6px 12px',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteWorkout(w.id)}
                  style={{
                    padding: '6px 12px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
