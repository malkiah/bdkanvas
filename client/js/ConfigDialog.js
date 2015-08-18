'use strict';

class ConfigDialog extends PropertyDialog
{
  constructor(title, w, h, mode)
  {
    super(title, w, h, mode);
    this.lineWidth = 1;
  }

  getPropertyDesc()
  {
    return [
      {type: PDIA_TYPE_COLOR, name: "backgroundColor", desc: "Background color:", defaultVal: "#dddddd"},
      {type: PDIA_TYPE_RANGE, name: "zoom", desc: "Zoom:", min:1, max:100,step:1, defaultVal: 5},
      {type: PDIA_TYPE_BOOLEAN, name: "viewLines", desc: "View lines:", defaultVal: true},
      {type: PDIA_TYPE_COLOR, name: "lineColor", desc: "Line separator color:", defaultVal: "#eeeeee"},
      {type: PDIA_TYPE_COLOR, name: "lineTextColor", desc: "Line text color:", defaultVal: "#000000"},
      {type: PDIA_TYPE_RANGE, name: "lineGap", desc: "Line gap:", min:100, max:1000,step:100, defaultVal: 500},
      {type: PDIA_TYPE_RANGE, name: "columnNumber", desc: "Columns:", min:10, max:100,step:1, defaultVal: 20}
    ];
  }

  getConfigValues()
  {
    return {
      backgroundColor: this.getBackgroundColor(),
      zoom: this.getZoom(),
      viewLines: this.getViewLines(),
      lineColor: this.getLineColor(),
      lineTextColor: this.getLineTextColor(),
      lineGap: this.getLineGap(),
      columnNumber: this.getColumnNumber()
    };
  }

  getBackgroundColor()
  {
    return this.propertyData.backgroundColor.value;
  }

  setBackgroundColor(value)
  {
    this.propertyData.backgroundColor.value = value;
  }

  getViewLines()
  {
    return this.propertyData.viewLines.value;
  }

  getZoom()
  {
    return parseInt(this.propertyData.zoom.value);
  }

  setZoom(value)
  {
    this.propertyData.zoom.value = value;
  }

  getLineColor()
  {
    return this.propertyData.lineColor.value;
  }

  setLineColor(value)
  {
    this.propertyData.lineColor.value = value;
  }

  getLineGap()
  {
    return parseInt(this.propertyData.lineGap.value);
  }

  setLineGap(value)
  {
    this.propertyData.lineGap.value = value;
  }

  getColumnNumber()
  {
    return parseInt(this.propertyData.columnNumber.value);
  }

  setColumnNumber(value)
  {
    this.propertyData.columnNumber.value = value;
  }

  getLineTextColor()
  {
    return this.propertyData.lineTextColor.value;
  }

  setLineTextColor(value)
  {
    this.propertyData.lineTextColor.value = value;
  }

  globalPreOkFunc()
  {
    this.preOkConfig = this.getConfigValues();
  }

  globalOkFunc()
  {
    var data = {
      action: 'sendConfig',
      oldConfig: this.preOkConfig,
      newConfig: this.getConfigValues()
    };
    BDKanvas.getInstance().client.processEvent(SMC_EVENT_SEND_ACTION, data);
  }
}
