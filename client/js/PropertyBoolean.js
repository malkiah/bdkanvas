'use strict';

// Data {name, desc, defaultVal}

class PropertyBoolean extends Property {
  constructor(bundle, data) {
    super(bundle, data);
  }

  createControl(){
    var obj = this;
    this.control = document.createElement("input");
    this.control.type = "checkbox";
    this.control.checked = this.data.defaultVal;
    this.control.addEventListener("change",function(e){
      obj.bundle.propertyChanged(obj);
    });
  }

  getControl() {
    return this.control;
  }

  hasValue(){
    return true;
  }

  getValue(){
    return this.control.checked;
  }

  setValue(val){
    this.control.checked = val;
    this.bundle.propertyChanged(this);
  }

  setDisabled(d){
    this.control.disabled = d;
  }

}
