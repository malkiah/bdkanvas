'use strict';

// Data {name, desc, defaultVal}

class PropertyPass extends Property {
  constructor(bundle, data) {
    super(bundle, data);
  }

  createControl(){
    var obj = this;
    this.control = document.createElement("input");
    this.control.type = "password";
    this.control.value = this.data.defaultVal;
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
    return this.control.value;
  }

  setValue(val){
    this.control.value = val;
    this.bundle.propertyChanged(this);
  }

  setDisabled(d){
    this.control.disabled = d;
  }

}
