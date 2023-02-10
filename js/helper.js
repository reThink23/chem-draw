const getValenceElectrons = (symbol) => {
	const el = elems[symbol];
	if (el) {
		return el["electron_configuration"].split(" ").at(-1).match(/[spdf](\d+)/)[1];
	} else return null
}

const getBindableElectrons = (symbol) => {
	const vE = getValenceElectrons(symbol);
	return (vE > 4) ? 8 - vE : vE;
}