/* Global variable to control loggin state */
let authenticate = false;
let global_username = "";

/* Functions for user login */
function getLoginInfo(){
    let usernameInput = document.getElementById("login-username");
    let username = usernameInput.value;

    let pwInput = document.getElementById("login-password");
    let pw = pwInput.value;

    return {"username": username, "password": pw};
}

/* Functions for creating new user */
function getNewUser(){
    let usernameInput = document.getElementById("create-username");
    let username = usernameInput.value;

    let pwInput = document.getElementById("create-password");
    let pw = pwInput.value;

    return {"username": username, "password": pw};
}

/* Function for calculating BMI */
// function getBMI(h, w){
//     return w/((h/100.0)*(h/100.0));
// }

/* Functions for add running data */
function getGoal() {
    let username = global_username;

    let ageInput = document.getElementById("age");
	let age = ageInput.value;

    let heightInput = document.getElementById("height");
	let height = heightInput.value;

    let weightInput = document.getElementById("weight");
	let weight = weightInput.value;

	// let bmi = getBMI(height, weight);

	let privacyOptions = document.getElementsByName("privacy");
    let privacy;
    for (const opt of privacyOptions){
        if (opt.checked){
            // Public = yes, Private = no
            privacy = opt.value;
        }
    }

    let runningGoalInput = document.getElementById("running-goal");
	let runningGoal = runningGoalInput.value;

	return {"username": username, 
            "age": age, 
            "height": height, 
            "weight": weight, 
            "public": privacy,
            "runningGoal": runningGoal,
        };
}

/* Functions for adding running progress data. */
function getRunningProgress(){
    let progressInput = document.getElementById("running-progress");
    let runningProgress = progressInput.value;
    return {"username": global_username, "runningProgress": runningProgress};
}

/* Functions for Updating data. */
function getUpdateCategory() {
	let allCategory = document.getElementById("category");
	let selectedIndex = allCategory.selectedIndex;
	let selectedCategory = allCategory.options[selectedIndex];
	return selectedCategory.value;
}

function getUpdateData(){
    let category = getUpdateCategory();
    let contentInput = document.getElementById("update-data");
    let newContent = contentInput.value;
    return {"username": global_username, "category": category, "newContent": newContent};
}

/* Handles Buttons click events */
let loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", function(){
    let loginInfo = getLoginInfo();
    fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(loginInfo),
    }).then(function(response){
        let msg = document.getElementById("msg");
        if (response.status === 200){
            msg.textContent = `Login Successfully. You are logged in as ${loginInfo.username}`;
            authenticate = true;
            global_username = loginInfo.username;
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Login Failed. " + data.error;
                authenticate = false;
                global_username = "";
            })
        }
    }).catch(function(err){
        console.log(err);
    });
});

/* Create new user button */
let createButton = document.getElementById("create-button");
createButton.addEventListener("click", function(){
    let newUserInfo = getNewUser();
    fetch("/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newUserInfo),
    }).then(function(response){
        let msg = document.getElementById("msg");
        if (response.status === 200){
            msg.textContent = `Create New User Successfully. You are logged in as ${newUserInfo.username}`;
            authenticate = true;
            global_username = newUserInfo.username;
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Create New User Failed. " + data.error;
            })
        }
    }).catch(function(err){
        console.log(err);
    });
});

/* Add new Goal button handler */
let addGoalButton = document.getElementById("add-goal-button");
addGoalButton.addEventListener("click", function(){
    if (!authenticate){
        alert("Please login or create a new account first.");
        return;
    }

    let runningGoalData = getGoal();
    fetch("/add", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(runningGoalData),
    }).then(function(response){
        let msg = document.getElementById("msg");
        if (response.status == 200){
            msg.textContent = "Successfully added running Goal.";
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Add Running Goal Failed. " + data.error;
            })
        }
    }). catch(function(error){
        console.log(error);
    }); 
});

/* Add Progress button handler */
let addProgressButton = document.getElementById("add-progress-button");
addProgressButton.addEventListener("click", function(){
    if (!authenticate){
        alert("Please login or create a new account first.");
        return;
    }

    let runningProgressData = getRunningProgress();
    fetch("/updateprogress", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(runningProgressData),
    }).then(function(response){
        let msg = document.getElementById("msg");
        if (response.status == 200){
            msg.textContent = "Successfully added running progress.";
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Adding Running Progress Failed. " + data.error;
            })
        }
    }). catch(function(error){
        console.log(error);
    }); 
});

/* Update Data button handler */
let updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", function(){
    if (!authenticate){
        alert("Please login or create a new account first.");
        return;
    }

    let updateData = getUpdateData();
    fetch("/updatedata", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(updateData),
    }).then(function(response){
        let msg = document.getElementById("msg");
        if (response.status == 200){
            msg.textContent = "Successfully updated data.";
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Update Data Failed. " + data.error;
            })
        }
    }). catch(function(error){
        console.log(error);
    }); 
});
