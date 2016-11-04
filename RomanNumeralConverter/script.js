var roman = ["I","IV","V","IX","X","XL","L","XC","C","CD","D","CM","M"];
var decimal = [1,4,5,9,10,40,50,90,100,400,500,900,1000];
function keypress(event,t) {
	if (event.key == "Enter") {
		if (t == 1) {
			document.getElementById("dec").value = todec(document.getElementById("rn").value);
		} else {
			document.getElementById("rn").value = torn(document.getElementById("dec").value);
		}
	}
}
function todec(str) {
	str = str.toUpperCase();
	var out = 0;
	for (i = decimal.length-1; i >= 0;) {
		var len = roman[i].length;
		if (str.substring(0,len) == roman[i]) {
			out += decimal[i];
			str = str.substring(len);
		} else {
			i--;
		}
		if (str.length == 0) {
			break;
		}
	}
	return out;
}
function torn(num) {
	var out = "";
	for (i = decimal.length-1; i >= 0;) {
		if (num-decimal[i] >= 0) {
			out += roman[i];
			num -= decimal[i];
		} else {
			i--;
		}
	}
	return out;
}