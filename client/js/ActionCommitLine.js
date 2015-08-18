'use strict';

class ActionCommitLine extends Action {
  constructor(line, local, actionUUID) {
    super(actionUUID);
    this.local = local;
    this.line = line;
  }

  performAction()
  {
    super.performAction();
    BDKanvasInstance.drawables[this.line.uuid] = this.line;
    if (this.local)
    {
      var data = {
        action: "endDrawingLine",
        uuid: this.line.uuid,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
  }

  redoAction()
  {
    BDKanvasInstance.drawables[this.line.uuid] = this.line;
  }

  undoAction()
  {
    if (this.line.uuid in BDKanvasInstance.drawables)
    {
      delete BDKanvasInstance.drawables[this.line.uuid];
    }
  }
}
