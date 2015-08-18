'use strict';

class ActionCommitBrush extends Action {
  constructor(brush, local, actionUUID) {
    super(actionUUID);
    this.local = local;
    this.brush = brush;
  }

  performAction()
  {
    super.performAction();
    BDKanvasInstance.drawables[this.brush.uuid] = this.brush;
    if (this.local)
    {
      var data = {
        action: "endDrawingBrush",
        uuid: this.brush.uuid,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
  }

  redoAction()
  {
    BDKanvasInstance.drawables[this.brush.uuid] = this.brush;
  }

  undoAction()
  {
    if (this.brush.uuid in BDKanvasInstance.drawables)
    {
      delete BDKanvasInstance.drawables[this.brush.uuid];
    }
  }
}
