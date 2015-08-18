'use strict';

var BDKBRUSH_SELECT_TOLERANCE = 5;

class BDKBrush extends BDKDrawable
{
  constructor(context, brushData)
  {
    super(brushData);
    if (brushData == null)
    {
      this.geometry = UIManager.getInstance().createLineElement(null);
      this.color = BDKanvas.getInstance().brushTabBundle.properties["linecolor"].getValue();
      this.lineWidth = BDKanvas.getInstance().brushTabBundle.properties["linewidth"].getValue();
      this.closed = BDKanvas.getInstance().brushTabBundle.properties["closed"].getValue();
      this.dashed = BDKanvas.getInstance().brushTabBundle.properties["dashed"].getValue();
      this.filled = BDKanvas.getInstance().brushTabBundle.properties["filled"].getValue();
      this.fillColor = BDKanvas.getInstance().brushTabBundle.properties["fillcolor"].getValue();
    }
    else {
      this.geometry = UIManager.getInstance().createLineElement(brushData.geometry);
      this.color = brushData.color;
      this.lineWidth = brushData.lineWidth;
      this.closed = brushData.closed;
      this.dashed = brushData.dashed;
      this.filled = brushData.filled;
      this.fillColor = brushData.fillColor;
    }
    this.context = context;
  }

  resetUUID(){
    super.resetUUID();
    this.geometry.resetUUID();
  }

  serialize() {
    var result = super.serialize();
    result.color = this.color;
    result.lineWidth = this.lineWidth;
    result.closed = this.closed;
    result.dashed = this.dashed;
    result.filled = this.filled;
    result.fillColor = this.fillColor;
    result.geometry = this.geometry.serialize();

    return result;
  }

  serializeGeometry(){
    return this.geometry.serialize();
  }

  unserializeGeometry(gData){
    this.geometry = new UILine(gData);
  }

  draw(context)
  {
    if (this.geometry.points.length === 1)
    {
      this.context.fillStyle = this.color;
      this.context.beginPath();
      var p = BDKanvas.getInstance().innerToCanvasPoint(this.geometry.points[0]);
      this.context.arc(p.x,p.y,this.lineWidth / 2.0,0,2*Math.PI,true);
      this.context.fill();
    }
    else {
      var oldDash = this.context.getLineDash();
      if (this.dashed){
        this.context.setLineDash([8,5,2,5]);
      }
      this.context.strokeStyle = this.color;
      this.context.lineJoin = "round";
      this.context.lineWidth = this.lineWidth;
      this.context.beginPath();
      var p = BDKanvas.getInstance().innerToCanvasPoint(this.geometry.points[0]);
      this.context.moveTo(p.x, p.y);
      for (var i = 1; i < this.geometry.points.length; i++) {
        p = BDKanvas.getInstance().innerToCanvasPoint(this.geometry.points[i]);
        this.context.lineTo(p.x, p.y);
      }
      if (this.closed) {
        p = BDKanvas.getInstance().innerToCanvasPoint(this.geometry.points[0]);
        this.context.lineTo(p.x, p.y);
      }
      if (this.filled){
        this.context.fillStyle = this.fillColor;
        this.context.fill();
      }
      this.context.stroke();
      this.context.setLineDash(oldDash);
    }
  }

  getVersion(){
    return "1_0";
  }

  getType(){
    return "BDKBrush";
  }

  static unserialize1_0(data){
    var line = new BDKBrush(BDKanvasInstance.context, data);
    return line;
  }

  move(dX,dY){
    this.geometry.move(dX,dY);
  }

  getGeometry(){
    return this.geometry;
  }

  scaleOffset(offset){
    this.geometry.scaleOffset(offset);
  }

  containsPoint(p){
    return this.geometry.containsPoint(p, BDKBRUSH_SELECT_TOLERANCE*BDKanvasInstance.getZoom());
  }

  setPropertyValue(pname, val){
    switch (pname) {
      case 'linecolor':
        this.color = val;
        break;
      case 'linewidth':
        this.lineWidth = parseInt(val);
        break;
      case 'closed':
        this.closed = val;
        break;
      case 'dashed':
        this.dashed = val;
        break;
      case 'filled':
        this.filled = val;
        break;
      case 'fillcolor':
        this.fillColor = val;
        break;
    }
  }

  getPropertyValue(pname){
    var result = null;
    switch (pname) {
      case 'linecolor':
        result = this.color;
        break;
      case 'linewidth':
        result = this.lineWidth;
        break;
      case 'closed':
        result = this.closed;
        break;
      case 'dashed':
        result = this.dashed;
        break;
      case 'filled':
        result = this.filled;
        break;
      case 'fillcolor':
        result = this.fillColor;
        break;
    }
    return result;
  }

  describeProperties(){
    return [
      {type: "PropertyColor", name: "linecolor", desc: "Line color", defaultVal: "#000000"},
      {type: "PropertyRange", name: "linewidth", desc: "Line width", min: 0, max: 10, step: 1, defaultVal: 2},
      {type: "PropertyColor", name: "fillcolor", desc: "Fill color", defaultVal: "#000000"},
      {type: "PropertyBoolean", name: "closed", desc: "Closed line", defaultVal: false},
      {type: "PropertyBoolean", name: "filled", desc: "Filled", defaultVal: false},
      {type: "PropertyBoolean", name: "dashed", desc: "Dashed line", defaultVal: false}
    ];
  }

}
