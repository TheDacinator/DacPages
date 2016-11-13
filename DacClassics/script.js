var change = function(e) {
	document.getElementById("frame").src = document.getElementById("new").value;
	document.getElementById("frame").contentWindow.location.reload();
}