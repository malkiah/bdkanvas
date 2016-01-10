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
      BDKanvasInstance.deleteDrawable(this.drawablesUUID[i]);
    }
    BDKanvasInstance.setSelection(null);
  }

  redoAction()
  {
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      BDKanvasInstance.deleteDrawable(this.drawablesUUID[i]);
    }
    BDKanvasInstance.setSelection(null);
  }

  undoAction()
  {
    for (var i = 0; i < this.drawables.length; i++) {
      BDKanvasInstance.addDrawable(this.drawables[i]);
    }
    var s = new BDKSelectionRect(0,0,0,0);
    s.setSelection(this.drawables);
    BDKanvasInstance.setSelection(s);
  }

}
