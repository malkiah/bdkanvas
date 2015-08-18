'use strict';

class BrushDialog extends PropertyDialog
{
  constructor(title, w, h, mode)
  {
    super(title, w, h, mode);
  }

  getPropertyDesc()
  {
    return [
      {type: PDIA_TYPE_COLOR, name: "brushColor", desc: "Brush color:", defaultVal: "#000000"},
      {type: PDIA_TYPE_LASTCOLORS, name: "brushLastColors", desc: "Last used colors:", linkedTo: "brushColor"},
      {type: PDIA_TYPE_RANGE, name: "brushThickness", desc: "Brush thickness:", min:1, max:10,step:1, defaultVal: 3}
    ];
  }

  getColorValue()
  {
    return this.propertyData.brushColor.value;
  }

  getBrushThickness()
  {
    return this.propertyData.brushThickness.value;
  }

}
