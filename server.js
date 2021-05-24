const pg = require("pg");
const express = require("express");
const app = express();

const port = 3000;
const hostname = "localhost";

const env = require("../env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.use(express.json());
app.use(express.static("public_html"));

app.post("/add", function(req, res) {
    let data = req.body;
    if (!ownProperty(data)) {
        res.status(400);
        res.json({"error": "bad request"});
    }
    else if (!Number.isFinite(data.height)) {
        res.status(400);
        res.json({"error": "invalid height"});
    }
    else if (!Number.isFinite(data.weight)) {
        res.status(400);
        res.json({"error": "invalid weight"});
    }
    else if (!Number.isFinite(data.bmi)) {
        res.status(400);
        res.json({"error": "invalid BMI"});
    }
    else if (!Number.isInteger(data.age)) {
        res.status(400);
        res.json({"error": "invalid age"});
    }
    else if (!Number.isFinite(data.runningGoal)) {
        res.status(400);
        res.json({"error": "invalid running goal"});
    }
    else {

        pool.query("DELETE FROM info WHERE username = $1", [data.username]);
        pool.query("DELETE FROM progress WHERE username = $1", [data.username]);

        pool.query(
            "INSERT INTO info(username, height, weight, bmi, public, runninggoal, achieved, age) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [data.username, data.height, data.weight, data.bmi, data.public, data.runningGoal, "no", data.age]
        ).then(function(response) {
            res.status(200);
            res.send();
        }).catch(function(error) {
            res.status(500);
            res.json({"error": error});
        });
    }

});

app.post("/updateprogress", function(req, res) {
    let data = req.body;
    if (!data.hasOwnProperty("username") || !data.hasOwnProperty("runningProgress")) {
        res.status(400);
        res.json({"error": "bad request"});
    }
    else if (!Number.isFinite(data.runningProgress)) {
        res.status(400);
        res.json({"error": "invalid running progress"});
    }
    else {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        let date = mm+'/'+dd+'/'+yyyy;

        pool.query("INSERT INTO progress(username, progress, date) VALUES($1,$2,$3) RETURNING *",
        [data.username, data.runningProgress, date]);

        res.status(200);
        res.send();
    }
})

app.get("/searchinfo", function(req, res) {
    let username = req.query.username;

    pool.query("SELECT * FROM info WHERE username = $1", [username]).then(function(response) {
        let info = response.rows;

        if (info[0] === undefined) {
            res.status(400);
            res.json({"error": "username does not exist"});
        }
        else if (!info[0].public) {
            console.log("Private information");
            res.status(500);
            res.json({"error": "No permission. The infomation is set to private."});
        } else {
            res.status(200);
            res.json({"info": info});
        }
    });

});

app.get("/searchprogress", function(req, res) {
    let username = req.query.username;

    pool.query("SELECT * FROM progress WHERE username = $1", [username]).then(function(response) {
        res.status(200);
        res.json({"progress": response.rows});
    });
});

function ownProperty(data) {
    let propertyList = [
        "username",
        "age",
        "height",
        "weight",
        "bmi",
        "public",
        "runningGoal"
    ]
    for (let property of propertyList) {
        if (!data.hasOwnProperty(property)) {
            return false;
        }
    }
    return true;
}

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});
