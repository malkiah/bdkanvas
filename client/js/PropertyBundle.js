'use strict';

class PropertyBundle {
  constructor() {
    this.properties = {};
    this.changeListeners = [];
  }

  createProperty(type, data){
    var obj = this;
    var str = "new " + type + "(obj,data);"
    var p = eval(str);
    this.properties[p.data.name] = p;
  };

  removeProperty(name){
    if (name in this.properties){
      delete this.properties[name];
    }
  }

  propertyChanged(p){
    for (var i = 0; i < this.changeListeners.length; i++) {
      this.changeListeners[i](p);
    }
  }

  addPropertyChangedListener(l){
    this.changeListeners.push(l);
  }

  removePropertyChangedListener(l){
    var pos = this.changeListeners.indexOf(l);
    if (pos >= 0){
      this.changeListeners.splice(pos, 1);
    }
  }
}
