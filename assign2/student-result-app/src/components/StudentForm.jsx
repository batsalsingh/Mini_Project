import React, { useState } from 'react';

function StudentForm({ initialStudent, onSubmit, onCancel }) {
  const [name, setName] = useState(initialStudent?.name || '');
  const [email, setEmail] = useState(initialStudent?.email || '');
  const [section, setSection] = useState(initialStudent?.section || '');
  const [enrollmentDate, setEnrollmentDate] = useState(
    initialStudent?.enrollmentDate || '',
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Name and Email are required');
      return;
    }

    onSubmit({
      id: initialStudent?.id,
      name,
      email,
      section,
      enrollmentDate,
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
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Section</label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Enrollment Date</label>
            <input
              type="date"
              value={enrollmentDate}
              onChange={(e) => setEnrollmentDate(e.target.value)}
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

export default StudentForm;
