const lastNextNodes = [];
var lastNode;

const arr = myDiagram.model.nodeDataArray;
const key = arr.at(-1).key;
const firstNode = myDiagram.findNodeForKey(key);
myDiagram.select(firstNode);
// const tbFN = firstNode.elt(1);
// if (myDiagram.commandHandler.canEditTextBlock(tbFN)) {
// 	myDiagram.commandHandler.editTextBlock(tbFN);
// }

const addNode = (crtNode, nodeData) => {
	myDiagram.startTransaction("add node with link");
	myDiagram.model.addNodeData(nodeData);
	const newNode = myDiagram.findNodeForData(nodeData);
	myDiagram.model.addLinkData({from: crtNode.data.key, to: newNode.data.key});
	myDiagram.commitTransaction("add node with link");
	return newNode;
}

const groupNames = {
	"OH": ["OH", "Hydroxy"], 
	// "-O(-H)": ["OH", "Hydroxy"], 
	"COOH": ["COOH", "Carboxyl"], 
	// "-C(=O)(-O-H)": ["COOH", "Carboxyl"], 
	"CHO": ["CHO", "Aldehyd"], 
	// "-C(-H)(=O)": ["CHO", "Aldehyd"], 
	"NH2": ["NH2", "Amino"],
	// "-N(-H)(-H)": ["NH2", "Amino"],
	"CH3": ["CH3", "Methyl"],
	// "-C(-H)(-H)(-H)": ["CH3", "Methyl"],
	"Ph": ["Ph", "Phenyl"]
	// "CO": ["CO", "Carbonyl"], 
};

const findGroup = (name, type = "group") => {
	const atoms = getGroup(name);
	const groups = [];
	// const atoms = name.split("");
	myDiagram.findNodesByExample({atom: atoms[0]}).each(node => {
		const corAtoms = []
		const conNodes = node.findNodesConnected();
		conNodes.each(conNode => conNode.data.atom == atoms[1] ? corAtoms.push(conNode) : null);
		switch (atoms) {
			case "OH":
				if (node.linksConnected.count != 2 && corAtoms.length != 1) break;
				const links = node.findLinksBetween(corAtoms[0]);
				if (links.length === 0) break;
				groups.push([[node, corAtoms[0]], Array.from(links)]);
				break;
		
			default:
				break;
		}

	})

	const links = myDiagram.model.linkDataArray;
	const hydroxyGroups = links.filter(link => {
		const fromNode = myDiagram.findNodeForKey(link.from)
		const toNode = myDiagram.findNodeForKey(link.to)
		const fromAtom = fromNode.data.atom
		const toAtom = toNode.data.atom
		return (fromAtom == "O" && toAtom == "H" && fromNode.linksConnected.count == 2) || (fromAtom == "H" && toAtom == "O" && toNode.linksConnected.count == 2)
	});
	const aminoGroups = links.filter(link => {
		const fromNode = myDiagram.findNodeForKey(link.from)
		const toNode = myDiagram.findNodeForKey(link.to)
		const fromAtom = fromNode.data.atom
		const toAtom = toNode.data.atom
		if (fromAtom == "N") Array.from(fromNode.findNodesConnected()).filter()
		return (fromAtom == "N" && toAtom == "H" && fromNode.linksConnected.count == 3) || (fromAtom == "H" && toAtom == "N" && toNode.linksConnected.count == 3)
	});
	// name: functional groups: OH (Hydroxyl), COOH (Carboxyl), CHO (Aldehyd), CO (Carbonyl), NH2 (Amino), Ph (Phenyl)
	// 		 bonds: 			ester, peptide, oxy, single, double, triple
	// type: "group" | "bond" | "g" | "b"
	switch (name) {
		case "OH":
		case "Hydroxy":

			break;

		default:
			break;
	}
}

const getNextNodes = (crtNode, pos, direction=1) => {
	const dir = (direction >= 0 ? 1 : -1);
	var nextNodes = [];
	var closestNode = null;

	if (["x", "y"].includes(pos)) {
		crtNode.findNodesConnected().each(node => { 
			if (dir * crtNode.location[pos] < dir * node.location[pos]) {
				nextNodes.push(node);
				// if (dir * closest.location[pos] > dir * node.location[pos]) latestNode = node;
			} 
		});
		if (nextNodes.length > 0) {
			closestNode = nextNodes.reduce((pre, crt) => dir * pre.location[pos] > dir * crt.location[pos] ? pre : crt);
		}
	} else {
		nextNodes = crtNode.findNodesConnected();
		closestNode = (nextNodes.length > 0) ? nextNodes.reduce((pre, crt) => {
			const distPre = Math.abs(pre.location.x) ** 2 + Math.abs(pre.location.y) ** 2;
			const distCrt = Math.abs(crt.location.x) ** 2 + Math.abs(crt.location.y) ** 2;
			return distPre < distCrt ? pre : crt;
		}) : null;
	}

	return {nextNodes, closestNode};
}

const shiftPoint = (node, pos, shift) => {
	if (pos === "x") return new go.Point(node.location.x + shift, node.location.y);
	if (pos === "y") return new go.Point(node.location.x, node.location.y + shift);
	return new go.Point(node.location.x, node.location.y);
}


const dist = 100;

const keyMap = {
	ArrowUp: () => navigateNode("y", -1),
	ArrowDown: () => navigateNode("y", 1),
	ArrowLeft: () => navigateNode("x", -1),
	ArrowRight: () => navigateNode("x", 1),
}

const navigateNode = (pos, direction) => {
	direction = (direction >= 0 ? 1 : -1);
	if (!["x", "y"].includes(pos)) return;
	
	// prompt again or remove node on esc
	
	if (myDiagram.selection.size != 1 || !(myDiagram.selection.first() instanceof go.Node)) return;
	
	const crtNode = myDiagram.selection.first();
	const { nextNodes, closestNode } = getNextNodes(crtNode, pos, direction);
	
	myDiagram.toolManager.textEditingTool.acceptText();
	// myDiagram.toolManager.textEditingTool.doCancel();

	// if there is a node, select those node, otherwise create new node ("loc": existing node sec value + default distance)
	if (nextNodes.length > 0) {
		// determine closest node & switch between nodes
		// to switch keep selection (nNodes) and jump between with arrow keys
		myDiagram.select(closestNode);
		const tb = closestNode.elt(1);
		if (myDiagram.commandHandler.canEditTextBlock(tb)) {
			myDiagram.commandHandler.editTextBlock(tb);
		}
	} else {
		// check for validity of bond
		if (crtNode.linksConnected.count >= getBindableElectrons(crtNode.data.atom)) return;
		
		lastNode = crtNode;
		
		// create and link to existing node
		const point = shiftPoint(crtNode, pos, direction * defaults.distance)
		const loc = go.Point.stringify(point);
		const newNodeData = {atom: defaults.atom, loc: loc};

		const newNode = addNode(crtNode, newNodeData);

		// focus newly created node
		myDiagram.select(newNode);
		const tb = newNode.elt(1);
		if (myDiagram.commandHandler.canEditTextBlock(tb)) {
			myDiagram.commandHandler.editTextBlock(tb);
		}
	}
}

// myDiagram.commandHandler.doKeyDown = function() { // must be a function, not an arrow =>
//   const e = myDiagram.lastInput;
//   if (e.key.startsWith("Arrow") && !e.control && !e.shift) {  // could also check for e.control or e.shift
//     return;
//   } else {
//     // call base method with no arguments
//     go.CommandHandler.prototype.doKeyDown.call(this);
//   }
// };

document.onkeyup = (e) => {
  e = e || window.event;
  const isTb = document.activeElement === document.querySelector("textarea:focus");
  const isMod = e.shiftKey || e.ctrlKey || e.metaKey || e.altKey;
  stringKey = `
  	${e.metaKey ? 'meta+' : ''}
  	${e.altKey ? 'alt+' : ''}
  	${e.ctrlKey ? 'ctrl+' : ''}
  	${e.shiftKey ? 'shift+' : ''}
  	${e.key}
  `
//   if (keyMap[stringKey] !== undefined) keyMap[stringKey]()

  if (e.key.startsWith("Arrow") && !isMod) { keyMap[e.key](); return;}
  if (e.key == "Del" && !isMod && isTb) { deleteNode(); return;}

}

// document.querySelector("textarea").addEventListener("input", e => {
// 	myDiagram.toolManager.textEditingTool.acceptText();
// })