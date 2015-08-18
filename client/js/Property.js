'use strict';

// data: {name, desc}

class Property {
  constructor(bundle, data) {
    this.valueChangedListeners = [];
    this.bundle = bundle;
    this.data = data;
    this.showFunc = function(){};
    this.acceptFunc = function(){};
    this.cancelFunc = function(){};
    this.changeFunc = function(){};

    this.createControl();
  }

  createControl(){

  }

  getControl() {

  }

  hasValue(){

  }

  getValue(){

  }

  setValue(val){

  }

  notifyValueChangedListeners(){
    for (var i = 0; i < this.valueChangedListeners.length; i++) {
      this.valueChangedListeners[i].notifiValueChanged(self);
    }
  }

  addValueChangedListener(listener){
    this.valueChangedListeners.push(listener);
  }

  removeValueChangedListener(listener){
    var i = this.valueChangedListeners.indexOf(listener);
    if (i >= 0){
      this.valueChangedListeners.splice(i,1);
    }
  }

  setDisabled(d){
    
  }
}
