'use strict';

var UIL_TOLERANCE = 1;

class UILine extends UIElement
{
  constructor(lineData)
  {
    super(lineData);
    this.points = [];
    if (lineData !== null)
    {
      for (var i = 0; i < lineData.points.length; i++) {
        this.addPoint(new Point(lineData.points[i].x,lineData.points[i].y));
      }
    }
  }

  serialize()
  {
    var result = super.serialize();
    result.points = [];
    for (var i = 0; i < this.points.length; i++) {
      result.points.push(this.points[i].serialize());
    }
    return result;
  }

  addPoint(point)
  {
    var result = false;
    if (this.points.length > 0)
    {
      if ((Math.abs(point.x - this.points[this.points.length- 1].x) >= UIL_TOLERANCE) ||
        (Math.abs(point.y - this.points[this.points.length- 1].y) >= UIL_TOLERANCE))
      {
        this.points.push(point);
        result = true;
      }
    }
    else {
      this.points.push(point);
      result = true;
    }

    return result;
  }

  move(dX,dY){
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].x += dX;
      this.points[i].y += dY;
    }
  }

  isClosed() {
    return false;
  }

  containsGeometry(g){
    return false;
  }

  getPoints(){
    return this.points;
  }

  getBounds(){
    var bounds = {
      minX: 1000000,
      minY: 1000000,
      maxX: 0,
      maxY: 0
    };

    for (var i = 0; i < this.points.length; i++) {
      bounds.minX = (bounds.minX < this.points[i].x)?bounds.minX:this.points[i].x;
      bounds.minY = (bounds.minY < this.points[i].y)?bounds.minY:this.points[i].y;
      bounds.maxX = (bounds.maxX > this.points[i].x)?bounds.maxX:this.points[i].x;
      bounds.maxY = (bounds.maxY > this.points[i].y)?bounds.maxY:this.points[i].y;
    }

    return bounds;
  }

  scaleOffset(offset){
    for (var i = 0; i < this.points.length; i++) {
      this.points[i] = offset.scaleOffset(this.points[i]);
    }
  }

  containsPoint(p, tolerance){
    var result = false;
    var i = 0;
    while ((!result) && (i < this.points.length-1)) {
      result = Utils.pointInSegment(p, this.points[i], this.points[i+1], tolerance);
      i++;
    }

    return result;
  }
}
