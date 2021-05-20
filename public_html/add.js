/* Global variable to control loggin state */
let authenticate = false;

/* Functions for user login */
function getLoginInfo(){
    let usernameInput = document.getElementById("login-username");
    let username = usernameInput.value;

    let pwInput = document.getElementById("login-password");
    let pw = pwInput.value;

    return {"username": username, "password": pw};
}

let loginButton = document.getElementById("login-button");
loginButton.addEventListener("click"), function(){
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
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Login Failed. " + data.error;
            })
        }
    }).catch(function(err){
        console.log(err);
    });
};

/* Functions for creating new user */
function getNewUser(){
    let usernameInput = document.getElementById("create-username");
    let username = usernameInput.value;

    let pwInput = document.getElementById("create-password");
    let pw = pwInput.value;

    return {"username": username, "password": pw};
}

let createButton = document.getElementById("create-button");
createButton.addEventListener("click"), function(){
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
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Create New User Failed. " + data.error;
            })
        }
    }).catch(function(err){
        console.log(err);
    });
};

/* Functions for add running data */
function getGoal() {
	let usernameInput = document.getElementById("data-username");
	let username = usernameInput.value;

    let ageInput = document.getElementById("age");
	let age = ageInput.value;

    let heightInput = document.getElementById("height");
	let height = heightInput.value;

    let weightInput = document.getElementById("weight");
	let weight = weightInput.value;

    let bmiInput = document.getElementById("bmi");
	let bmi = bmiInput.value;

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

    let runningProgressInput = document.getElementById("running-progress");
	let runningProgress = runningProgressInput.value;

    let achievedGoalOptions = document.getElementsByName("achieved-goal");
    let achievedGoal;
    for (const opt2 of achievedGoalOptions){
        if (opt2.checked){
            // achieved the Goal: yes or no
            achievedGoal = opt2.value;
        }
    }

	return {"username": username, 
            "age": age, 
            "height": height, 
            "weight": weight, 
            "bmi": bmi, 
            "public": privacy,
            "runningGoal": runningGoal,
            "runningProgress": runningProgress,
            "achievedGoal": achievedGoal,    
        };
}

let addButton = document.getElementById("add-button");
addButton.addEventListener("click", function(){
    if (!authenticate){
        alert("Please login or create a new account first.");
        return;
    }

    let runningData = getGoal();
    console.log(runningData);
    fetch("/add", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(runningData),
    }).then(function(response){
        let msg = document.getElementById("msg");
        if (response.status == 200){
            msg.textContent = "Successfully added running data.";
        }
        else{
            response.json().then(function(data){
                msg.textContent = "Add Data Failed. " + data.error;
            })
        }
    }). catch(function(error){
        console.log(error);
    }); 
});

/* Functions for Updating data. */
function getUpdateCategory() {
	let allCategory = document.getElementById("category");
	let selectedIndex = allCategory.selectedIndex;
	let selectedCategory = allCategory.options[selectedIndex];
	return selectedCategory.value;
}

function getUpdateData(){
    let updateDateInput = document.getElementById("update-date");
    let updateDate = updateDateInput.value;

    let category = getUpdateCategory();

    let contentInput = document.getElementById("update-data");
    let newContent = contentInput.value;

    return {"date": updateDate, "category": category, "newContent": newContent};
}

let updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", function(){
    if (!authenticate){
        alert("Please login or create a new account first.");
        return;
    }

    let updateData = getUpdateData();
    console.log(updateData);
    fetch("/update", {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(updateData),
    }).then(function(response){
        let msg = document.getElementById("msg");
        if (response.status == 200){
            msg.textContent = "Successfully updated running data.";
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

