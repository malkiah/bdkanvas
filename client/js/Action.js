'use strict';

class Action {
  constructor(uuid) {
    if (uuid !== null)
    {
      this.uuid = uuid;
    }
    else {
      this.uuid = Utils.generateUUID();      
    }
  }

  performAction(){
    actionStackInstance.actionDone(this);
  }

  undoAction(){
  }

  redoAction(){
  }
}
