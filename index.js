import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const db = new pg.Client({
    hostname: "localhost",
    port: "5432",
    username: "postgres",
    password: "postgre2022",
    database: "udemy"
});

db.connect();

let flagsList = [];

db.query("SELECT * from flags", (err, result)=>{
    if(err){
        throw err;
    } else {
        flagsList = result.rows;
    }
    db.end();
});
var current_score = 0;
var currentFlag = {};
app.get("/", (req,res)=>{
    res.render("index.ejs", {current_flag: currentflagMapper(),currentScore: current_score });
});

app.post("/submit", (req,res)=>{
    const flag_name = req.body.flagName;
    if(flag_name.toLowerCase() === currentFlag.name.toLowerCase()) {
        current_score++;
        res.render("index.ejs", {current_flag: currentflagMapper(),currentScore: current_score, isCorrect: true});
    } else {
        current_score = 0;
        res.render("index.ejs", {current_flag: currentflagMapper(),currentScore: current_score, isCorrect: false });
    }
});

function currentflagMapper() {
    const value = Math.floor(Math.random() * flagsList.length);
    currentFlag = flagsList[value];
    console.log(currentFlag);
    return flagsList[value].flag;
}

app.listen(port, ()=>{
    console.log(`Server has been started at the port: ${port}`);
});