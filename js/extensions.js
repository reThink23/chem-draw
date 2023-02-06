// usage: textEditingTool: new ContinuedTextEditingTool() in Diagram initialization
function ContinuedTextEditingTool() {
    go.TextEditingTool.call(this);
    this.starting = go.TextEditingTool.SingleClick;
  }
  go.Diagram.inherit(ContinuedTextEditingTool, go.TextEditingTool);

  ContinuedTextEditingTool.prototype.doMouseDown = function() {
    go.TextEditingTool.prototype.doMouseDown.call(this);
    if (!this.isActive) {
      this.diagram.currentTool.doMouseDown();
    }
  }