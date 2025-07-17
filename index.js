const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Read students.json file (read-only)
let data = [];
try {
  const filePath = path.join(__dirname, 'students.json');
  data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (err) {
  console.error('Error loading students.json:', err);
  data = []; // fallback to empty array
}

// Get all students
app.get('/', (req, res) => {
  res.json(data);
});

// Get one student by ID
app.get('/:id', (req, res) => {
  const id = +req.params.id;
  const student = data.find(s => s.id === id);
  if (!student) return res.status(404).send('Student not found');
  res.json(student);
});

// Add new student (memory only)
app.post('/', (req, res) => {
  const newStudent = req.body;
  newStudent.id = Date.now(); // auto-generated ID
  data.push(newStudent);
  res.send('Student added (temporarily in memory)');
});

// Delete student by ID (memory only)
app.delete('/:id', (req, res) => {
  const id = +req.params.id;
  const index = data.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).send('Invalid ID');
  data.splice(index, 1);
  res.send('Student deleted (temporarily)');
});

// Update student (memory only)
app.patch('/:id', (req, res) => {
  const id = +req.params.id;
  const updates = req.body;
  const student = data.find(s => s.id === id);
  if (!student) return res.status(404).send('Invalid ID');
  Object.assign(student, updates);
  res.send('Student updated (temporarily)');
});

// ✅ Export for Vercel
module.exports.handler = serverless(app);
