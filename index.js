const express = require('express');
const fs = require('fs');
const serverless = require('serverless-http');

const app = express();

let data = JSON.parse(fs.readFileSync('students.json', 'utf-8'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json(data);
});

app.get('/:id', (req, res) => {
  const id = +req.params.id;
  const stud = data.find((s) => s.id === id);
  res.json(stud);
});

app.delete('/:id', (req, res) => {
  const id = +req.params.id;
  const index = data.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.send('invalid id');
  }
  data.splice(index, 1);
  fs.writeFileSync('students.json', JSON.stringify(data));
  res.send('data deleted');
});

app.post('/', (req, res) => {
  const stud = req.body;
  data.push(stud);
  fs.writeFileSync('students.json', JSON.stringify(data));
  res.send('data saved');
});

app.patch('/:id', (req, res) => {
  const id = +req.params.id;
  const update = req.body;
  const stud = data.find((s) => s.id === id);
  if (!stud) {
    return res.json('invalid id');
  }
  Object.assign(stud, update);
  fs.writeFileSync('students.json', JSON.stringify(data));
  res.json('data updated');
});

// ✅ Export for Vercel
module.exports.handler = serverless(app);
