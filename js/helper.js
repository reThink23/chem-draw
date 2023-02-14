const getValenceElectrons = (symbol) => {
	const el = elems[symbol];
	if (el) {
		// return el["electron_configuration"].split(" ").at(-1).match(/[spdf](\d+)/)[1];
		return el["shells"].at(-1);
	} else return null
}

const getBindableElectrons = (symbol) => {
	const vE = getValenceElectrons(symbol);
	return (vE > 4) ? 8 - vE : vE;
}

const parseKeys = (e) => {
	return `
  	${e.metaKey ? 'meta+' : ''}
  	${e.altKey ? 'alt+' : ''}
  	${e.ctrlKey ? 'ctrl+' : ''}
  	${e.shiftKey ? 'shift+' : ''}
  	${e.key}
  `
}