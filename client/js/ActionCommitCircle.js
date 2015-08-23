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
    BDKanvasInstance.drawables[this.circle.uuid] = this.circle;
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
    BDKanvasInstance.drawables[this.circle.uuid] = this.circle;
  }

  undoAction()
  {
    if (this.circle.uuid in BDKanvasInstance.drawables)
    {
      delete BDKanvasInstance.drawables[this.circle.uuid];
    }
  }
}
