const $ = go.GraphObject.make;

const atoms = ["C", "H", "O", "P", "N", "S", "Cl", "Br", "I", "Si", "Mg", "Mn"]; // elems.keys();
const customAtoms = [];

const nodesData = [
	{ key: 1, atom: "C", max: 4, loc: "0 0" },
	{ key: 2, atom: "C", max: 4, loc: "100 0" },
	{ key: 3, atom: "C", max: 4, loc: "200 0" },
	{ key: 4, atom: "H", max: 4, loc: "-100 0" },
	{ key: 5, atom: "H", max: 1, loc: "0 100" },
	{ key: 6, atom: "H", max: 1, loc: "0 -100" },
	{ key: 7, atom: "H", max: 1, loc: "100 100" },
	{ key: 8, atom: "H", max: 1, loc: "100 -100" },
	{ key: 9, atom: "H", max: 1, loc: "200 100" },
	{ key: 10, atom: "H", max: 1, loc: "300 0" },
	{ key: 11, atom: "H", max: 1, loc: "200 -100" },
];

const linksData = [
	{ from: 1, to: 2 },
	{ from: 2, to: 3 },
	{ from: 1, to: 4 },
	{ from: 1, to: 5 },
	{ from: 1, to: 6 },
	{ from: 2, to: 7 },
	{ from: 8, to: 2 },
	{ from: 3, to: 9 },
	{ from: 3, to: 10 },
	{ from: 3, to: 11 },
	{ from: 3, to: 11 },
	{ from: 3, to: 11 },
];

const nodesDict = {};
nodesData.forEach( node => {nodesDict[node.key] = node} )
const linksDict = {};
nodesData.forEach( node => {nodesDict[node.key] = node} )

const createAdjacenceList = () => {
	const nodes = nodesData.sort( (a,b) => a.key - b.key );
	
	adjacenceList = {};
	// nodesData.forEach(node => adjacenceList[node.key]);
	linksData.forEach(link => {
		adjacenceList[link.from]['out'].push(link.to) 
		adjacenceList[link.to]['in'].push(link.from) 
	});
} 


const validateAtom = (tb, olds, news) => {
	return [...atoms, ...customAtoms].includes(news);
	// tb.findTopLevelPart().linksConnected.count >= getBindableElectrons(tb.findTopLevelPart().data.atom)
}

const validateBonds = (fromnode, fromport, tonode, toport) => {
	// total number of links connecting with all ports of a node is limited to 1:
	const maxCount = atomProps[fromnode.data.atom].maxBonds;
	return fromnode.linksConnected.count + tonode.linksConnected.count <= maxCount;
}

const errorHandler = (tool, olds, news) => {
	var mgr = tool.diagram.toolManager;
	mgr.hideToolTip();
	var node = tool.textBlock.part;
	var tt = $(
		"ToolTip", {
			"Border.fill": "pink",
			"Border.stroke": "red",
			"Border.strokeWidth": 2
		},
		$(go.TextBlock, 
			news + " is not an known Atom"
		)
	)
}

const editHandler = (tb, olds, news) => {
	var mgr = tb.diagram.toolManager;
	mgr.hideToolTip();
}

const selectionChangeHandler = part => {
	if (part instanceof go.Node) lastNode = part;
	myDiagram.commandHandler.editTextBlock(part);
}


const myDiagram = $(go.Diagram, "draw", { "undoManager.isEnabled": true, textEditingTool: new ContinuedTextEditingTool(), initialAutoScale: go.Diagram.Uniform });

// myDiagram.layout = new go.ForceDirectedLayout({ angle: 90, nodeSpacing: 10, layerSpacing: 30 });

myDiagram.nodeTemplate = $(
	go.Node, 'Auto', {
		locationSpot: go.Spot.Center, locationObjectName: "BODY", name: "BODY", portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides, linkValidation: validateBonds}, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
	$(go.Shape, "Circle", { fill: "white" /* defaults.atomColor */ }),
	$(go.TextBlock, { 
		margin: 10,
		font: "18px Sans-Serif", 
		editable: true, 
		isMultiline: false, 
		textValidation: validateAtom,
		errorFunction: errorHandler,
		textEdited: editHandler,
		// selectionChanged: selectionChangeHandler
	}, new go.Binding("text", "atom").makeTwoWay())
);


const triArrow = go.Geometry.parse("M 0,0 10,44 20,0 Z", true);

myDiagram.linkTemplate =
	$(go.Link,
		// default routing is go.Link.Normal
		// default corner is 0
		{curviness: 5},
		// the link path, a Shape
		$(go.Shape, { strokeWidth: 3, stroke: "#555" }),
		
		// $(go.Shape, { geometry: go.Geometry.parse("M 0,0 3,0 3,44 0,44 Z M 8,0 11,0 11,44 8,44 Z", true), strokeWidth: 0, fill: "#555"}),
		// $(go.Shape, { geometry: go.Geometry.parse("M 0,0 44,0 44,3 0,3 Z M 0,8 44,8 44,11 0,11 Z", true), strokeWidth: 0, fill: "#555"}),
		
		// $(go.Shape, { geometry: go.Geometry.parse("M 0,0 3,0 3,44 0,44 Z M 8,0 11,0 11,44 8,44 Z M 16,0 19,0 19,44 16,44 Z", true), strokeWidth: 0, fill: "#555"}),
		// $(go.Shape, { geometry: go.Geometry.parse("M 0,0 44,0 44,3 0,3 Z M 0,8 44,8 44,11 0,11 Z M 0,16 44,16 44,19 0,19", true), strokeWidth: 0, fill: "#555"}),
		
		// $(go.Shape, { geometry: triArrow, strokeWidth: 0, stroke: "#000" }),
		// $(go.Shape, { geometry: go.Geometry.parse("M 0,0 44,10 0,20 Z", true), /* fill: "transparent", */ strokeWidth: 0}),
		// $(go.Shape, { geometry: go.Geometry.parse("M 0,44 10,0 20,44 Z", true), strokeWidth: 0}),
		// $(go.Shape, { geometry: go.Geometry.parse("M 44,0 0,10 44,20 Z", true), strokeWidth: 0}),
	)
		// if we wanted an arrowhead we would also add another Shape with toArrow defined:
		//.add(new go.Shape({	toArrow: "Standard", stroke: null	}))


myDiagram.model = new go.GraphLinksModel(nodesData, linksData);

myDiagram.model.addChangedListener((e) => {
	// if (e.change === ChangedEvent.Remove) {}
	if (e.propertyName == "atom") {
		myDiagram.model.setDataProperty(e.object, "max", getValenceElectrons(elems, e.object.atom));
		myDiagram.select(myDiagram.findNodeForData(e.object));
	}
})

// function addNode(e, obj) {
//	 var data = { text: "Node", color: "white" };
//	 // do not need to set "key" property -- addNodeData will assign it automatically
//	 e.diagram.model.addNodeData(data);
//	 var node = e.diagram.findPartForData(data);
//	 node.location = e.diagram.lastInput.documentPoint;
// }