function run() {
	try {
		document.getElementsByTagName("p")[0].style.color = "black";
		document.getElementsByTagName("p")[0].innerHTML = eval(document.getElementsByTagName("textarea")[0].value);
	}
	catch(err) {
		document.getElementsByTagName("p")[0].style.color = "red";
		document.getElementsByTagName("p")[0].innerHTML = err;
	}
}
function url(inp) {
	document.getElementsByTagName("iframe")[0].src = inp;
}