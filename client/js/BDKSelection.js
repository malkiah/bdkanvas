'use strict';

class BDKSelection {
  constructor() {
    this.geometry = null;
    this.selection = [];
    this.selectionListeners = [];
    this.addSelectionListener(function(sel){
      BDKanvasInstance.redoSelectionTab(sel);
  });
  }

  selectDrawables(){
    // Redefine
  }

  resize(w,h){
    // Redefine
  }

  move(dX, dY){
    this.geometry.move(dX, dY);
    for (var i = 0; i < this.selection.length; i++) {
      this.selection[i].move(dX,dY);
    }
  }

  draw(context){
    context.strokeStyle = "#8888ff";
    context.lineWidth = 2;
    context.setLineDash([2,2]);
    var ipxy = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.x, this.geometry.y));
    var ipwh = BDKanvasInstance.innerToCanvasPoint(new Point(this.geometry.width, this.geometry.height));
    context.strokeRect(ipxy.x, ipxy.y, ipwh.x, ipwh.y);
  }

  serialize(){
    var data = [];
    for (var i = 0; i < this.selection.length; i++) {
      data.push(this.selection[i].serialize());
    }

    return data;
  }

  scaleSelectedOffset(offset){
    for (var i = 0; i < this.selection.length; i++) {
      this.selection[i].scaleOffset(offset);
    }
  }

  setSelection(s){
    this.selection = s;
    this.notifySelectionListeners();
    BDKanvas.getInstance().dirty = true;
  }

  selectDrawables(){
    // Redefine and call setSelection
  }

  addSelectionListener(sl){
    this.selectionListeners.push(sl);
  }

  removeSelectionListener(sl){
    var i = this.selectionListeners.indexOf(sl);
    if (i >= 0){
      this.selectionListeners.splice(i,1);
    }
  }

  notifySelectionListeners(){
    for (var i = 0; i < this.selectionListeners.length; i++) {
      this.selectionListeners[i](this);
    }
  }
}
