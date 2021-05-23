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

let button = document.getElementById("search");
button.addEventListener("click", function(){
    let username = getUsername();
    let infoUrl = `/searchinfo?username=${username}`
    console.log("Search Info "+ infoUrl)
    fetch(infoUrl).then (function (response){
        return response.json().then (function (data){
            
        })
    })
    let progressUrl = `/searchprogress?username=${username}`
    console.log("Search Progress "+ progressUrl)
    fetch(progressUrl).then (function (progress){
        return progess.json().then (function (progressData){
                
        })
    })


})

