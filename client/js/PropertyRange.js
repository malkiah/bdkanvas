'use strict';

// data: {name, desc, min, max,step, defaultVal}

class PropertyRange extends Property {
  constructor(bundle, data) {
    super(bundle, data);
  }

  createControl(){
    var obj = this;
    this.control = document.createElement("div");

    this.rcontrol = document.createElement("input");
    this.rcontrol.type = "range";
    this.rcontrol.className = "sectiontabrange";
    this.rcontrol.max = this.data.max;
    this.rcontrol.min = this.data.min;
    this.rcontrol.step = this.data.step;
    this.rcontrol.value = this.data.defaultVal;

    this.plusbutton = document.createElement("input");
    this.plusbutton.type = "button";
    this.plusbutton.className = "sectiontabrangebtn";
    this.plusbutton.value = "+";
    this.plusbutton.addEventListener("click", function(e){
      obj.rcontrol.value = parseInt(obj.rcontrol.value) + parseInt(obj.rcontrol.step);
      obj.rnumber.value = obj.rcontrol.value;
      obj.bundle.propertyChanged(obj);
    });

    this.minusbutton = document.createElement("input");
    this.minusbutton.type = "button";
    this.minusbutton.className = "sectiontabrangebtn";
    this.minusbutton.value = "-";
    this.minusbutton.addEventListener("click", function(e){
      obj.rcontrol.value = parseInt(obj.rcontrol.value) - parseInt(obj.rcontrol.step);
      obj.rnumber.value = obj.rcontrol.value;
      obj.bundle.propertyChanged(obj);
    });

    this.rnumber =  document.createElement("input");
    this.rnumber.type = "text";
    this.rnumber.className = "sectiontabrangetxt";
    this.rnumber.readonly = "true";
    this.rnumber.value = this.data.defaultVal;

    this.rcontrol.addEventListener("change", function(e){
      obj.rnumber.value = obj.rcontrol.value;
      obj.bundle.propertyChanged(obj);
    });

    this.control.appendChild(this.minusbutton);
    this.control.appendChild(this.rcontrol);
    this.control.appendChild(this.plusbutton);
    this.control.appendChild(this.rnumber);
  }

  getControl() {
    return this.control;
  }

  hasValue(){
    return true;
  }

  getValue(){
    return parseInt(this.rcontrol.value);
  }

  setValue(val){
    this.rcontrol.value = val;
    this.rnumber.value = val;
    this.bundle.propertyChanged(this);
  }

  setDisabled(d){
    this.rcontrol.disabled = d;
    this.rnumber.disabled = d;
    this.minusbutton.disabled = d;
    this.plusbutton.disabled = d;
  }
}
