var shadow = function(x) {
	x.style["box-shadow"] = "0 0 25px black";
}
var noshadow = function(x) {
	x.style["box-shadow"] = "none";
}
function resize() {
	if (window.innerWidth < 1120) {
		document.getElementById("boxes").style["max-width"] = 548;
	} else {
		document.getElementById("boxes").style["max-width"] = 1106;
	}
}
