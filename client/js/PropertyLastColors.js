'use strict';

// data: {name, desc, linkedTo}

class PropertyLastColors extends Property {
  constructor(bundle, data) {
    super(bundle, data);
    this.buttons = [];
  }

  redoLastColors(){
    var obj = this;
    this.buttons = [];
    while (this.control.firstChild)
    {
      this.control.removeChild(this.control.firstChild);
    }
    for (var i = 0; i < this.value.length; i++) {
      var colorBtn = document.createElement("button");
      colorBtn.className = "sectiontablastcolor";
      colorBtn.style.backgroundColor = this.value[i];
      colorBtn.innerHTML = i;
      colorBtn.value = this.value[i];
      colorBtn.addEventListener("click",function(e){
        obj.bundle.properties[obj.data.linkedTo].setValue(e.srcElement.value);
        obj.setNewFirstColor(e.srcElement.value);
      });
      this.buttons.push(colorBtn);
      this.control.appendChild(colorBtn);
    }
  }

  setNewFirstColor(color){
    var pos = this.findColorPos(color);
    if (pos === -1) {
      this.value.pop();
    } else {
      this.value.splice(pos,1);
    }
    this.value.unshift(color);
    this.redoLastColors();
  }

  findColorPos(color){
    var pos = 0;
    var result = -1;
    var found = false;
    while ((pos < this.value.length) && (!found)) {
      if (this.value[pos] == color){
        found = true;
        result = pos;
      } else {
        pos ++;
      }
    }

    return result;
  }

  createControl(){
    var obj = this;
    this.value = [this.bundle.properties[this.data.linkedTo].getValue(),'#ff0000',"#00aa00",'#0000ff','#ff00ff'];
    this.control = document.createElement("div");
    this.redoLastColors();
    this.bundle.properties[this.data.linkedTo].getControl().addEventListener('change', function(e){
      obj.setNewFirstColor(obj.bundle.properties[obj.data.linkedTo].getValue());
    });
  }

  getControl() {
    return this.control;
  }

  hasValue(){
    return false;
  }

  setDisabled(d){
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].disabled = d;
    }
  }
}
