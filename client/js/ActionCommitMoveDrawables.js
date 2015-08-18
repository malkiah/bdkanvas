'use strict';

class ActionCommitMoveDrawables extends Action {
  constructor(drawablesUUID, local, actionUUID) {
    super(actionUUID);
    this.drawablesUUID = drawablesUUID;
    this.initialPoint = null;
    this.finalPoint = null;
    this.local = local;
  }

  setInitialPosition(point){
    this.initialPoint = point;
  }

  setFinalPosition(point){
    this.finalPoint = point;
  }

  performAction(){
    super.performAction();
    if (this.local)
    {
      var data = {
        action: "endMovingSelection",
        drawablesUUID: this.drawablesUUID,
        actionUUID: this.uuid,
        initialPoint: {x: this.initialPoint.x, y: this.initialPoint.y},
        finalPoint: {x: this.finalPoint.x, y: this.finalPoint.y}
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
    else {
      for (var i = 0; i < this.drawablesUUID.length; i++) {
        BDKanvasInstance.drawables[this.drawablesUUID[i]].move(
          this.finalPoint.x - this.initialPoint.x,
          this.finalPoint.y - this.initialPoint.y
        );
      }
    }
  }

  redoAction()
  {
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      BDKanvasInstance.drawables[this.drawablesUUID[i]].move(
        this.finalPoint.x - this.initialPoint.x,
        this.finalPoint.y - this.initialPoint.y
      );
    }
  }

  undoAction()
  {
    for (var i = 0; i < this.drawablesUUID.length; i++) {
      BDKanvasInstance.drawables[this.drawablesUUID[i]].move(
        this.initialPoint.x - this.finalPoint.x,
        this.initialPoint.y - this.finalPoint.y
      );
    }
  }
}
