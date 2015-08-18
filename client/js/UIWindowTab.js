'use strict';

class UIWindowTab {
  constructor(name, desc){
    let obj = this;

    this.name = name;
    this.desc = desc;

    this.sections = {};
    this.div = document.createElement("div");
    this.div.className = "tabdiv";

    this.lineDiv = document.createElement("div");
    this.lineDiv.className = "tablinediv";
    this.div.appendChild(this.lineDiv);

    this.emptyDiv = document.createElement("div");
    this.emptyDiv.className = "tabsectiondiv";
    //this.emptyDiv.style.width = "100%";
    this.lineDiv.appendChild(this.emptyDiv);

    this.button = document.createElement("button");
    this.button.innerHTML = desc;
    this.button.className = "tabname_notselected";

    this.buttonFunc = function(e){
      UIManagerInstance.processEvent(SMUI_EVENT_TABBUTTON, obj);
    };

    this.button.addEventListener("click", this.buttonFunc);
  }

  setSelected(s){
    if (s) {
      this.button.className = "tabname_selected";
    } else {
      this.button.className = "tabname_notselected";
    }
  }

  addSection(name){
    var sdiv = document.createElement("div");
    sdiv.className = "tabsectiondiv";
    this.sections[name] = {
      name: name,
      div: sdiv,
      controls: {}
    };
    this.lineDiv.removeChild(this.emptyDiv);
    this.lineDiv.appendChild(sdiv);
    this.lineDiv.appendChild(this.emptyDiv);
  }

  deleteSection(sname){
    if (sname in this.sections){
      this.lineDiv.removeChild(this.sections[sname].div);
      delete this.sections[sname];
    }
  }

  addControl(sname, cname, control){
    if (sname in this.sections){
      this.sections[sname].controls[cname] = control;
      this.sections[sname].div.appendChild(control);
    }
  }

  deleteControl(sname, cname){
    if (sname in this.sections){
      if (cname in this.sections[sname].controls){
        var control = this.sections[sname].controls[cname];
        this.sections[sname].div.removeChild(control);
        delete this.sections[sname].controls[cname];
      }
    }
  }

}
