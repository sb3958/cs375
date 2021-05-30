function getUsername(){
    let userID = document.getElementById("username");
    let user = userID.value
    return user;
}

function removeRows(element) {
    while (element.hasChildNodes()) {
		element.lastChild.remove();
	}
}

function goal(data){
    for (let i=0;i < data.length;i++){
        if (data[i].achieved === true){
            data[i].achieved = "Goal Achieved";
    }
    else{
        data[i].achieved = "Goal Not Achieved";
    }}
}

let table = document.getElementById("table-body");
let button = document.getElementById("search");
button.addEventListener("click", function(){
    let username = getUsername();
    let infoUrl = `/searchinfo?username=${username}`
    fetch(infoUrl).then (function (response){
        return response.json().then (function (data){
            removeRows(table);
            if (response.status === 200){
                goal(data.info);
                for (let users of data.info){
                    let row = document.createElement("tr");
                    for (let values of ["height", "weight", "bmi","runninggoal","achieved"]){
                        let tableRows = document.createElement("td");
                        tableRows.textContent = users[values];
                        tableRows.style.color="white";
                        row.append(tableRows);
                    }
                    table.append(row);
                }

                
                let progressUrl = `/searchprogress?username=${username}`
                console.log("Search Progress "+ progressUrl)
                fetch(progressUrl).then (function (progress){
                    return progress.json().then (function (progressData){
                        console.log(progressData);
                        let runningProgress=[];
                        let runDate=[];
                        let user = progressData.progress[0].username;
                        for (let i=0; i < progressData.progress.length;i++){
                            runningProgress.push(progressData.progress[i].progress);
                            let progressDate = progressData.progress[i].date
                            let date = new Date(progressDate).toDateString();
                            runDate.push(date)
                        }
                        var chart = document.getElementById("search-chart");
                        var searchChart = new Chart(chart, {
                            type: 'line',
                            data: {
                                labels: runDate,
                                datasets:[
                                    {
                                        label: `${user}'s Running Progress`,
                                        data: runningProgress,
                                        fill: false,
                                        borderColor: 'rgb(255, 159, 64)',
                                        lineTension: 0.1,
                                        pointBorderColor: 'rgb(0,0,0)',
                                        pointBackgroundColor: 'rgb(0,35,102)',
                                        pointBorderwidth: 100,
                                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                        borderWidth: 1,
                                    }
                                ]

                            },
                            /*options: {
                                scales:{
                                    axisY: [{
                                        label: "Running Progress"
                                    }]
                                }
                            }*/
                            
                        });
                        
                    })
                })
                
            }
            else{
                let message = document.getElementById("message");
                message.textContent = data.error;
            }
                           

        })
    })
    


})

