var elems = {};
fetch("./data/elems.json")
	.then(data => data.json())
	.then(json => elems = json);

var defaults = {};
fetch("./data/defaults.json")
	.then(data => data.json())
	.then(json => defaults = json);