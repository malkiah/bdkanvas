'use strict';

class ActionPasteDrawables extends Action {
  constructor(drawables, local, actionUUID) {
    super(actionUUID);
    this.local = local;
    this.drawables = drawables;
    this.selection = new BDKSelectionRect();
    this.selection.setSelection(this.drawables);
    this.prevSelection = BDKanvasInstance.selection;
  }

  performAction(){
    super.performAction();
    for (var i = 0; i < this.drawables.length; i++) {
      BDKanvasInstance.addDrawable(this.drawables[i]);
    }

    if (this.local)
    {
      BDKanvasInstance.setSelection(this.selection);
      BDKanvasInstance.processEvent(SMKV_EVENT_SELECTRECTBTN, null);
      var dData = [];
      for (var i = 0; i < this.drawables.length; i++) {
        dData.push(this.drawables[i].serialize());
      }
      var data = {
        action: "pasteDrawables",
        drawablesData: dData,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
  }

  redoAction(){
    for (var i = 0; i < this.drawables.length; i++) {
      BDKanvasInstance.addDrawable(this.drawables[i]);
    }
    if (this.local)
    {
      BDKanvasInstance.setSelection(this.selection);
      BDKanvasInstance.processEvent(SMKV_EVENT_SELECTRECTBTN, null);
    }
  }

  undoAction(){
    for (var i = 0; i < this.drawables.length; i++) {
      BDKanvasInstance.deleteDrawable(this.drawables[i].uuid);
    }
    if (this.local){
      BDKanvasInstance.setSelection(this.prevSelection);
      BDKanvasInstance.processEvent(SMKV_EVENT_SELECTRECTBTN, null);
    }
  }

}
