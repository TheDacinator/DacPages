function resize() {
	if (window.innerWidth < 1120) {
		document.getElementById("boxes").style["max-width"] = 548;
	} else {
		document.getElementById("boxes").style["max-width"] = 1106;
	}
}
