'use strict';

class ActionCommitCircle extends Action {
  constructor(circle, local, actionUUID) {
    super(actionUUID);
    this.local = local;
    this.circle = circle;
  }

  performAction()
  {
    super.performAction();
    BDKanvasInstance.addDrawable(this.circle);
    if (this.local)
    {
      var data = {
        action: "endDrawingCircle",
        uuid: this.circle.uuid,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
  }

  redoAction()
  {
    BDKanvasInstance.addDrawable(this.circle);
  }

  undoAction()
  {
    if (this.circle.uuid in BDKanvasInstance.drawables)
    {
      BDKanvasInstance.deleteDrawable(this.circle.uuid);
    }
  }
}
