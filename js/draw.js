const $ = go.GraphObject.make;

const atoms = ["C", "H", "O", "P", "N", "S", "Cl", "Br", "I", "Si", "Mg", "Mn"];
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
];

const validateAtom = (tb, olds, news) => {
  return [...atoms, ...customAtoms].includes(news);
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
  myDiagram.commandHandler.editTextBlock(part);
}


const myDiagram = $(go.Diagram, "draw", { "undoManager.isEnabled": true, textEditingTool: new ContinuedTextEditingTool(), initialAutoScale: go.Diagram.Uniform });

// myDiagram.layout = new go.ForceDirectedLayout({ angle: 90, nodeSpacing: 10, layerSpacing: 30 });

myDiagram.nodeTemplate = $(
  go.Node, "Auto", {linkValidation: validateBonds}, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
  $(go.Shape, "Circle", { fill: "white" }),
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


const triArrow = go.Geometry.parse("M 0,0 L 10,50 20,10 30,50 40,0", false);

myDiagram.linkTemplate =
  $(go.Link,
    // default routing is go.Link.Normal
    // default corner is 0
    {},
    // the link path, a Shape
    // $(go.Shape, { strokeWidth: 3, stroke: "#555" }))
    $(go.Shape, { geometry: triArrow, strokeWidth: 3, stroke: "#000" }))
    // if we wanted an arrowhead we would also add another Shape with toArrow defined:
    //.add(new go.Shape({  toArrow: "Standard", stroke: null  }))


myDiagram.model = new go.GraphLinksModel(nodesData, linksData);

myDiagram.model.addChangedListener((e) => {
  if (e.propertyName == "atom") {
    myDiagram.model.setDataProperty(e.object, "max", getValenceElectrons(elems, e.object.atom));
    myDiagram.select(myDiagram.findNodeForData(e.object));
  }
})

// function addNode(e, obj) {
//   var data = { text: "Node", color: "white" };
//   // do not need to set "key" property -- addNodeData will assign it automatically
//   e.diagram.model.addNodeData(data);
//   var node = e.diagram.findPartForData(data);
//   node.location = e.diagram.lastInput.documentPoint;
// }