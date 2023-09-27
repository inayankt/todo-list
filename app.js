import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = process.env.APP_PORT;

const apiurl = process.env.API_URL;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let dateArr = new Date().toDateString().split(" ");
let date = dateArr[0] + ", " + dateArr[1] + " " + dateArr[2];

app.get("/", (req, res) => {
    res.redirect("/general");
})

app.get("/:type", async (req, res) => {
    const listType = req.params.type;
    try {
        const result = await axios.get(`${apiurl}/todos/${listType}`);
        const content = {
            date: date,
            type: listType[0].toUpperCase() + listType.slice(1).toLowerCase(),
            todoList: result.data
        };
        res.status(200).render("index.ejs", content);
    } catch (err) {
        if(err.response){
            console.log(err.response.data);
            res.status(500).json(err.response.data);
        }
        else{
            res.status(500).json({"error": "Cannot fetch ToDos at the moment."});
        }
    }
});

app.post("/:type/add", async (req, res) => {
    const listType = req.params.type;
    try {
        const result = await axios.post(`${apiurl}/todo/${listType}`, req.body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        console.log(result.data);
        res.status(200).redirect(`/${listType}`);
    } catch (err) {
        if(err.response){
            console.log(err.response.data);
            res.status(500).json(err.response.data);
        }
        else{
            res.status(500).json({"error": "Cannot add ToDo at the moment."});
        }
    }
});

app.post("/:type/delete", async (req, res) => {
    const listType = req.params.type;
    try {
        const result = await axios.delete(`${apiurl}/todo/${listType}/${req.body.deleteId}`);
        console.log(result.data);
        res.status(200).redirect(`/${listType}`);
    } catch (err) {
        if(err.response){
            console.log(err.response.data);
            res.status(500).json(err.response.data);
        } else {
            res.status(500).json({"error": "Cannot delete ToDo ata the moment"});
        }
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});