        const express = require('express')
        const cors = require('cors')
        const app = express();
        const mysql = require('mysql2')

        app.use(express.json())
        app.use(cors())  // cross origin resource sharing

        require('dotenv').config();

        const db = mysql.createConnection({
            host: process.env.DB_HOST,       // Uses DB_HOST from .env
            user: process.env.DB_USER,       // Uses DB_USER from .env
            password: process.env.DB_PASSWORD, // Uses DB_PASSWORD from .env
            database: process.env.DB_NAME    // Uses DB_NAME from .env
        });        

        db.connect((err) => {
        if (!err) {
            console.log("Connected to database");
        } else {
            console.log('failed to connect');
        }
        })

        app.post('/new-task', (req, res) => {
            console.log(req.body);
            const q = 'INSERT INTO todos (task, createdAt, status) VALUES (?, ?, ?)';
            db.query(q, [req.body.task, new Date(), 'Active'], (err, result) => {
                if (err) {
                    console.error("Failed to store task:", err);
                    res.status(500).send("Error storing task");
                } else {
                    console.log("Task saved successfully");
                    const updatedTasks = 'SELECT * FROM todos';
                    db.query(updatedTasks, (error, newList) => {
                        if (error) {
                            console.error("Failed to fetch updated tasks:", error);
                            res.status(500).send("Error fetching updated tasks");
                        } else {
                            res.send(newList); // Send updated task list
                        }
                    });
                }
            });
        });
        
        app.put('/edit-task/:id', (req, res) => {
            const taskId = req.params.id;
            const newTask = req.body.task;
        
            const q = 'UPDATE todos SET task = ? WHERE id = ?';
            db.query(q, [newTask, taskId], (err, result) => {
                if (err) {
                    console.error("Failed to update task:", err);
                    res.status(500).send("Error updating task");
                } else {
                    console.log("Task updated successfully");
                    res.send("Task updated");
                }
            });
        });
        
        // Example in Express.js (backend)
        app.delete('/delete-task/:id', (req, res) => {
            const taskId = req.params.id;
            const q = 'DELETE FROM todos WHERE id = ?'; // SQL query to delete the task
            
            db.query(q, [taskId], (err, result) => {
                if (err) {
                    console.error("Failed to delete task:", err);
                    res.status(500).send("Error deleting task");
                } else {
                    console.log("Task deleted successfully");
                    res.send("Task deleted");
                }
            });
        });
        
        app.put('/complete-task/:id', (req, res) => {
            const taskId = req.params.id;
            const q = 'UPDATE todos SET status = ? WHERE id = ?';
        
            db.query(q, ['completed', taskId], (err, result) => {
                if (err) {
                    console.error("Failed to mark task as completed:", err);
                    res.status(500).send("Error completing task");
                } else {
                    console.log("Task marked as completed");
                    res.send("Task completed");
                }
            });
        });
        
  

        app.get('/read-tasks', (req, res) => {
        const q = 'select * from todos';
        db.query(q, (err, result) => {
            if (err){
                console.log("fauled to read");

            }
            else{
                console.log("retrieved succesfully");
                res.send(result);
                console.log(result);
            }
        })
        })

        app.listen(5001, () => {console.log('server started'); // port 5001
        // to check port, do lsof -i: 5001  ; kill -9 <PID>
        })
