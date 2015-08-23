'use strict';

class OffsetController {
  constructor(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.initialWidth = w;
    this.initialHeight = h;
    this.width = w;
    this.height = h;
    this.lastWidth = w;
    this.lastHeight = h;
    this.dx = 0;
    this.dy = 0;
    this.lastX = x+w;
    this.lastY = y+h;
  }

  moveTo(x,y){
    this.dx = x - this.lastX;
    this.dy = y - this.lastY;
    this.lastWidth = this.width;
    this.lastHeight = this.height;
    this.width = x - this.x;
    this.height = y - this.y;
    this.lastX = x;
    this.lastY = y;
  }

  normalize(){
    if (this.width < 0){
      this.x += this.width;
      this.width *= -1;
    }
    if (this.height < 0){
      this.y += this.height;
      this.height *= -1;
    }
  }

  getInitialPos(){
    return new Point(this.x, this.y);
  }

  getFinalPos(){
    return new Point(this.x + this.width, this.y + this.height);
  }

  getLastOffset(){
    return {
      dx: this.dx,
      dy: this.dy
    }
  }

  getSize(){
    return {
      width: this.width,
      height: this.height
    }
  }

  scaleOffset(point){
    return new Point(
      this.x + (point.x - this.x)/(this.lastWidth - this.dx)*this.lastWidth,
      this.y + (point.y - this.y)/(this.lastHeight - this.dy)*this.lastHeight
    );
  }

  getLength(point){
    return Math.sqrt(this.width * this.width + this.height * this.height);
  }
}
