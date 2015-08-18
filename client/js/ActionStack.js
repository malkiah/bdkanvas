'use strict';

class ActionStack {
  constructor() {
    this.undoList = [];
    this.redoList = [];
    this.actions = {};
    this.changeListeners = [];
  }

  notifyListeners(data){
    for (var i = 0; i < this.changeListeners.length; i++) {
      this.changeListeners[i].actionStackChanged(self,data);
    }
  }

  undoLast(){
    if (this.undoList.length > 0)
    {
      var action = this.undoList.pop();
      action.undoAction();
      this.redoList.push(action);
      var data = {
        action: "undo",
        uuid: action.uuid,
        fromStack: true
      };
      this.notifyListeners(data);
    }
  }

  redoLast(){
    if (this.redoList.length > 0)
    {
      var action = this.redoList.pop();
      action.redoAction();
      this.undoList.push(action);
      var data = {
        action: "redo",
        uuid: action.uuid,
        fromStack: true
      };
      this.notifyListeners(data);
    }
  }

  undoUUID(actionUUID){
    if (actionUUID in this.actions)
    {
      var action = this.actions[actionUUID];
      action.undoAction();
      var i = this.undoList.indexOf(action);
      if (i >= 0)
      {
        this.undoList.splice(i,1);
      }
      this.redoList.push(action);
      var data = {
        action: "undo",
        uuid: action.uuid,
        fromStack: false
      };
      this.notifyListeners(data);
    }
  }

  redoUUID(actionUUID){
    if (actionUUID in this.actions)
    {
      var action = this.actions[actionUUID];
      action.redoAction();
      var i = this.redoList.indexOf(action);
      if (i >= 0)
      {
        this.redoList.splice(i,1);
      }
      this.undoList.push(action);
      var data = {
        action: "redo",
        uuid: action.uuid,
        fromStack: false
      };
      this.notifyListeners(data);
    }
  }

  actionDone(action){
    this.redoList = [];
    this.undoList.push(action);
    this.actions[action.uuid] = action;
      var data = {
        action: "do",
        uuid: action.uuid,
        fromStack: false
      };
    this.notifyListeners(data);
  }

  addChangeListener(l){
    this.changeListeners.push(l);
  }

  removeChangeListener(l){
    var i = this.changeListeners.indexOf(l);
    this.changeListeners.splice(i,1);
  }
}

var actionStackInstance = new ActionStack();
