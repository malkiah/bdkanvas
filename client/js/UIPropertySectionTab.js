'use strict';

class UIPropertySectionTab {
  constructor(bundle, lines) {
    this.bundle = bundle;
    this.lines = lines;
    this.createDiv();
  }

  createDiv(){
    this.div = document.createElement("div");
    this.div.className = "sectiontabtable";

    var columns = Math.ceil(Object.keys(this.bundle.properties).length / this.lines);
    var column = 0;
    var line = 0;
    var rowDiv = null;

    for (var name in this.bundle.properties) {
      if (this.bundle.properties.hasOwnProperty(name)) {
        var property = this.bundle.properties[name];
        if (column === 0) {
          rowDiv = document.createElement("div");
          rowDiv.className = "sectiontabrow";
          this.div.appendChild(rowDiv);
        }
        var descCell = document.createElement("div");
        descCell.className = "sectiontabcell_l";
        descCell.appendChild(document.createTextNode(property.data.desc + ": "));
        rowDiv.appendChild(descCell);

        var ctrlCell = document.createElement("div");
        ctrlCell.className = "sectiontabcell_r";
        ctrlCell.appendChild(property.getControl());
        rowDiv.appendChild(ctrlCell);

        column++;
        if (column === columns){
          line++;
          column = 0;
        }
      }
    }
  }

  getDiv() {
    return this.div;
  }
}
