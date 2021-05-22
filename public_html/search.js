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
    let url = `/search?username=${username}`
    fetch(url).then (function (response){
        return response.json().then (function (data){
            
        })
    })
})