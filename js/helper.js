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

const getGroup = (value) => {
	const gName = value.replace(/^[-]+|[-]+$/g, '');
	for (const key in groupNames) {
		if (groupNames[key].includes(gName)) return key;
	}
	return null;
}

const parseGroup = (name) => {
	// let numberBonds = 0;
	const atoms = getGroup(name).replace(/^[-]+|[-]+$/g, '');
	const regex = /\((\w+)\)/g;
	const matches = atoms.match(regex);
	const res = [{ bonds: atoms.startsWith("=") ? 2 : 1, atoms: [atoms[0]] } ];
	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const bonds = match.startsWith("=") ? 2 : 1;
		const atoms = match.replace(/^[-]/g, '').split(/-=/g);
		res.push({bonds, atoms});
	}

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