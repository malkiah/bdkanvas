'use strict';

class InsertImageDialog extends PropertyDialog{
  constructor(title, w, h, mode)
  {
    super(title, w, h, mode);
  }

  getPropertyDesc()
  {
    return [
      {type: PDIA_TYPE_FILE, name: "file", desc: "Select your file:", readMode: PDIA_READ_DATAURL, onLoadFunc: InsertImageDialog.loadFunc }
    ];
  }

  static loadFunc(filedata){
    var img = new Image();
    img.src = filedata.target.result;
    var  bdkimg = new BDKImage(BDKanvasInstance.context, null);
    bdkimg.setImage(img);
    var action = new ActionCommitImage(bdkimg, true, null);
    action.performAction();
  }

}
