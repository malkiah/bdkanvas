'use strict';

class ActionCommitScaleSelection extends Action {
  constructor(local, actionUUID) {
    super(actionUUID);
    this.preDrawablesGData = null;
    this.postDrawablesGData = null;
    this.local = local;
  }

  setPreDrawablesGData(preDrawablesGData){
    this.preDrawablesGData = preDrawablesGData;
  }

  setPostDrawablesGData(postDrawablesGData){
    this.postDrawablesGData = postDrawablesGData;
  }

  performAction(){
    super.performAction();
    if (this.local)
    {
      var data = {
        action: "scaleDrawables",
        actionUUID: this.uuid,
        preDrawablesGData: this.preDrawablesGData,
        postDrawablesGData: this.postDrawablesGData
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
    else {
      for (var uuid in this.postDrawablesGData) {
        if (this.postDrawablesGData.hasOwnProperty(uuid)) {
          BDKanvasInstance.drawables[uuid].unserializeGeometry(this.postDrawablesGData[uuid]);
        }
      }
    }
  }

  redoAction()
  {
    for (var uuid in this.postDrawablesGData) {
      if (this.postDrawablesGData.hasOwnProperty(uuid)) {
        BDKanvasInstance.drawables[uuid].unserializeGeometry(this.postDrawablesGData[uuid]);
      }
    }
  }

  undoAction()
  {
    for (var uuid in this.preDrawablesGData) {
      if (this.preDrawablesGData.hasOwnProperty(uuid)) {
        BDKanvasInstance.drawables[uuid].unserializeGeometry(this.preDrawablesGData[uuid]);
      }
    }
  }
}
