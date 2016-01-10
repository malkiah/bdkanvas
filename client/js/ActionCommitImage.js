'use strict';

class ActionCommitImage extends Action {
  constructor(image, local, actionUUID) {
    super(actionUUID);
    this.local = local;
    this.image = image;
    this.selection = new BDKSelectionRect();
    this.selection.setSelection([this.image]);
  }

  performAction()
  {
    super.performAction();
    BDKanvasInstance.addDrawable(this.image);
    if (this.local)
    {
      BDKanvasInstance.setSelection(this.selection);
      BDKanvasInstance.processEvent(SMKV_EVENT_SELECTRECTBTN, null);
      var data = {
        action: "commitImage",
        actionUUID: this.uuid,
        imageData: this.image.serialize()
      };
      BDKanvasInstance.client.processEvent(SMC_EVENT_SEND_ACTION, data);
    }
  }

  redoAction()
  {
    BDKanvasInstance.addDrawable(this.image);
  }

  undoAction()
  {
    if (this.image.uuid in BDKanvasInstance.drawables)
    {
      BDKanvasInstance.deleteDrawable(this.image.uuid);
    }
  }
}
