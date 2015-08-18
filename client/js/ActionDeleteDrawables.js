'use strict';

class ActionDeleteDrawables extends Action {
  constructor(drawablesUUID, local, actionUUID) {
    super(actionUUID);
    this.drawablesUUID = drawablesUUID;
    this.local = local;
    this.drawables = [];
  }

  performAction(){
    super.performAction();
    if (this.local)
    {
      var data = {
        action: "deleteDrawables",
        drawablesUUID: this.drawablesUUID,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      this.drawables.push(BDKanvasInstance.drawables[this.drawablesUUID[i]]);
      delete BDKanvasInstance.drawables[this.drawablesUUID[i]];
    }
  }

  redoAction()
  {
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      delete BDKanvasInstance.drawables[this.drawablesUUID[i]];
    }
  }

  undoAction()
  {
    for (var i = 0; i < this.drawables.length; i++) {
      BDKanvasInstance.drawables[this.drawables[i].uuid] = this.drawables[i];
    }
  }

}
