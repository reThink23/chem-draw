const getNextNodes = (key, crtNode) => {
	const nextNodes = [];
	var closestNode;
	switch (key) {
		case "ArrowUp":
			crtNode.findNodesConnected().each(node => {if (node.location.y > crtNode.location.y) nextNodes.push(node); });
			closestNode = nextNodes.reduce((pre, crt) => pre.location.y < crt.location.y ? pre : crt);
			break;
		case "ArrowDown":
			crtNode.findNodesConnected().each(node => {if (node.location.y < crtNode.location.y) nextNodes.push(node); });
			closestNode = nextNodes.reduce((pre, crt) => pre.location.y > crt.location.y ? pre : crt);
			break;
		case "ArrowLeft":
			crtNode.findNodesConnected().each(node => {if (node.location.x < crtNode.location.x) nextNodes.push(node); });
			closestNode = nextNodes.reduce((pre, crt) => pre.location.x > crt.location.x ? pre : crt);
			break;
		case "ArrowRight":
			crtNode.findNodesConnected().each(node => {if (node.location.x > crtNode.location.x) nextNodes.push(node); });
			closestNode = nextNodes.reduce((pre, crt) => pre.location.x < crt.location.x ? pre : crt);
			break;
		default:
			nextNodes = crtNode.findNodesConnected();
			closestNode = nextNodes.reduce((pre, crt) => {
				const distPre = Math.abs(pre.location.x) ** 2 + Math.abs(pre.location.y) ** 2
				const distCrt = Math.abs(crt.location.x) ** 2 + Math.abs(crt.location.y) ** 2
				return distPre < distCrt ? pre : crt
			});
			break;
	}
	return {nextNodes, closestNode};
}

const navigateNode = key => {
	
	// create and link to existing node
	// check for validity of atom, prompt again or remove node on esc
	// focus newly created element
	
	// get current node, check all nodes connected to/from this node and check if there is one above/below/leftside/rightsode (second "loc" value)
	if (myDiagram.selection.size == 1) {
		const dist = 100;
		const crtNode = myDiagram.selection.first();
		const {nextNodes, closestNode} = getNextNodes(key, crtNode);
		
		// if there is a node, select those node, otherwise create new node ("loc": existing node sec value + default distance)
		if (nextNodes.length > 0) {
			// determine closest node & switch between nodes
			// to switch keep selection (nNodes) and jump between with arrow keys
			closestNode.isSelected = true;
		} else {
			const loc = new go.Point(crtNode.location.x, crtNode.location.y + dist).stringify();
			myDiagram.addNodeData({atom: "C", loc});
		}
	}
}

document.onkeyup = (e) => {
  e = e || window.event;
  if (e.key.startsWith("Arrow")) navigateNode(e.key)
}