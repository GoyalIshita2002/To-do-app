const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ message: 'Error fetching todos', error: err }));
});

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const task = req.body.task;

  console.log(`Updating todo with ID: ${id}, New Task: ${task}`);

  TodoModel.findByIdAndUpdate(id, { task: task }, { new: true })
      .then(result => {
          if (!result) {
              return res.status(404).json({ message: 'Todo not found' });
          }
          res.json(result);
      })
      .catch(err => {
          console.error('Error updating todo:', err);
          res.status(500).json({ message: 'Error updating todo', error: err });
      });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id; 

    TodoModel.findByIdAndDelete(id) 
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.json({ message: 'Todo deleted successfully' });
        })
        .catch(err => res.status(500).json({ message: 'Error deleting todo', error: err }));
});

app.post('/add', (req, res) => {
    const task = req.body.task;
    TodoModel.create({ task: task })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ message: 'Error adding todo', error: err }));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});