'use strict';

class UIRect extends UIElement {
  constructor(rectData) {
    super(rectData);
    if (rectData === null) {
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
    } else {
      this.x = rectData.x;
      this.y = rectData.y;
      this.width = rectData.width;
      this.height = rectData.height;
    }
  }

  serialize() {
    var result = super.serialize();
    result.x = this.x;
    result.y = this.y;
    result.height = this.height;
    result.width = this.width;

    return result;
  }

  containsPoint(point, t){
    return (this.x <= point.x) && (point.x <= (this.x + this.width))
        && (this.y <= point.y) && (point.y <= (this.y + this.height));
  }

  resize(w, h) {
    this.height = h;
    this.width = w;
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
    return [
      new Point(this.x, this.y),
      new Point(this.x, this.y + this.height),
      new Point(this.x + this.width, this.y + this.height),
      new Point(this.x + this.width, this.y)
    ]
  }

  getBounds(){
    var bounds = {
      minX: this.x,
      minY: this.y,
      maxX: this.x + this.width,
      maxY: this.y + this.height
    };

    return bounds;
  }

  scaleOffset(offset){
    var min = offset.scaleOffset(new Point(this.x,this.y));
    var max = offset.scaleOffset(new Point(this.x+this.width,this.y+this.height));
    this.setPos(min.x, min.y);
    this.resize(max.x - min.x, max.y - min.y);
  }
}
