'use strict';

class BDKDrawable
{
  constructor(drawableData){
    if (drawableData === null)
    {
      this.uuid = Utils.generateUUID();
    }
    else {
      this.uuid = drawableData.uuid;
    }
  }

  resetUUID(){
    this.uuid = Utils.generateUUID();
  }

  draw(context){
    alert("Method must be redefined.");
  }

  getType(){
    alert("Method must be redefined.");
  }

  getVersion(){
    alert("Method must be redefined.");
  }

  move(dX, dY){
    alert("Method must be redefined.");
  }

  serialize(){
    var result = {};
    result.uuid = this.uuid;
    result.drawableType = this.getType();
    result.drawableVersion = this.getVersion();

    return result;
  }

  serializeGeometry(){

  }

  unserializeGeometry(gData){

  }

  getGeometry(){
    alert("Method must be redefined.");
  }

  scaleOffset(offset){

  }

  containsPoint(p){
    return false;
  }

  setPropertyValue(pname, val){

  }

  getPropertyValue(pname){

  }

  describeProperties(){

  }
}
