const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let data = [];
try {
  const filePath = path.join(__dirname, 'students.json');
  data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
} catch (err) {
  console.error('Error loading students.json:', err);
  data = [];
}

// 👇 Important: Base path should be handled correctly
const router = express.Router();

router.get('/', (req, res) => {
  res.json("server is started.....");
});

router.get('/:id', (req, res) => {
  const id = +req.params.id;
  const student = data.find(s => s.id === id);
  if (!student) return res.status(404).send('Student not found');
  res.json(student);
});

router.post('/', (req, res) => {
  const newStudent = req.body;
  newStudent.id = Date.now();
  data.push(newStudent);
  res.send('Student added (temporarily in memory)');
});

router.delete('/:id', (req, res) => {
  const id = +req.params.id;
  const index = data.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).send('Invalid ID');
  data.splice(index, 1);
  res.send('Student deleted (temporarily)');
});

router.patch('/:id', (req, res) => {
  const id = +req.params.id;
  const updates = req.body;
  const student = data.find(s => s.id === id);
  if (!student) return res.status(404).send('Invalid ID');
  Object.assign(student, updates);
  res.send('Student updated (temporarily)');
});

// 👇 Use router under specific path
app.use('/.netlify/functions/index', router);

module.exports.handler = serverless(app);
