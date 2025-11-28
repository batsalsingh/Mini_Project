import React from 'react';

function StudentList({ students, onLoad, onAdd, onEdit, onDelete, onView, loading }) {
  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2>Student Management</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={onLoad}
            disabled={loading}
            style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            {loading ? 'Loading...' : 'Load Students'}
          </button>
          <button className="btn-primary" onClick={onAdd}>
            <span>+</span>
            Add New Student
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Section</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-state">
                No students found. Click "Load Students" or add a new one.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.section || '-'}</td>
                <td>{student.enrollmentDate || '-'}</td>
                <td>
                  <div className="actions">
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

export default StudentList;
