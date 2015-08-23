'use strict';

var UICIRCLE_NUM_POINTS = 60;

class UICircle extends UIElement {
  constructor(circleData) {
    super(circleData);
    if (circleData === null) {
      this.x = 0;
      this.y = 0;
      this.radius = 0;
    } else {
      this.x = circleData.x;
      this.y = circleData.y;
      this.radius = circleData.radius;
    }
  }

  serialize() {
    var result = super.serialize();
    result.x = this.x;
    result.y = this.y;
    result.radius = this.radius;

    return result;
  }

  containsPoint(point, t){
    // Distance to the center is smaller than radius
    var dx2 = (point.x - this.x)*(point.x - this.x);
    var dy2 = (point.y - this.y)*(point.y - this.y);
    var d = Math.sqrt(dx2 + dy2);
    return d <= this.radius;
  }

  resize(radius) {
    this.radius = radius;
  }

  setPos(x, y){
    this.x = x;
    this.y = y;
  }

  move(dX,dY){
    this.x += dX;
    this.y += dY;
  }

  isClosed() {
    return true;
  }

  containsGeometry(g){
    var result = false;
    var i = 0;
    var gpoints = g.getPoints();
    while ((i < gpoints.length) && !result) {
      result = this.containsPoint(gpoints[i]);
      i++;
    }
    return result;
  }

  getPoints(){
    var result = [];

    for (var i = 0; i < UICIRCLE_NUM_POINTS; i++) {
      var p = new Point(
        this.x + this.radius * Math.cos(2 * Math.PI * i / UICIRCLE_NUM_POINTS),
        this.y + this.radius * Math.sin(2 * Math.PI * i / UICIRCLE_NUM_POINTS)
      );
      result.push(p);
    }

    return result;
  }

  getBounds(){
    var bounds = {
      minX: this.x - this.radius,
      minY: this.y - this.radius,
      maxX: this.x + this.radius,
      maxY: this.y + this.radius
    };

    return bounds;
  }

  scaleOffset(offset){
    var center = offset.scaleOffset(new Point(this.x,this.y));
    var newEdge = offset.scaleOffset(new Point(this.x+this.radius,this.y));
    this.setPos(center.x, center.y);
    this.resize(newEdge.x - center.x);
  }
}
