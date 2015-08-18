'use strict';

class ConnectDialog extends PropertyDialog
{
  constructor(title, w, h, mode)
  {
    super(title, w, h, mode);
  }

  getPropertyDesc()
  {
    return [
      {type: PDIA_TYPE_TXT, name: "url", desc: "URL:", defaultVal: "ws://" + window.location.host + ":8888/bdks"},
      {type: PDIA_TYPE_TXT, name: "sid", desc: "Session ID:", defaultVal: "test"}
    ];
  }

  globalOkFunc()
  {
    var durl = this.propertyData.url.value;
    var dsid = this.propertyData.sid.value;
    var data = {
      url: durl,
      sid: dsid
    }
    BDKanvas.getInstance().client.processEvent(SMC_EVENT_READY, data);
  }
}
