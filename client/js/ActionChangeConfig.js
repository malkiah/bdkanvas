'use strict';

class ActionChangeConfig extends Action {
  constructor(oldConfig, newConfig, local, actionUUID) {
    super(actionUUID);
    this.oldConfig = oldConfig;
    this.newConfig = newConfig;
    this.local = local;
  }

  changeConfig(data)
  {
    BDKanvas.getInstance().setConfigValue("lineGap",data.lineGap);
    BDKanvas.getInstance().setConfigValue("lineColor",data.lineColor);
    BDKanvas.getInstance().setConfigValue("lineTextColor",data.lineTextColor);
    BDKanvas.getInstance().setConfigValue("backgroundColor",data.backgroundColor);
    BDKanvas.getInstance().setConfigValue("columnNumber",data.columnNumber);
    BDKanvas.getInstance().dirty = true;
  }

  performAction(){
    super.performAction();
    if (this.local)
    {
      var data = {
        action: "changeConfig",
        oldConfig: this.oldConfig,
        newConfig: this.newConfig,
        actionUUID: this.uuid
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    } else {
      this.changeConfig(this.newConfig);
    }
  }

  redoAction(){
    this.changeConfig(this.newConfig);
  }

  undoAction(){
    this.changeConfig(this.oldConfig);
  }

}
