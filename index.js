document.onkeyup = (e) => {
  e = e || window.event;
  if (e.key.startsWith("Arrow")) {
	  // get current node, check all nodes connected to/from this node and check if there is one above (second "loc" value)
	  // if there is a node, select those node, otherwise create new node ("loc": existing node sec value + default distance)
	  // create and link to existing node
	  // check for validity of atom, prompt again or remove node on esc
	  // focus newly created element
	
	  if (myDiagram.selection.size == 1) {
		const dist = 100;
		const crtNode = myDiagram.selection.first();
		nNodes = [];
		crtNode.findNodesConnected().each(node => {
			if (e.key == "ArrowUp" && node.location.y > crtNode.location.y) {
				nNodes.push(node);
			}
		});

		if (nNodes.length > 0) {
			// better function to determine closest & switch between those
			nNodes[0].isSelected = true;
		} else {
			const loc = new go.Point(crtNode.location.x, crtNode.location.y + dist).stringify();
			myDiagram.addNodeData({atom: "C", loc});
		}
	}
  }
}