'use strict';

var BDKLINE_SELECT_TOLERANCE = 5;
var BDKLINE_ARROW_LENGTH = 13;

class BDKLine extends BDKDrawable {
  constructor(context, lineData) {
    super(lineData);
    if (lineData == null)
    {
      this.geometry = UIManager.getInstance().createLineElement(null);
      this.geometry.addPoint(new Point(0,0));
      this.geometry.addPoint(new Point(1,1));
      this.color = BDKanvas.getInstance().lineTabBundle.properties["linecolor"].getValue();
      this.lineWidth = BDKanvas.getInstance().lineTabBundle.properties["linewidth"].getValue();
      this.dashed = BDKanvas.getInstance().lineTabBundle.properties["dashed"].getValue();
      this.arrowIni = BDKanvas.getInstance().lineTabBundle.properties["arrowini"].getValue();
      this.arrowEnd = BDKanvas.getInstance().lineTabBundle.properties["arrowend"].getValue();
    }
    else {
      this.geometry = UIManager.getInstance().createLineElement(lineData.geometry);
      this.color = lineData.color;
      this.lineWidth = lineData.lineWidth;
      this.dashed = lineData.dashed;
      this.arrowIni = lineData.arrowIni;
      this.arrowEnd = lineData.arrowEnd;
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
    result.arrowIni = this.arrowIni;
    result.arrowEnd = this.arrowEnd;
    result.geometry = this.geometry.serialize();

    return result;
  }

  serializeGeometry(){
    return this.geometry.serialize();
  }

  unserializeGeometry(gData){
    this.geometry = new UILine(gData);
    BDKanvas.getInstance().dirty = true;
  }

  setPoints(p1,p2){
    this.geometry.points[0] = p1;
    this.geometry.points[1] = p2;
    BDKanvas.getInstance().dirty = true;
  }

  draw(context)
  {
    var p1 = BDKanvas.getInstance().innerToCanvasPoint(this.geometry.points[0]);
    var p2 = BDKanvas.getInstance().innerToCanvasPoint(this.geometry.points[1]);
    var l1 = p1;
    var l2 = p2;
    if (this.arrowIni){
      this.context.fillStyle = this.color;
      var dir = new Point(p1.x - p2.x, p1.y - p2.y);
      var mod = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
      dir.x /= mod;
      dir.y /= mod;
      var base = new Point(
        p1.x - dir.x * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth)),
        p1.y - dir.y * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth))
      );
      l1 = new Point(
        p1.x - dir.x * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth) - 5),
        p1.y - dir.y * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth) - 5)
      );
      var t1 = Utils.rotatePoint(p1, base, Math.PI / 6.0);
      var t2 = Utils.rotatePoint(p1, base, -Math.PI / 6.0);
      this.context.beginPath();
      this.context.moveTo(p1.x, p1.y);
      this.context.lineTo(t1.x, t1.y);
      this.context.lineTo(t2.x, t2.y);
      this.context.fill();
    }
    if (this.arrowEnd){
      this.context.fillStyle = this.color;
      var dir = new Point(p2.x - p1.x, p2.y - p1.y);
      var mod = Math.sqrt(dir.x*dir.x + dir.y*dir.y);
      dir.x /= mod;
      dir.y /= mod;
      var base = new Point(
        p2.x - dir.x * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth)),
        p2.y - dir.y * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth))
      );
      l2 = new Point(
        p2.x - dir.x * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth) - 5),
        p2.y - dir.y * (BDKLINE_ARROW_LENGTH + parseInt(this.lineWidth) - 5)
      );
      var t1 = Utils.rotatePoint(p2, base, Math.PI / 6.0);
      var t2 = Utils.rotatePoint(p2, base, -Math.PI / 6.0);
      this.context.beginPath();
      this.context.moveTo(p2.x, p2.y);
      this.context.lineTo(t1.x, t1.y);
      this.context.lineTo(t2.x, t2.y);
      this.context.fill();
    }
    var oldDash = this.context.getLineDash();
    if (this.dashed){
      this.context.setLineDash([8,5,2,5]);
    }
    this.context.strokeStyle = this.color;
    this.context.lineJoin = "round";
    this.context.lineWidth = this.lineWidth;
    this.context.beginPath();
    this.context.moveTo(l1.x, l1.y);
    this.context.lineTo(l2.x, l2.y);
    this.context.stroke();
    this.context.setLineDash(oldDash);
  }

  getVersion(){
    return "1_0";
  }

  getType(){
    return "BDKLine";
  }

  static unserialize1_0(data){
    var line = new BDKLine(BDKanvasInstance.context, data);
    return line;
  }

  move(dX,dY){
    this.geometry.move(dX,dY);
    BDKanvas.getInstance().dirty = true;
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
      case 'dashed':
        this.dashed = val;
        break;
      case 'arrowini':
        this.arrowIni = val;
        break;
      case 'arrowend':
        this.arrowEnd = val;
        break;
    }
    BDKanvas.getInstance().dirty = true;
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
      case 'arrowini':
        result = this.arrowIni;
        break;
      case 'arrowend':
        result = this.arrowEnd;
        break;
    }
    return result;
  }

  describeProperties(){
    return [
      {type: "PropertyColor", name: "linecolor", desc: "Line color", defaultVal: "#000000"},
      {type: "PropertyRange", name: "linewidth", desc: "Line width", min: 0, max: 10, step: 1, defaultVal: 2},
      {type: "PropertyBoolean", name: "dashed", desc: "Dashed line", defaultVal: false},
      {type: "PropertyBoolean", name: "arrowini", desc: "Initial arrow", defaultVal: false},
      {type: "PropertyBoolean", name: "arrowend", desc: "Final arrow", defaultVal: false}
    ];
  }
}
