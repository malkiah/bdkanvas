'use strict';

class BDKImage extends BDKDrawable
{
  constructor(context, imageData) {
    super(imageData);
    if (imageData === null)
    {
      this.image = null;
      this.geometry = new UIRect(null);
      this.geometry.setPos(BDKanvasInstance.scrollX,BDKanvasInstance.scrollY);
      this.geometry.resize(BDKanvasInstance.configuration.lineGap,BDKanvasInstance.configuration.lineGap);
      this.maintainAspect = true;
    }
    else {
      this.geometry = new UIRect(imageData.geometry);
      this.image = new Image();
      this.image.src = imageData.src;
      this.maintainAspect = imageData.maintainAspect;
    }
    this.context = context;
  }

  setImage(img){
    this.image = img;
  }

  resetUUID(){
    super.resetUUID();
    this.geometry.resetUUID();
  }

  serialize() {
    var result = super.serialize();
    result.geometry = this.geometry.serialize();
    result.src = this.image.src;
    result.maintainAspect = this.maintainAspect;

    return result;
  }

  serializeGeometry(){
    return this.geometry.serialize();
  }

  unserializeGeometry(gData){
    this.geometry = new UIRect(gData);
  }

  draw(context) {
    var ipxy = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.x, this.geometry.y));
    var ipwh = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.x + this.geometry.width, this.geometry.y + this.geometry.height));
    var w = ipwh.x - ipxy.x;
    var h = ipwh.y - ipxy.y;
    if (this.maintainAspect){
      var imgW = this.image.width;
      var imgH = this.image.height;
      var geoRatio = w  / h;
      var imgRatio = imgW / imgH;
      if (geoRatio !== imgRatio) {
        if (geoRatio > imgRatio){
          w = h * imgRatio;
        } else {
          h = w / imgRatio;
        }
      }
    }
    context.drawImage(this.image,ipxy.x,ipxy.y,w,h);
  }

  getVersion(){
    return "1_0";
  }

  getType(){
    return "BDKImage";
  }

  static unserialize1_0(data){
    var line = new BDKImage(BDKanvasInstance.context, data);
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
    return this.geometry.containsPoint(p, 0);
  }

  setPropertyValue(pname, val){
    switch (pname) {
      case 'maintainaspect':
        this.maintainAspect = val;
        break;
    }
  }

  getPropertyValue(pname){
    var result = null;
    switch (pname) {
      case 'maintainaspect':
        result = this.maintainAspect;
        break;
    }
    return result;
  }

  describeProperties(){
    return [
      {type: "PropertyBoolean", name: "maintainaspect", desc: "Maintain Aspect", defaultVal: true}
    ];
  }

}
