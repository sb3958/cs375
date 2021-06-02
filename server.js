const pg = require("pg");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const port = 3000;
const hostname = "localhost";

const env = require("../env.json");
const { response } = require("express");
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
    else if (!isFinite(data.height) || data.height <= 0) {
        res.status(400);
        res.json({"error": "invalid height"});
    }
    else if (!isFinite(data.weight) || data.weight <= 0) {
        res.status(400);
        res.json({"error": "invalid weight"});
    }
    else if (!isFinite(data.age) || data.weight <= 0) {
        res.status(400);
        res.json({"error": "invalid age"});
    }
    else if (!isFinite(data.runningGoal) || data.runningGoal <= 0) {
        res.status(400);
        res.json({"error": "invalid running goal"});
    }
    else {

        let bmi = getBMI(data.weight, data.height);
        pool.query("DELETE FROM info WHERE username = $1", [data.username]);
        pool.query("DELETE FROM progress WHERE username = $1", [data.username]);

        pool.query(
            "INSERT INTO info(username, height, weight, bmi, public, runninggoal, achieved, age) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [data.username, parseFloat(data.height), parseFloat(data.weight), bmi, data.public, parseFloat(data.runningGoal), "no", parseInt(data.age)]
        ).then(function(response) {
            res.status(200);
            res.send();
        }).catch(function(error) {
            res.status(500);
            res.json({"error": error});
        });
    }
});

function getBMI(w,h) {
    let weight = parseFloat(w);
    let height = parseFloat(h);
    return weight / ((height/100.0)*(height/100.0));
}

function updateBMI(w,h,username) {
    let bmi = getBMI(w, h);
    pool.query("UPDATE info SET bmi = $1 WHERE username = $2", [bmi, username]);
}

function convertToNumber(input) {
    let convertedInput
    convertedInput = parseFloat(input);
    return convertedInput;
}

app.post("/updateinfo", function(req, res){
    let data = req.body;
    let cat = data.category;
    let username = data.username;
    let input;
    if (!data.hasOwnProperty("username") || !data.hasOwnProperty("category") || !data.hasOwnProperty("content") || cat === "") {
        res.status(400);
        res.json({"error": "bad request"});
    } else if (cat === "height" || cat === "weight") {
        input = convertToNumber(data.content);
        if (input === "NaN" || input <= 0) {
            res.status(400);
            res.json({"error": "invalid input"})
        }
        else {
            if (cat === "height") {
                pool.query("SELECT * FROM info WHERE username = $1", [data.username]).then(function(response){
                    updateBMI(response.rows[0].weight, input, data.username);
                });
                pool.query("UPDATE info SET height = $1 WHERE username = $2", [input, username]);
            } else {
                pool.query("SELECT * FROM info WHERE username = $1", [data.username]).then(function(response){
                    updateBMI(input, response.rows[0].height, data.username);
                });
                pool.query("UPDATE info SET weight = $1 WHERE username = $2", [input, username]);
            }
            res.status(200);
            res.send();
        }
    } else if (cat === "age" || cat === "runninggoal") {
        input = convertToNumber(data.content);
        if (input === "NaN" || input <= 0) {
            res.status(400);
            res.json({"error": "invalid input"});
        } else {
            if (cat === "age") {
                pool.query("UPDATE info SET age = $1 WHERE username = $2", [input, username]);
            }
            else {
                pool.query("UPDATE info SET runningGoal = $1 WHERE username = $2", [input, username]);
            }
            res.status(200);
            res.send();
        }
    } else if (cat === "public"){
        pool.query("UPDATE info SET public = $1 WHERE username = $2", [data.content, username]).then(function(response){
            res.status(200);
            res.send();
        }).catch(function(error) {
            res.status(400);
            res.json({"error": "invalid content"});
        });
        
    } else {
        res.status(400);
        res.json({"error": "invalid category"});
    }
});

app.post("/updateprogress", function(req, res) {
    let data = req.body;
    if (!data.hasOwnProperty("username") || !data.hasOwnProperty("runningProgress")) {
        res.status(400);
        res.json({"error": "bad request"});
    }
    else if (!isFinite(data.runningProgress) || data.runningProgress <= 0) {
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
        [data.username, parseFloat(data.runningProgress), date]);

        pool.query("SELECT * FROM progress WHERE username = $1", [data.username]).then(function(response){
            let sum = 0;
            for (let row of response.rows) {
                sum += parseFloat(row.progress);
            }
            pool.query("SELECT * FROM info WHERE username = $1", [data.username]).then(function(response){
                let goal = response.rows[0].runninggoal;
                if (sum >= goal) {
                    pool.query("UPDATE info SET achieved = true WHERE username = $1", [data.username]);
                    res.status(200);
                    res.json({"achieved": true});
                } else {
                    pool.query("UPDATE info SET achieved = false WHERE username = $1", [data.username]);
                    res.status(200);
                    res.json({"achieved": false});
                }
            });
        });
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

app.post("/create", function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    
    if (username === undefined || username.length > 20 || username.length < 1) {
        res.status(401);
        res.json({"error":"Invalid username"});
    }
    else if (password === undefined || password.length > 36 || password.length < 6) {
        res.status(401);
        res.json({"error": "Invalid password"});
    }

    pool.query("SELECT * FROM accounts WHERE username = $1", [username]).then(function(response) {
        if (response.rows.length !== 0) {
            res.status(401);
            res.json({"error":"username exists"});
        }
        else {
            bcrypt.hash(password, 10).then(function(hasedPassword) {
                pool.query("INSERT INTO accounts(username, hashedpassword) VALUES($1, $2)", [username, hasedPassword]).then(function(response){
                    res.status(200);
                    res.send();
                }).catch(function(error) {
                    res.status(401);
                    res.json({"error": error});
                });
            }).catch(function(error) {
                res.status(401);
                res.json({"error": error});
            })
        }
    });

});

app.post("/login", function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    pool.query("SELECT hashedpassword FROM accounts WHERE username = $1", [
        username]).then(function(response) {
            if (response.rows.length === 0) {
                res.status(401);
                res.json({"error": "username does not exist."});
            }
            let hashedPassword = response.rows[0].hashedpassword;
            bcrypt.compare(password, hashedPassword).then(function(isSame){
                if (isSame) {
                    res.status(200);
                    console.log("login successfully");
                    res.send()
                } else {
                    res.status(401);
                    res.json({"error": "incorrect password"});
                }
            }).catch(function(error) {
                res.status(401);
                res.json({"error": error});
            });
        }).catch(function(error){
            res.status(401);
            res.json({"error": error});
        });
});

function ownProperty(data) {
    let propertyList = [
        "username",
        "age",
        "height",
        "weight",
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
