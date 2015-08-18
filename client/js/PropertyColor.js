'use strict';

// data: {name, desc, defaultVal}

class PropertyColor extends Property {
  constructor(bundle, data) {
    super(bundle, data);
  }

  createControl(){
    var obj = this;
    this.control = document.createElement("input");
    this.control.type = "color";
    this.control.value = this.data.defaultVal;
    this.changeFunc = function() {
      obj.notifyValueChangedListeners();
      obj.bundle.propertyChanged(obj);
    };
    this.control.addEventListener("change", function(e){
      obj.changeFunc()
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
    this.changeFunc();
  }

  setDisabled(d){
    this.control.disabled = d;
  }

}
