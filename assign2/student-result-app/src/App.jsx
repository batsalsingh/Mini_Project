import React, { useState } from 'react';
import StudentList from './components/StudentList.jsx';
import StudentForm from './components/StudentForm.jsx';
import StudentDetails from './components/StudentDetails.jsx';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchSections,
  createSection,
  updateSection,
  deleteSection,
  fetchResults,
  createResult,
  updateResult,
  deleteResult,
} from './services/studentService.js';

// activeTab: 'students' | 'sections' | 'results'
// modal: { type: 'student' | 'section' | 'result', item?: any } | null

function App() {
  const [activeTab, setActiveTab] = useState('students');

  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [results, setResults] = useState([]);

  const [studentLoading, setStudentLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);

  const [notification, setNotification] = useState(null); // { type: 'success'|'error', message }
  const [modal, setModal] = useState(null);

  const [studentFilter, setStudentFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  // ---------- helpers ----------
  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const closeNotification = () => setNotification(null);

  const openModal = (type, item = null) => setModal({ type, item });
  const closeModal = () => setModal(null);

  const getStudentName = (studentId) => {
    const s = students.find((st) => st.id === studentId);
    return s ? s.name : 'Unknown';
  };

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'A+':
        return 'grade-a-plus';
      case 'A':
        return 'grade-a';
      case 'B':
        return 'grade-b';
      case 'C':
        return 'grade-c';
      case 'D':
        return 'grade-d';
      case 'F':
        return 'grade-f';
      default:
        return '';
    }
  };

  const getSectionStudentCount = (sectionName) =>
    students.filter((s) => s.section === sectionName).length;

  // ---------- LOAD BUTTON HANDLERS (no useEffect) ----------
  const handleLoadStudents = async () => {
    try {
      setStudentLoading(true);
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      showNotification('error', err.message || 'Failed to load students');
    } finally {
      setStudentLoading(false);
    }
  };

  const handleLoadSections = async () => {
    try {
      setSectionLoading(true);
      const data = await fetchSections();
      setSections(data);
    } catch (err) {
      showNotification('error', err.message || 'Failed to load sections');
    } finally {
      setSectionLoading(false);
    }
  };

  const handleLoadResults = async () => {
    try {
      setResultLoading(true);
      const data = await fetchResults();
      setResults(data);
    } catch (err) {
      showNotification('error', err.message || 'Failed to load results');
    } finally {
      setResultLoading(false);
    }
  };

  // ---------- CRUD handlers ----------
  const handleStudentSubmit = async (student) => {
    try {
      if (student.id) {
        const updated = await updateStudent(student.id, student);
        // update local state so user does not have to click Load Students
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        showNotification('success', 'Student updated successfully.');
      } else {
        const created = await createStudent(student);
        setStudents((prev) => [...prev, created]);
        showNotification('success', 'Student created successfully.');
      }
      closeModal();
    } catch (err) {
      showNotification('error', err.message || 'Failed to save student');
    }
  };

  const handleSectionSubmit = async (section) => {
    try {
      if (section.id) {
        const updated = await updateSection(section.id, section);
        setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        showNotification('success', 'Section updated successfully.');
      } else {
        const created = await createSection(section);
        setSections((prev) => [...prev, created]);
        showNotification('success', 'Section created successfully.');
      }
      closeModal();
    } catch (err) {
      showNotification('error', err.message || 'Failed to save section');
    }
  };

  const handleResultSubmit = async (result) => {
    try {
      if (result.id) {
        const updated = await updateResult(result.id, result);
        setResults((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        showNotification('success', 'Result updated successfully.');
      } else {
        const created = await createResult(result);
        setResults((prev) => [...prev, created]);
        showNotification('success', 'Result created successfully.');
      }
      closeModal();
    } catch (err) {
      showNotification('error', err.message || 'Failed to save result');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      if (type === 'student') {
        await deleteStudent(id);
        setStudents((prev) => prev.filter((s) => s.id !== id));
        showNotification('success', 'Student deleted successfully.');
      } else if (type === 'section') {
        await deleteSection(id);
        setSections((prev) => prev.filter((s) => s.id !== id));
        showNotification('success', 'Section deleted successfully.');
      } else if (type === 'result') {
        await deleteResult(id);
        setResults((prev) => prev.filter((r) => r.id !== id));
        showNotification('success', 'Result deleted successfully.');
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete item');
    }
  };

  // ---------- derived values (plain JS, no useMemo) ----------
  const uniqueResultStudentIds = Array.from(
    new Set(results.map((r) => r.studentId)),
  );
  const uniqueSubjects = Array.from(new Set(results.map((r) => r.subject)));

  const filteredResults = results.filter((r) => {
    const matchStudent = !studentFilter || r.studentId === Number(studentFilter);
    const matchSubject = !subjectFilter || r.subject === subjectFilter;
    return matchStudent && matchSubject;
  });

  return (
    <div className="container">
      <div className="header">
        <h1>Student Result Management System</h1>
        <p>Manage students, sections, and academic results</p>
      </div>

      <div className="card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={`tab ${activeTab === 'sections' ? 'active' : ''}`}
            onClick={() => setActiveTab('sections')}
          >
            Sections
          </button>
          <button
            className={`tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Results
          </button>
        </div>

        <div className="content">
          {activeTab === 'students' && (
            <StudentList
              students={students}
              onLoad={handleLoadStudents}
              onAdd={() => openModal('student')}
              onEdit={(student) => openModal('student', student)}
              onDelete={(id) => handleDelete('student', id)}
              onView={(student) => setModal({ type: 'details', item: student })}
              loading={studentLoading}
            />
          )}

          {activeTab === 'sections' && (
            <SectionsTab
              sections={sections}
              getSectionStudentCount={getSectionStudentCount}
              onLoad={handleLoadSections}
              onAdd={() => openModal('section')}
              onEdit={(section) => openModal('section', section)}
              onDelete={(id) => handleDelete('section', id)}
              loading={sectionLoading}
            />
          )}

          {activeTab === 'results' && (
            <ResultsTab
              results={filteredResults}
              students={students}
              uniqueResultStudentIds={uniqueResultStudentIds}
              uniqueSubjects={uniqueSubjects}
              studentFilter={studentFilter}
              subjectFilter={subjectFilter}
              setStudentFilter={setStudentFilter}
              setSubjectFilter={setSubjectFilter}
              getStudentName={getStudentName}
              getGradeClass={getGradeClass}
              onLoad={handleLoadResults}
              onAdd={() => openModal('result')}
              onEdit={(result) => openModal('result', result)}
              onDelete={(id) => handleDelete('result', id)}
              loading={resultLoading}
            />
          )}
        </div>
      </div>

      {notification && (
        <div
          className={`notification ${notification.type}`}
          onClick={closeNotification}
          style={{ cursor: 'pointer', marginTop: '16px' }}
        >
          {notification.message}
        </div>
      )}

      {modal && (
        <Modal
          modal={modal}
          sections={sections}
          students={students}
          onClose={closeModal}
          onStudentSubmit={handleStudentSubmit}
          onSectionSubmit={handleSectionSubmit}
          onResultSubmit={handleResultSubmit}
        />
      )}
    </div>
  );
}

// ---------- Additional Tab Components ----------

function SectionsTab({
  sections,
  getSectionStudentCount,
  onLoad,
  onAdd,
  onEdit,
  onDelete,
  loading,
}) {
  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2>Section Management</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={onLoad}
            disabled={loading}
            style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            {loading ? 'Loading...' : 'Load Sections'}
          </button>
          <button className="btn-primary" onClick={onAdd}>
            <span>+</span>
            Add New Section
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Total Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-state">
                No sections found. Click "Load Sections" or add a new one.
              </td>
            </tr>
          ) : (
            sections.map((section) => (
              <tr key={section.id}>
                <td>{section.name}</td>
                <td>{section.description}</td>
                <td>{getSectionStudentCount(section.name)}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-secondary"
                      onClick={() => onEdit(section)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => onDelete(section.id)}
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

function ResultsTab({
  results,
  students,
  uniqueResultStudentIds,
  uniqueSubjects,
  studentFilter,
  subjectFilter,
  setStudentFilter,
  setSubjectFilter,
  getStudentName,
  getGradeClass,
  onLoad,
  onAdd,
  onEdit,
  onDelete,
  loading,
}) {
  return (
    <div className="tab-content active">
      <div className="section-header">
        <h2>Result Management</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-secondary"
            onClick={onLoad}
            disabled={loading}
            style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            {loading ? 'Loading...' : 'Load Results'}
          </button>
          <button className="btn-primary" onClick={onAdd}>
            <span>+</span>
            Add New Result
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
          >
            <option value="">All Students</option>
            {uniqueResultStudentIds.map((id) => (
              <option key={id} value={id}>
                {getStudentName(id)}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Exam Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-state">
                No results found. Click "Load Results" or add a new one.
              </td>
            </tr>
          ) : (
            results.map((result) => (
              <tr key={result.id}>
                <td>{getStudentName(result.studentId)}</td>
                <td>{result.subject}</td>
                <td>{result.marks}</td>
                <td>
                  <span className={`grade-badge ${getGradeClass(result.grade)}`}>
                    {result.grade}
                  </span>
                </td>
                <td>{result.examDate || '-'}</td>
                <td>
                  <div className="actions">
                    <button
                      className="btn-secondary"
                      onClick={() => onEdit(result)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => onDelete(result.id)}
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

// ---------- Modal + Forms ----------

function Modal({
  modal,
  sections,
  students,
  onClose,
  onStudentSubmit,
  onSectionSubmit,
  onResultSubmit,
}) {
  const { type, item } = modal;

  let title = '';
  if (type === 'student') title = item ? 'Edit Student' : 'Add New Student';
  if (type === 'section') title = item ? 'Edit Section' : 'Add New Section';
  if (type === 'result') title = item ? 'Edit Result' : 'Add New Result';
  if (type === 'details') title = 'Student Details';

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {type === 'student' && (
            <StudentForm
              initialStudent={item}
              onSubmit={onStudentSubmit}
              onCancel={onClose}
            />
          )}

          {type === 'section' && (
            <SectionForm
              initialSection={item}
              onSubmit={onSectionSubmit}
              onCancel={onClose}
            />
          )}

          {type === 'result' && (
            <ResultForm
              initialResult={item}
              students={students}
              onSubmit={onResultSubmit}
              onCancel={onClose}
            />
          )}

          {type === 'details' && (
            <StudentDetails student={item} onBack={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionForm({ initialSection, onSubmit, onCancel }) {
  const [name, setName] = useState(initialSection?.name || '');
  const [description, setDescription] = useState(
    initialSection?.description || '',
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    onSubmit({ id: initialSection?.id, name, description });
  };

  return (
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
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialSection ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

function ResultForm({ initialResult, students, onSubmit, onCancel }) {
  const [studentId, setStudentId] = useState(
    initialResult?.studentId ? String(initialResult.studentId) : '',
  );
  const [subject, setSubject] = useState(initialResult?.subject || '');
  const [marks, setMarks] = useState(
    initialResult?.marks !== undefined ? String(initialResult.marks) : '',
  );
  const [examDate, setExamDate] = useState(initialResult?.examDate || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const numMarks = Number(marks);
    if (Number.isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
      setError('Marks must be between 0 and 100');
      return;
    }
    if (!studentId || !subject.trim()) {
      setError('Student and Subject are required');
      return;
    }

    setError('');

    let grade = 'F';
    if (numMarks >= 90) grade = 'A+';
    else if (numMarks >= 80) grade = 'A';
    else if (numMarks >= 70) grade = 'B';
    else if (numMarks >= 60) grade = 'C';
    else if (numMarks >= 50) grade = 'D';

    onSubmit({
      id: initialResult?.id,
      studentId: Number(studentId),
      subject,
      marks: numMarks,
      grade,
      examDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Student *</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Subject *</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
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
        <label>Exam Date</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />
      </div>

      {error && (
        <p style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{error}</p>
      )}

      <div className="modal-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {initialResult ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default App;
