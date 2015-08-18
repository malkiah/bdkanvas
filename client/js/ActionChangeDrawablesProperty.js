'use strict';

class ActionChangeDrawablesProperty extends Action {
  constructor(drawablesUUID, pname, pvalue, local, actionUUID) {
    super(actionUUID);
    this.local = local;
    this.drawablesUUID = drawablesUUID;
    this.pname = pname;
    this.pvalue = pvalue;
    this.preValues = {};
    for (var i = 0; i < drawablesUUID.length; i++) {
      var uuid = drawablesUUID[i];
      this.preValues[uuid] = BDKanvasInstance.drawables[uuid].getPropertyValue(pname);
    }
  }

  performAction()
  {
    super.performAction();
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      var uuid = this.drawablesUUID[i];
      BDKanvasInstance.drawables[uuid].setPropertyValue(this.pname, this.pvalue);
    }
    if (this.local)
    {
      var data = {
        action: "changeDrawablesProperty",
        drawablesUUID: this.drawablesUUID,
        pname: this.pname,
        pvalue: this.pvalue,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
  }

  redoAction()
  {
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      var uuid = this.drawablesUUID[i];
      BDKanvasInstance.drawables[uuid].setPropertyValue(this.pname, this.pvalue);
    }
  }

  undoAction()
  {
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      var uuid = this.drawablesUUID[i];
      BDKanvasInstance.drawables[uuid].setPropertyValue(this.pname, this.preValues[uuid]);
    }
  }

}
