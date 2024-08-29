import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';

function Home() {
    const [todos, setTodos] = useState([]);
    const [editingTodo, setEditingTodo] = useState(null);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id)))
            .catch(err => console.log(err));
    };

    const handleEdit = (id) => {
        const todo = todos.find(todo => todo._id === id);
        if (todo) {
            setEditingTodo(todo);
            setNewTask(todo.task); 
        } else {
            console.error(`Todo with ID ${id} not found.`);
        }
    };

    const handleUpdate = () => {
        if (editingTodo) {
            const updatedTodo = { ...editingTodo, task: newTask };
            axios.put(`http://localhost:3001/update/${editingTodo._id}`, updatedTodo)
                .then(() => {
                    setTodos(prevTodos => prevTodos.map(todo => todo._id === editingTodo._id ? updatedTodo : todo));
                    setEditingTodo(null);
                    setNewTask('');
                })
                .catch(err => console.log(err));
        } else {
            console.error("No todo is being edited.");
        }
    };

    const handleCheckboxChange = (id) => {
        const todo = todos.find(todo => todo._id === id);
        if (todo) {
            const updatedTodo = { ...todo, done: !todo.done };
            axios.put(`http://localhost:3001/update/${id}`, updatedTodo)
                .then(() => {
                    setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? updatedTodo : todo));
                })
                .catch(err => console.log(err));
        }
    };

    const handleTaskAdded = (newTodo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
    };

    return (
        <div className="home">
    <h2>To-Do List</h2>
    <Create onTaskAdded={handleTaskAdded} />
    <div className="todos-container">
        {todos.length === 0 ? (
            <div className="no-record"><h2>No record</h2></div>
        ) : (
            todos.map((todo) => (
                <div key={todo._id} className="todo-item">
                    <div className="checkbox-container">
                        <input 
                            type="checkbox" 
                            checked={todo.done} 
                            onChange={() => handleCheckboxChange(todo._id)} 
                        />
                        <p style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                            {todo.task}
                        </p>
                    </div>
                    <button className="edit-button" onClick={() => handleEdit(todo._id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(todo._id)}>Delete</button>
                </div>
            ))
        )}
    </div>
    {editingTodo && (
        <div>
            <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
            />
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setEditingTodo(null)}>Cancel</button>
        </div>
    )}
</div>
    );
}

export default Home;
