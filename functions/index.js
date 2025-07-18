const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

let data = [
  { id: 1, name: "Vaibhav", age: 21 },
  { id: 2, name: "Omkar", age: 22 },
  { id: 3, name: "Chaitanya", age: 20 }
];

const router = express.Router();

// Root Route
router.get('/', (req, res) => {
  res.json(data);
});

// Get Student by ID
router.get('/:id', (req, res) => {
  const id = +req.params.id;
  const student = data.find(s => s.id === id);
  if (!student) return res.status(404).send('Student not found');
  res.json(student);
});

// Add new student (memory only)
router.post('/', (req, res) => {
  const newStudent = req.body;
  newStudent.id = Date.now(); // generate ID
  data.push(newStudent);
  res.send('Student added (memory only)');
});

// Update student by ID
router.patch('/:id', (req, res) => {
  const id = +req.params.id;
  const student = data.find(s => s.id === id);
  if (!student) return res.status(404).send('Invalid ID');
  Object.assign(student, req.body);
  res.send('Student updated (memory only)');
});

// Delete student
router.delete('/:id', (req, res) => {
  const id = +req.params.id;
  const index = data.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).send('Invalid ID');
  data.splice(index, 1);
  res.send('Student deleted (memory only)');
});

// Use path for Netlify
app.use('/.netlify/functions/index', router);

module.exports.handler = serverless(app);
