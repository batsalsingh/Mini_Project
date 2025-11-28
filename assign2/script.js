const { useState } = React;

// JSON Server base URL (run json-server on this folder's db.json)
const BASE_URL = 'http://localhost:3001/students';

async function apiFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error('Request failed with status ' + res.status);
  }
  return res.json();
}

function App() {
  // All data managed only with useState
  const [students, setStudents] = useState([]);
  const [mode, setMode] = useState('list'); // 'list' | 'add' | 'edit' | 'details'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. READ (Load Students) - only when user clicks the button
  const handleLoadStudents = async () => {
    try {
      const data = await apiFetch(BASE_URL);
      setStudents(data);
    } catch (err) {
      alert('Failed to load students: ' + err.message);
    }
  };

  // 2. CREATE / UPDATE via form
  const handleSaveStudent = async (student) => {
    try {
      if (student.id) {
        // UPDATE (PUT)
        await apiFetch(`${BASE_URL}/${student.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student),
        });
        alert('Student updated. Click "Load Students" to refresh.');
      } else {
        // CREATE (POST)
        await apiFetch(BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student),
        });
        alert('Student added. Click "Load Students" to see it in the list.');
      }
      setMode('list');
      setSelectedStudent(null);
      // Note: we do NOT auto-refresh; user must click "Load Students".
    } catch (err) {
      alert('Failed to save student: ' + err.message);
    }
  };

  // 3. DELETE
  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      alert('Student deleted. Click "Load Students" to refresh the list.');
    } catch (err) {
      alert('Failed to delete student: ' + err.message);
    }
  };

  // 4. Navigation helpers
  const handleAddClick = () => {
    setSelectedStudent(null);
    setMode('add');
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setMode('edit');
  };

  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setMode('details');
  };

  const goBackToList = () => {
    setMode('list');
    setSelectedStudent(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Student Result Management System</h1>
        <p>Manage student Name, Section, Marks and Grade</p>
      </div>

      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${mode === 'list' ? 'active' : ''}`}
            onClick={() => setMode('list')}
          >
            Students
          </button>
        </div>

        <div className="content">
          {mode === 'list' && (
            <StudentList
              students={students}
              onLoad={handleLoadStudents}
              onAdd={handleAddClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteStudent}
              onView={handleViewClick}
            />
          )}

          {(mode === 'add' || mode === 'edit') && (
            <StudentForm
              initialStudent={mode === 'edit' ? selectedStudent : null}
              onSubmit={handleSaveStudent}
              onCancel={goBackToList}
            />
          )}

          {mode === 'details' && (
            <StudentDetails student={selectedStudent} onBack={goBackToList} />
          )}
        </div>
      </div>
    </div>
  );
}

function StudentList({ students, onLoad, onAdd, onEdit, onDelete, onView }) {
  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2>Student Management</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={onLoad}>
            Load Students
          </button>
          <button className="btn-primary" onClick={onAdd}>
            <span>+</span>
            Add Student
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Section</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-state">
                Click "Load Students" to fetch data from JSON Server.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.section}</td>
                <td>{student.marks}</td>
                <td>{student.grade}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-secondary"
                      onClick={() => onView(student)}
                    >
                      View
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => onEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => onDelete(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StudentForm({ initialStudent, onSubmit, onCancel }) {
  const [name, setName] = useState(initialStudent?.name || '');
  const [section, setSection] = useState(initialStudent?.section || '');
  const [marks, setMarks] = useState(
    initialStudent?.marks !== undefined ? String(initialStudent.marks) : '',
  );
  const [grade, setGrade] = useState(initialStudent?.grade || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericMarks = parseInt(marks, 10);
    if (Number.isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) {
      alert('Marks must be a number between 0 and 100');
      return;
    }

    if (!name || !section || !grade) {
      alert('Please fill all fields');
      return;
    }

    onSubmit({
      id: initialStudent?.id,
      name,
      section,
      marks: numericMarks,
      grade,
    });
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Section *</label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Marks (0-100) *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Grade *</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentDetails({ student, onBack }) {
  if (!student) return null;

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="content">
        <h2 style={{ marginBottom: '16px' }}>Student Details</h2>
        <table>
          <tbody>
            <tr>
              <th style={{ width: '150px' }}>Name</th>
              <td>{student.name}</td>
            </tr>
            <tr>
              <th>Section</th>
              <td>{student.section}</td>
            </tr>
            <tr>
              <th>Marks</th>
              <td>{student.marks}</td>
            </tr>
            <tr>
              <th>Grade</th>
              <td>{student.grade}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '16px' }}>
          <button className="btn-secondary" onClick={onBack}>
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
