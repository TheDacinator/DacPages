var random = function() {
	var min = Number(document.getElementById("min").value);
	var max = Number(document.getElementById("max").value);
	if (max > min) {
		document.getElementById("output").innerHTML = Math.floor(Math.random()*(max-min+1)+min);
	} else {
		document.getElementById("output").innerHTML = "Invalid Format";
	}
}