'use strict';

var PDIA_TYPE_COLOR = 0; // A color picker
var PDIA_TYPE_RANGE = 1; // A range
var PDIA_TYPE_TXT = 2; // A text input
var PDIA_TYPE_LASTCOLORS = 3; // Last 10 picked colors in the picker.
                              // Does not return a value itself,
                              // but assings it to the linked color picker.
var PDIA_TYPE_BOOLEAN = 4; // Checkbox input
var PDIA_TYPE_FILE = 5; // File upload. Value will return nothing, and a
                        // callback "function(filedata)" must be supplied.

var PDIA_READ_TEXT = 0;
var PDIA_READ_ARRAYBUFFER = 1;
var PDIA_READ_BINARYSTR = 2;
var PDIA_READ_DATAURL = 3;

class PropertyDialog extends UIDialog
{
  constructor(title, w, h, mode)
  {
    super(title, w, h, mode);
    this.propertyData = {};
    this.createChildContents();
  }

  getPropertyDesc()
  {
    // Redefine!!
    /*return [
      {type: PDIA_TYPE_COLOR, name: "color", desc: "Color Example:", defaultVal: "#000000"},
      {type: PDIA_TYPE_LASTCOLORS, name: "lastColors", desc: "Last colors Example:", linkedTo: "color"},
      {type: PDIA_TYPE_RANGE, name: "range", desc: "Range Example:", min:0, max:100,step:1, defaultVal: 50},
      {type: PDIA_TYPE_TXT, name: "text", desc: "Text Example:", defaultVal: ""},
      {type: PDIA_TYPE_BOOLEAN, name: "boolean", desc: "Boolean Example", defaultVal: true},
      {type: PDIA_TYPE_FILE, name: "file", desc: "File Example", readMode: PDIA_READ_TEXT, onloadFunc: loadFunc }
    ];*/
    alert("getPropertyDesc() must be redefined.");
  }

  createPropertyColor(pdesc)
  {
    var obj = this;
    var result = document.createElement("input");
    result.type = "color";
    var data = {
      name: pdesc.name,
      control: result,
      value: pdesc.defaultVal,
      acceptFunc: function()
      {
        obj.propertyData[pdesc.name].value = obj.propertyData[pdesc.name].control.value;
      },
      showFunc: function()
      {
        obj.propertyData[pdesc.name].control.value = obj.propertyData[pdesc.name].value;
      }
    };
    this.propertyData[pdesc.name] = data;

    return result;
  }

  createPropertyLastColors(pdesc)
  {
    var obj = this;
    var lastColors = [this.propertyData[pdesc.linkedTo].value,'#ff0000','#00ff00','#0000ff','#00ffff','#ff00ff','#ffff00','#888888','#ffffff',"#008800"];
    var result = document.createElement("div");
    var data = {
      name: pdesc.name,
      control: result,
      value: lastColors,
      acceptFunc: null,
      showFunc: function()
      {
        while (result.firstChild)
        {
          result.removeChild(result.firstChild);
        }

        for (var i = 0; i < lastColors.length; i++) {
          var colorBtn = document.createElement("button");
          colorBtn.style.border = 0;
          colorBtn.style.backgroundColor = lastColors[i];
          colorBtn.style.width = "20%";
          colorBtn.innerHTML = lastColors[i];
          colorBtn.value = lastColors[i];
          colorBtn.addEventListener("click",function(e){
            obj.propertyData[pdesc.linkedTo].control.value = e.srcElement.value;
          });
          result.appendChild(colorBtn);
          if (i === 4)
          {
            result.appendChild(document.createElement("br"));
          }
        }
      }
    };
    this.propertyData[pdesc.name] = data;

    return result;
  }

  createPropertyRange(pdesc)
  {
    var obj = this;
    var result = document.createElement("div");
    var rcontrol = document.createElement("input");
    rcontrol.type = "range";
    rcontrol.max = pdesc.max;
    rcontrol.min = pdesc.min;
    rcontrol.step = pdesc.step;
    rcontrol.value = pdesc.defaultVal;

    var plusbutton = document.createElement("input");
    plusbutton.type = "button";
    plusbutton.value = "+";
    plusbutton.addEventListener("click", function(e){
      rcontrol.value = parseInt(rcontrol.value) + parseInt(rcontrol.step);
      rnumber.value = rcontrol.value;
    });

    var minusbutton = document.createElement("input");
    minusbutton.type = "button";
    minusbutton.value = "-";
    minusbutton.addEventListener("click", function(e){
      rcontrol.value = parseInt(rcontrol.value) - parseInt(rcontrol.step);
      rnumber.value = rcontrol.value;
    });

    var rnumber =  document.createElement("input");
    rnumber.type = "text";
    rnumber.readonly = "true";
    rnumber.style.width = "4em";
    rnumber.value = pdesc.defaultVal;

    rcontrol.addEventListener("change", function(e){
      rnumber.value = rcontrol.value;
    });

    result.appendChild(minusbutton);
    result.appendChild(rcontrol);
    result.appendChild(plusbutton);
    result.appendChild(rnumber);

    var data = {
      name: pdesc.name,
      control: rcontrol,
      value: pdesc.defaultVal,
      acceptFunc: function()
      {
        obj.propertyData[pdesc.name].value = obj.propertyData[pdesc.name].control.value;
      },
      showFunc: function()
      {
        obj.propertyData[pdesc.name].control.value = obj.propertyData[pdesc.name].value;
      }
    };
    this.propertyData[pdesc.name] = data;

    return result;
  }

  createPropertyText(pdesc)
  {
    var obj = this;
    var result = document.createElement("input");
    result.type = "text";
    result.value = pdesc.defaultVal;

    var data = {
      name: pdesc.name,
      control: result,
      value: pdesc.defaultVal,
      acceptFunc: function()
      {
        obj.propertyData[pdesc.name].value = obj.propertyData[pdesc.name].control.value;
      },
      showFunc: function()
      {
        obj.propertyData[pdesc.name].control.value = obj.propertyData[pdesc.name].value;
      }
    };
    this.propertyData[pdesc.name] = data;

    return result;
  }


  createPropertyFile(pdesc)
  {
    var obj = this;
    var result = document.createElement("input");
    result.type = "file";

    var data = {
      name: pdesc.name,
      control: result,
      acceptFunc: function()
      {
        var reader = new FileReader();
        var file = result.files[0];
        reader.onload = pdesc.onLoadFunc;
        switch (pdesc.readMode) {
          case PDIA_READ_TEXT:
            reader.readAsText(file);
            break;
          case PDIA_READ_DATAURL:
            reader.readAsDataURL(file);
            break;
          case PDIA_READ_BINARYSTR:
            reader.readAsBinaryString(file);
            break;
          case PDIA_READ_ARRAYBUFFER:
            reader.readAsArrayBuffer(file);
            break;
        }
      },
      showFunc: function() {}
    };
    this.propertyData[pdesc.name] = data;

    return result;
  }

  createPropertyBoolean(pdesc)
  {
    var obj = this;
    var result = document.createElement("input");
    result.type = "checkbox";
    result.checked = pdesc.defaultVal;

    var data = {
      name: pdesc.name,
      control: result,
      value: pdesc.defaultVal,
      acceptFunc: function()
      {
        obj.propertyData[pdesc.name].value = obj.propertyData[pdesc.name].control.checked;
      },
      showFunc: function()
      {
        obj.propertyData[pdesc.name].control.checked = obj.propertyData[pdesc.name].value;
      }
    };
    this.propertyData[pdesc.name] = data;

    return result;
  }

  createProperty(pdesc)
  {
    var result = null;

    switch (pdesc.type) {
      case PDIA_TYPE_COLOR:
        result = this.createPropertyColor(pdesc);
        break;
      case PDIA_TYPE_LASTCOLORS:
        result = this.createPropertyLastColors(pdesc);
        break;
      case PDIA_TYPE_RANGE:
        result = this.createPropertyRange(pdesc);
        break;
      case PDIA_TYPE_BOOLEAN:
        result = this.createPropertyBoolean(pdesc);
        break;
      case PDIA_TYPE_FILE:
          result = this.createPropertyFile(pdesc);
          break;
      case PDIA_TYPE_TXT:
      default:
        result = this.createPropertyText(pdesc);
        break;
    }

    return result;
  }

  createChildContents()
  {
    var obj = this;
    var tablediv = document.createElement("div");
    tablediv.className = "pdialog_tablediv";
    this.childDiv.appendChild(tablediv);

    var pdesc = this.getPropertyDesc();

    for (var i = 0; i < pdesc.length; i++) {
      var rowdiv = document.createElement("div");
      rowdiv.className = "pdialog_rowdiv";
      tablediv.appendChild(rowdiv);

      var txtcelldiv = document.createElement("div");
      txtcelldiv.className = "pdialog_celldiv";
      txtcelldiv.appendChild(document.createTextNode(pdesc[i].desc));
      rowdiv.appendChild(txtcelldiv);

      var elemcelldiv = document.createElement("div");
      elemcelldiv.className = "pdialog_celldiv";
      var controls = this.createProperty(pdesc[i]);
      elemcelldiv.appendChild(controls);
      rowdiv.appendChild(elemcelldiv);

      this.okFunc = function(e)
      {
        obj.globalPreOkFunc();
        for (var prop in obj.propertyData) {
          if (obj.propertyData.hasOwnProperty(prop)) {
            if (obj.propertyData[prop].acceptFunc !== null)
            {
              obj.propertyData[prop].acceptFunc();
            }
          }
        }
        obj.globalOkFunc();
        UIManager.getInstance().processEvent("SMUI_EVENT_HIDEDIALOG", obj.uuid);
        UIManager.getInstance().canvascontroller.processEvent("CC_EVENT_REDRAW", null);
      }
    }

    this.okBtn.addEventListener("click",this.okFunc);
  }

  show()
  {
    super.show();
    for (var prop in this.propertyData) {
      if (this.propertyData.hasOwnProperty(prop)) {
        if (this.propertyData[prop].showFunc !== null)
        {
          this.propertyData[prop].showFunc();
        }
      }
    }
  }

  globalPreOkFunc()
  {
    // Redefine if needed
  }

  globalOkFunc()
  {
    // Redefine if needed
  }
}
