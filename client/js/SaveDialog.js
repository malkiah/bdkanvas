'use strict';

class SaveDialog extends PropertyDialog {
  constructor(title, w, h, mode) {
    super(title, w, h, mode);
  }

  getPropertyDesc() {
    return [
      {type: PDIA_TYPE_TXT, name: "filename", desc: "File name:", defaultVal: "kanvas.json"}
    ];
  }

  globalOkFunc() {
    var filename = this.propertyData.filename.value;
    BDKanvas.getInstance().save(filename);
  }

  setFileName(filename){
    this.propertyData.filename.value = filename;
  }
}
