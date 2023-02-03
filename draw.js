const nodes = [ // the nodeDataArray
  { key: 1, atom: "C", loc: "0 0" },
	{ key: 2, atom: "C", loc: "100 0" },
	{ key: 3, atom: "C", loc: "200 0" },
  { key: 4, atom: "H", loc: "-100 0" },
  { key: 5, atom: "H", loc: "0 100" },
	{ key: 6, atom: "H", loc: "0 -100" },
	{ key: 7, atom: "H", loc: "100 100" },
	{ key: 8, atom: "H", loc: "100 -100" },
	{ key: 9, atom: "H", loc: "200 100" },
	{ key: 10, atom: "H", loc: "300 0" },
	{ key: 11, atom: "H", loc: "200 -100"  },
];

const links = [ // the linkDataArray
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
const triArrow = go.Geometry.parse("M 0,0 L 10,50 20,10 30,50 40,0", false);


const myDiagram = new go.Diagram("draw", { "undoManager.isEnabled": true, initialAutoScale: go.Diagram.Uniform });

// myDiagram.layout = new go.ForceDirectedLayout({ angle: 90, nodeSpacing: 10, layerSpacing: 30 });

myDiagram.nodeTemplate = new go.Node("Auto")
  .bind("location", "loc", go.Point.parse)
  .add(new go.Shape("Circle", { fill: "lightgray" }))
  .add(new go.TextBlock({ margin: 10, font: "18px Sans-Serif" }).bind("text", "atom"))

myDiagram.linkTemplate =
  new go.Link(
    // default routing is go.Link.Normal
    // default corner is 0
    {})
    // the link path, a Shape
    // .add(new go.Shape({ strokeWidth: 3, stroke: "#555" }))
    .add(new go.Shape({ geometry: triArrow, strokeWidth: 3, stroke: "#555" }))
    // if we wanted an arrowhead we would also add another Shape with toArrow defined:
    //.add(new go.Shape({  toArrow: "Standard", stroke: null  }))


myDiagram.model = new go.GraphLinksModel(nodes, links);

function addNode(e, obj) {
  var data = { text: "Node", color: "white" };
  // do not need to set "key" property -- addNodeData will assign it automatically
  e.diagram.model.addNodeData(data);
  var node = e.diagram.findPartForData(data);
  node.location = e.diagram.lastInput.documentPoint;
}