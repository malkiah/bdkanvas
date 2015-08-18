'use strict';

class BDKSelectionTabManager{
  constructor(){
    this.tab = BDKanvasInstance.selectionTab;
    this.selection = null;
  }

  propertyInDescription(p, props){
    var found = false;
    var i = 0;
    var sp = JSON.stringify(p);
    while (!found && (i < props.length)) {
      found = (sp === JSON.stringify(props[i]));
      i++;
    }
    return found;
  }

  propertyInAll(sel,  p){
    var result = true;
    for (var i = 1; i < sel.selection.length; i++) {
      var props = sel.selection[i].describeProperties();
      result &= this.propertyInDescription(p, props);
    }
    return result;
  }

  findEqualProperties(sel){
    var result = [];
    if (sel.selection.length > 0){
      var props = sel.selection[0].describeProperties();
      for (var i = 0; i < props.length; i++) {
        if (this.propertyInAll(sel,props[i])){
          result.push(props[i]);
        }
      }
    }

    return result;
  }

  propertyDescription(p){
    var result = {};
    for (var id in p ) {
      if (p.hasOwnProperty(id) && (id !== 'type')) {
        result[id] = p[id];
      }
    }
    return result;
  }

  createBundle(props){
    var obj = this;
    var result = new PropertyBundle();
    for (var i = 0; i < props.length; i++) {
      for (var id in props[i]) {
        if (props[i].hasOwnProperty(id )) {
          var pDesc = this.propertyDescription(props[i]);
          result.createProperty(props[i].type,pDesc);
        }
      }
    }
    result.addPropertyChangedListener(function (p){
      if (obj.selection !== null){
        var drawablesUUID = [];
        for (var i = 0; i < obj.selection.selection.length; i++) {
          drawablesUUID.push(obj.selection.selection[i].uuid);
        }
        if (drawablesUUID.length > 0){
          var action = new ActionChangeDrawablesProperty(
            drawablesUUID,
            p.data.name,
            p.getValue(),
            true,
            null
          );
          action.performAction();
        }
      }
    });
    return result;
  }

  selectionChanged(sel){
    this.selection = sel;
    var props = this.findEqualProperties(sel);
    var bundle = this.createBundle(props);
    this.tab.deleteSection("selection");
    this.tab.addSection("selection");
    var section = new UIPropertySectionTab(bundle,1);
    this.tab.addControl("selection","properties",section.getDiv());
  }
}
