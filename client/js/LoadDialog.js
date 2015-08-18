'use strict';

class LoadDialog extends PropertyDialog{
  constructor(title, w, h, mode)
  {
    super(title, w, h, mode);
  }

  getPropertyDesc()
  {
    return [
      {type: PDIA_TYPE_FILE, name: "file", desc: "Select your file:", readMode: PDIA_READ_TEXT, onLoadFunc: LoadDialog.loadFunc }
    ];
  }

  static loadFunc(filedata){
    var data = JSON.parse(filedata.target.result);
    BDKanvasInstance.load(data, true);
  }

}
