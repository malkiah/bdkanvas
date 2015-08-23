'use strict';

class BDKCircle extends BDKDrawable {
  constructor(context, circleData) {
    super(circleData);
    if (circleData == null)
    {
      this.geometry = new UICircle(null);
      this.color = BDKanvas.getInstance().circleTabBundle.properties["linecolor"].getValue();
      this.lineWidth = BDKanvas.getInstance().circleTabBundle.properties["linewidth"].getValue();
      this.dashed = BDKanvas.getInstance().circleTabBundle.properties["dashed"].getValue();
      this.filled = BDKanvas.getInstance().circleTabBundle.properties["filled"].getValue();
      this.fillColor = BDKanvas.getInstance().circleTabBundle.properties["fillcolor"].getValue();
    }
    else {
      this.geometry = new UICircle(circleData.geometry);
      this.color = circleData.color;
      this.lineWidth = circleData.lineWidth;
      this.dashed = circleData.dashed;
      this.filled = circleData.filled;
      this.fillColor = circleData.fillColor;
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
    this.geometry = new UICircle(gData);
  }

  setCenter(p){
    this.geometry.setPos(p.x, p.y);
  }

  setRadius(r){
    this.geometry.resize(r);
  }

  draw(context){
    var oldDash = this.context.getLineDash();
    if (this.dashed){
      this.context.setLineDash([8,5,2,5]);
    }
    this.context.strokeStyle = this.color;
    this.context.lineJoin = "round";
    this.context.lineWidth = this.lineWidth;
    this.context.beginPath();
    var center = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.x, this.geometry.y));
    var edge = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.x + this.geometry.radius, this.geometry.y));
    this.context.arc(center.x, center.y, edge.x - center.x, 0, 2 * Math.PI, false);
    if (this.filled){
      this.context.fillStyle = this.fillColor;
      this.context.fill();
    }
    this.context.stroke();
    this.context.setLineDash(oldDash);
  }

  getVersion(){
    return "1_0";
  }

  getType(){
    return "BDKCircle";
  }

  static unserialize1_0(data){
    var circle = new BDKCircle(BDKanvasInstance.context, data);
    return circle;
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
    return this.geometry.containsPoint(p, 0);
  }

  setPropertyValue(pname, val){
    switch (pname) {
      case 'linecolor':
        this.color = val;
        break;
      case 'linewidth':
        this.lineWidth = parseInt(val);
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
      {type: "PropertyBoolean", name: "dashed", desc: "Dashed line", defaultVal: false},
      {type: "PropertyBoolean", name: "filled", desc: "Filled", defaultVal: false},
      {type: "PropertyColor", name: "fillcolor", desc: "Fill color", defaultVal: "#000000"}
    ];
  }

}
