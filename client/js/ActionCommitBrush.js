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
    if (this.local)
    {
      var data = {
        action: "commitBrush",
        uuid: this.brush.uuid,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
  }

  redoAction()
  {
    BDKanvasInstance.addDrawable(this.brush);
  }

  undoAction()
  {
    if (this.brush.uuid in BDKanvasInstance.drawables)
    {
      BDKanvasInstance.deleteDrawable(this.brush.uuid);
    }
  }
}
