const BASE_STUDENTS_URL = 'http://localhost:3001/students';
const BASE_SECTIONS_URL = 'http://localhost:3001/sections';
const BASE_RESULTS_URL = 'http://localhost:3001/results';

// ---------- STUDENTS ----------

export async function fetchStudents() {
  const res = await fetch(BASE_STUDENTS_URL);
  if (!res.ok) throw new Error('Failed to load students');
  return res.json();
}

export async function createStudent(student) {
  const res = await fetch(BASE_STUDENTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error('Failed to add student');
  return res.json();
}

export async function updateStudent(id, student) {
  const res = await fetch(`${BASE_STUDENTS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error('Failed to update student');
  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE_STUDENTS_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete student');
  return true;
}

// ---------- SECTIONS ----------

export async function fetchSections() {
  const res = await fetch(BASE_SECTIONS_URL);
  if (!res.ok) throw new Error('Failed to load sections');
  return res.json();
}

export async function createSection(section) {
  const res = await fetch(BASE_SECTIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(section),
  });
  if (!res.ok) throw new Error('Failed to add section');
  return res.json();
}

export async function updateSection(id, section) {
  const res = await fetch(`${BASE_SECTIONS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(section),
  });
  if (!res.ok) throw new Error('Failed to update section');
  return res.json();
}

export async function deleteSection(id) {
  const res = await fetch(`${BASE_SECTIONS_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete section');
  return true;
}

// ---------- RESULTS ----------

export async function fetchResults() {
  const res = await fetch(BASE_RESULTS_URL);
  if (!res.ok) throw new Error('Failed to load results');
  return res.json();
}

export async function createResult(result) {
  const res = await fetch(BASE_RESULTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  if (!res.ok) throw new Error('Failed to add result');
  return res.json();
}

export async function updateResult(id, result) {
  const res = await fetch(`${BASE_RESULTS_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  if (!res.ok) throw new Error('Failed to update result');
  return res.json();
}

export async function deleteResult(id) {
  const res = await fetch(`${BASE_RESULTS_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete result');
  return true;
}
