import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const apiurl = "http://localhost:4000";

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const days = {
    "Sun": "Sunday",
    "Mon": "Monday",
    "Tue": "Tuesday",
    "Thur": "Thursday",
    "Fri": "Friday",
    "Sat": "Saturday"
};

const months = {
    "Jan": "January",
    "Feb": "February",
    "Mar": "March",
    "Apr": "April",
    "May": "May",
    "Jun": "June",
    "Jul": "July",
    "Aug": "August",
    "Sep": "September",
    "Oct": "October",
    "Nov": "November",
    "Dec": "December"
};

let dateArr = new Date().toDateString().split(" ");
let date = dateArr[0] + ", " + dateArr[1] + " " + dateArr[2];
// let date = days[dateArr[0]] + ", " + months[dateArr[1]] + " " + dateArr[2];

app.get("/", (req, res) => {
    res.redirect("/all");
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