'use strict';

class UIElement
{
  constructor(data)
  {
    if (data === null) {
      this.uuid = Utils.generateUUID();
    } else {
      this.uuid = data.uuid;
    }
  }

  resetUUID(){
    this.uuid = Utils.generateUUID();
  }

  containsPoint(point, tolerance){
    alert("Method must be redefined.");
  }

  containsGeometry(g) {
    alert("Method must be redefined.");
  }

  serialize()
  {
    var result = {};
    result.uuid = this.uuid;
    return result;
  }

  move(dX,dY){
    // Must be redefined
  }

  isClosed(){
    // Must be redefined
  }

  getPoints(){
    // Must be redefined
  }

  getBounds(){
    // Must be redefined
  }

  scaleOffset(offset){
    // Must be redefined
  }
}
