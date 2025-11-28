import React from 'react';

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

export default StudentDetails;
