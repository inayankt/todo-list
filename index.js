import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const todo = [
    "Hi",
    "I am feeling",
    "Lucky",
    "Very much"
];

app.get("/todos", (req, res) => {
    res.json(todo);
});

app.post("/todo", (req, res) => {
    const task = req.body.task;
    if(task){
        todo.push(task);
        res.status(200).json({"success": `Successfully added '${task}' ToDo in the list.`});
    } else {
        res.status(400).json({"error": "Task cannot be empty"});
    }
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});