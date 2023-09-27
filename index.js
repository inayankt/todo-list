import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const port = process.env.API_PORT;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

await mongoose.connect(process.env.DATABASE_URL);

const Schema = mongoose.Schema;

const todoSchema = Schema({
    task: {
        type: String,
        required: [true, "Task not specified!"]
    }
});

const listSchema = Schema({
    name: {
        type: String,
        required: [true, "Category of the task not specified"]
    },
    tasks: [todoSchema]
});

const Todo = mongoose.model("todo", todoSchema);
const List = mongoose.model("list", listSchema);

app.get("/todos/:type", async (req, res) => {
    const listType = req.params.type.toLowerCase();
    try {
        const todoList = await List.findOne({name: listType});
        if(todoList){
            res.status(200).json(todoList.tasks);
        } else {
            const list = new List({
                name: listType,
                tasks: []
            });
            await list.save();
            res.status(200).json([]);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({"error": "Cannot get the ToDo list at the moment."});
    }
});

app.post("/todo/:type", async (req, res) => {
    const listType = req.params.type.toLowerCase();
    const task = req.body.task;
    if(task){
        const todo = new Todo({
            task: task
        });
        try {
            const currList = await List.findOne({name: listType});
            currList.tasks.push(todo);
            currList.save();
            res.status(200).json({"success": `Successfully added '${task}' ToDo in the '${listType}' list.`});
        } catch (err) {
            res.status(500).json({"error": "Cannot add ToDo at the moment."});
        }
    } else {
        res.status(400).json({"error": "Task cannot be empty"});
    }
});

app.delete("/todo/:type/:id", async (req, res) => {
    const deleteId = req.params.id;
    const listType = req.params.type;
    try {
        const currList = await List.findOneAndUpdate({name: listType}, {$pull: {tasks: {_id: deleteId}}});
        const task = currList.tasks.find((task) => { return task._id == deleteId }).task;
        res.status(200).json({"success": `Successfully deleted '${task}' from the '${listType}' ToDo list.`});
    } catch (err) {
        console.log(err);
        res.status(500).json({"error": "Cannot delete ToDo at the moment."});
    }
});

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});