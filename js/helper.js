const getValenceElectrons = (elems, symbol) => {
	const el = elems[symbol]
	if (el) {
		return el["electron_configuration"].split(" ").at(-1).match(/[spdf](\d+)/)[1];
	} else return null
}