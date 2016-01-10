'use strict';

var SCALE_RECT_WIDTH = 10;
var SCALE_RECT_HEIGHT = 10;

class BDKSelectionRect extends BDKSelection {
  constructor(x,y,w,h) {
    super();
    this.geometry = new UIRect(null);
    this.geometry.setPos(x,y);
    this.geometry.resize(w,h);
  }

  selectDrawables(){
    var sel = [];
    for (var uuid in BDKanvasInstance.drawables) {
      if (BDKanvasInstance.drawables.hasOwnProperty(uuid)) {
        var d = BDKanvasInstance.drawables[uuid];
        var dg = d.getGeometry();
        var overlaps = this.geometry.containsGeometry(dg);
        if (!overlaps && dg.isClosed()) {
          overlaps = dg.containsGeometry(this.geometry);
        }
        if (overlaps) {
          sel.push(d);
        }
      }
    }
    this.setSelection(sel);
  }

  resize(w,h){
    this.geometry.resize(w,h);
    BDKanvas.getInstance().dirty = true;
  }

  pointInScaleRect(p){
    var minX =  this.geometry.x + this.geometry.width;
    var minY =  this.geometry.y + this.geometry.height;
    var maxX =  minX + SCALE_RECT_WIDTH*BDKanvasInstance.getZoom();
    var maxY =  minY + SCALE_RECT_HEIGHT*BDKanvasInstance.getZoom();

    return (minX <= p.x) && (p.x <= maxX) && (minY <= p.y) && (p.y <= maxY);
  }

  draw(context){
    context.strokeStyle = "#8888ff";
    context.lineWidth = 2;
    var oldDash = context.getLineDash();
    context.setLineDash([2,2]);
    var ipxy = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.x, this.geometry.y));
    var ipwh = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.x + this.geometry.width, this.geometry.y + this.geometry.height));
    context.strokeRect(ipxy.x, ipxy.y, ipwh.x-ipxy.x, ipwh.y-ipxy.y);
    context.setLineDash(oldDash);
    context.fillStyle = "#8888ff";
    context.fillRect(ipwh.x,ipwh.y,SCALE_RECT_WIDTH,SCALE_RECT_HEIGHT);
  }

  setSelection(s){
    super.setSelection(s);
    if (s.length > 0) {
      var minX = 1000000;
      var minY = 1000000;
      var maxX = 0;
      var maxY = 0;
      for (var i = 0; i < this.selection.length; i++) {
        var bounds = this.selection[i].getGeometry().getBounds();
        minX = (minX < bounds.minX)?minX:bounds.minX;
        minY = (minY < bounds.minY)?minY:bounds.minY;
        maxX = (maxX > bounds.maxX)?maxX:bounds.maxX;
        maxY = (maxY > bounds.maxY)?maxY:bounds.maxY;
      }
      this.geometry = new UIRect(null);
      this.geometry.setPos(minX, minY);
      this.geometry.resize(maxX - minX, maxY - minY);
    }
    BDKanvas.getInstance().dirty = true;
  }
}
