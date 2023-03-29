/**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * 
  * @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  * 
  * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */
const getTextWidth = (text, font) => {
	// re-use canvas object for better performance
	const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	const context = canvas.getContext("2d");
	context.font = font;
	const metrics = context.measureText(text);
	return metrics.width;
}

const getCssStyle = (element, prop) => {
	return window.getComputedStyle(element, null).getPropertyValue(prop);
}

const getCanvasFont = (el = document.body) => {
	const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
	const fontSize = getCssStyle(el, 'font-size') || '16px';
	const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

	return `${fontWeight} ${fontSize} ${fontFamily}`;
}

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


const groupAsSubgraph = (groupAbbr) => {
	const nodes = []
	const links = []

	const gId = uuidv4();
	const group = `${groupAbbr}_${gId}`

	const atoms = groupAbbr.split(/(?=[A-Z])/g); 

	for (let i = 0; i < atoms.length; i++) {
		let keyFirst;
		const atom = atoms[i];
		const atomId = `${gId}_${atom}${groupAbbr.substring(0, i+1).count(atom)}`;
		nodes.push({key: atomId, atom, group});

		if (i == 0) {keyFirst = atomId}; 

		if (atom != "O" && atoms[i+1] != "H") {
			links.push({source: keyFirst, target: atomId, group});
		} else {
			links.push({ source: keyFirst, target: atomId, group });
			links.push({ source: atomId, target: `${gId}_H${groupAbbr.substring(0, i+1).count('H') }`, group });
			i++;
		}
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