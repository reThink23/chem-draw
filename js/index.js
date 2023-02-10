const lastNextNodes = [];

const arr = myDiagram.model.nodeDataArray;
const data = arr[Math.floor(Math.random() * arr.length)];
const node = myDiagram.findNodeForData(data);
myDiagram.select(node);

const addNode = (crtNode, nodeData) => {
	myDiagram.startTransaction("add node with link");
	myDiagram.model.addNodeData(nodeData);
	const newNode = myDiagram.findNodeForData(nodeData);
	myDiagram.model.addLinkData({from: crtNode.data.key, to: newNode.data.key});
	myDiagram.commitTransaction("add node with link");
	return newNode;
}

const getNextNodes = (key, crtNode) => {
	const nextNodes = [];
	var closestNode;
	switch (key) {
		case "ArrowUp":
			crtNode.findNodesConnected().each(node => {if (node.location.y < crtNode.location.y) nextNodes.push(node); });
			closestNode = (nextNodes.length > 0) ? nextNodes.reduce((pre, crt) => pre.location.y > crt.location.y ? pre : crt) : null;
			break;
		case "ArrowDown":
			crtNode.findNodesConnected().each(node => {if (node.location.y > crtNode.location.y) nextNodes.push(node); });
			closestNode = (nextNodes.length > 0) ? nextNodes.reduce((pre, crt) => pre.location.y < crt.location.y ? pre : crt) : null;
			break;
		case "ArrowLeft":
			crtNode.findNodesConnected().each(node => {if (node.location.x < crtNode.location.x) nextNodes.push(node); });
			closestNode = (nextNodes.length > 0) ? nextNodes.reduce((pre, crt) => pre.location.x > crt.location.x ? pre : crt) : null;
			break;
		case "ArrowRight":
			crtNode.findNodesConnected().each(node => {if (node.location.x > crtNode.location.x) nextNodes.push(node); });
			closestNode = (nextNodes.length > 0) ? nextNodes.reduce((pre, crt) => pre.location.x < crt.location.x ? pre : crt) : null;
			break;
		default:
			nextNodes = crtNode.findNodesConnected();
			closestNode = (nextNodes.length > 0) ? nextNodes.reduce((pre, crt) => {
				const distPre = Math.abs(pre.location.x) ** 2 + Math.abs(pre.location.y) ** 2
				const distCrt = Math.abs(crt.location.x) ** 2 + Math.abs(crt.location.y) ** 2
				return distPre < distCrt ? pre : crt
			}) : null;
			break;
	}
	return {nextNodes, closestNode};
}

const shiftPoint = (node, pos, shift) => {
	if (pos === "x") return new go.Point(node.location.x + shift, node.location.y);
	if (pos === "y") return new go.Point(node.location.x, node.location.y + shift);
	return null;
}


const dist = 100;
const keyMap = {
	ArrowUp: (node) => shiftPoint(node, "y", -dist),
	ArrowDown: (node) => shiftPoint(node, "y", dist),
	ArrowLeft: (node) => shiftPoint(node, "x", -dist),
	ArrowRight: (node) => shiftPoint(node, "x", dist),
}

const navigateNode = (key) => {
	
	// check for validity of atom, prompt again or remove node on esc
	// focus newly created element
	
	// get current node, check all nodes connected to/from this node and check if there is one above/below/leftside/rightsode (second "loc" value)
	if (myDiagram.selection.size == 1 && !(myDiagram.selection.first() instanceof go.Link)) {
		const crtNode = myDiagram.selection.first();
		const {nextNodes, closestNode} = getNextNodes(key, crtNode);
		
		// if there is a node, select those node, otherwise create new node ("loc": existing node sec value + default distance)
		if (nextNodes.length > 0) {
			// determine closest node & switch between nodes
			// to switch keep selection (nNodes) and jump between with arrow keys
			myDiagram.select(closestNode);
			myDiagram.toolManager.textEditingTool.acceptText();
			// myDiagram.toolManager.textEditingTool.doCancel();
			myDiagram.commandHandler.editTextBlock(closestNode.elt(1));
		} else {
			var p;
			switch (key) {
				case "ArrowUp":
					p = new go.Point(crtNode.location.x, crtNode.location.y - dist);
					break;
				case "ArrowDown":
					p = new go.Point(crtNode.location.x, crtNode.location.y + dist);
					break;
				case "ArrowLeft":
					p = new go.Point(crtNode.location.x - dist, crtNode.location.y);
					break;
				case "ArrowRight":
					p = new go.Point(crtNode.location.x + dist, crtNode.location.y);
					break;
			
				default:
					p = crtNode.location;
					break;
			}
			// const p = new go.Point(crtNode.location.x, crtNode.location.y + dist);
			const loc = go.Point.stringify(p);
			// create and link to existing node
			if (crtNode.linksConnected.count >= getBindableElectrons(crtNode.data.atom)) return;
			console.log(crtNode.linksConnected.count)
			const newNodeData = {atom: "C", loc};
			const newNode = addNode(crtNode, newNodeData);
			myDiagram.select(newNode);
			const tb = newNode.elt(1);
			if (myDiagram.commandHandler.canEditTextBlock(tb)) {
				myDiagram.commandHandler.editTextBlock(tb);
			}
		}
	}
}

myDiagram.commandHandler.doKeyDown = function() { // must be a function, not an arrow =>
  const e = myDiagram.lastInput;
  if (e.key.startsWith("Arrow") && !e.control && !e.shift) {  // could also check for e.control or e.shift
    return;
  } else {
    // call base method with no arguments
    go.CommandHandler.prototype.doKeyDown.call(this);
  }
};

document.onkeyup = (e) => {
  if (document.activeElement === document.querySelector("textarea:focus")) return;
  e = e || window.event;
  if (e.key.startsWith("Arrow")) navigateNode(e.key);
  if (e.key == "Del" && e.shift) navigateNode(e.key);

}