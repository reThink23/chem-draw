var elems = {};
fetch("./json/elems.json")
	.then(data => data.json())
	.then(json => elems = json);

var defaults = {};
fetch("./json/defaults.json")
	.then(data => data.json())
	.then(json => defaults = json);