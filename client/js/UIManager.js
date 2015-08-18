'use strict';
let UIManagerInstance = null;

class UIManager
{
  constructor(divId, canvasId, tabButtonDivId, tabControlsDivId, canvascontroller)
  {
    if (UIManagerInstance === null)
    {
      this.container = document.getElementById(divId);
      this.canvas = document.getElementById(canvasId);
      this.tabButtonDiv = document.getElementById(tabButtonDivId);
      this.tabControlsDiv = document.getElementById(tabControlsDivId);
      //var W = this.container.offsetWidth;// * window.devicePixelRatio;
      //var H = this.container.offsetHeight;// * window.devicePixelRatio;
      var W = window.innerWidth;
      var H = window.innerHeight - 40;
      this.canvas.width = W;
      this.canvas.height = H;
      this.context = this.canvas.getContext("2d");
      this.stateMachine = new StateMachineUI(this);
      this.elements = {};
      this.dialogs = {};
      this.currentDialog = null;
      this.registerDelegatedEvents();
      this.canvascontroller = canvascontroller;
      this.windowTabs = {};
      this.selectedWindowTab = null;

      UIManagerInstance = this;

      this.canvascontroller.init(this.canvas, this.context, this);
    }

    return UIManagerInstance;
  }

  getControlsHeight(){
    return this.tabButtonDiv.clientHeight + this.tabControlsDiv.clientHeight + 7;
  }

  static getInstance()
  {
    return UIManagerInstance;
  }

  getCanvasPoint(px, py)
  {
    var bbox = this.canvas.getBoundingClientRect();
    var canvas_x = px - bbox.left * (this.canvas.width / bbox.width);
    var canvas_y = py - bbox.top * (this.canvas.height / bbox.height);
    //var canvas_x = px * window.devicePixelRatio - bbox.left * (this.canvas.width / bbox.width);
    //var canvas_y = py * window.devicePixelRatio - bbox.top * (this.canvas.height / bbox.height);

    /*var log = "X: " + px + " Y: " + py;
    log += " DPR: " + window.devicePixelRatio;
    log += " BBL: " + bbox.left + " BBT: " + bbox.top;
    log += " BBW: " + bbox.width + " BBH: " + bbox.height;
    log += " CW: " + this.canvas.width + " CH: " + this.canvas.height;
    log += " CX: " + canvas_x + " CY: " + canvas_y;

    document.getElementById("log").innerHTML = log;*/

    return new Point(canvas_x, canvas_y);
  }

  registerDelegatedEvents()
  {
    let obj = this;

    this.evtTouchStart = function(e) {
      var p = obj.getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (obj.canvascontroller.isValidPoint(p))
      {
        var data = {
          point: p
        };
        if (data.point.y >= 0)
        {
          e.preventDefault();
        }
        obj.stateMachine.processEvent("SMUI_EVENT_TOUCHSTART", data);
      }
    };

    this.evtMouseDown = function(e) {
      var p = obj.getCanvasPoint(e.clientX, e.clientY);
      if (obj.canvascontroller.isValidPoint(p))
      {
        var data = {
          point: p
        };
        obj.stateMachine.processEvent("SMUI_EVENT_MOUSEDOWN", data);
      }
    };

    this.evtTouchEnd = function(e) {
      var data = {
      };
      obj.stateMachine.processEvent("SMUI_EVENT_TOUCHEND", data);
    };

    this.evtTouchMove = function(e) {
      var p = obj.getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY);
      if (obj.canvascontroller.isValidPoint(p))
      {
        var data = {
          point: obj.getCanvasPoint(e.touches[0].clientX, e.touches[0].clientY)
        };
        obj.stateMachine.processEvent("SMUI_EVENT_TOUCHDRAG", data);
      }
    };

    this.evtMouseUp = function(e) {
      var data = {
      };
      obj.stateMachine.processEvent("SMUI_EVENT_MOUSEUP", data);
    };

    this.evtMouseMove = function(e) {
      var p = obj.getCanvasPoint(e.clientX, e.clientY);
      if (obj.canvascontroller.isValidPoint(p))
      {
        var data = {
          point: obj.getCanvasPoint(e.clientX, e.clientY)
        };
        obj.stateMachine.processEvent("SMUI_EVENT_MOUSEMOVE", data);
      }
    };


    this.evtCopy = function(e){
      obj.stateMachine.processEvent("SMUI_EVENT_COPY", e);
    };

    this.evtCut = function(e){
      obj.stateMachine.processEvent("SMUI_EVENT_CUT", e);
    }

    this.evtPaste = function(e){
      obj.stateMachine.processEvent("SMUI_EVENT_PASTE", e);
    }

    this.addDelegatedEvents();

    /*window.addEventListener('resize', function(e)
    {
      obj.stateMachine.processEvent("SMUI_EVENT_RESIZE", null);
    });*/
  }

  logUI(msg)
  {
    this.canvascontroller.log(msg);
  }

  createLineElement(lineData)
  {
    var line = new UILine(lineData);
    this.elements[line.uuid] = line;
    return line;
  }

  getElement(uuid)
  {
    if (uuid in this.elements)
    {
      return elements[uuid];
    }
  }

  deleteElement(uuid)
  {
    if (uuid in this.elements)
    {
      delete elements[uuid];
    }
  }

  addDialog(d)
  {
    this.dialogs[d.uuid] = d;
  }

  deleteDialog(uuid)
  {
    if (uuid in this.dialogs)
    {
      this.dialogs[uuid].hide();
      delete this.dialogs[uuid];
    }
  }

  getDialog(uuid)
  {
    var result = false;

    if (uuid in this.dialogs)
    {
      result = this.dialogs[uuid];
    }

    return result;
  }

  dialogOpened(dialog)
  {
    this.currentDialog = dialog;
    this.removeDelegatedEvents();
  }

  dialogClosed(uuid)
  {
    var dialog = this.getDialog(uuid);
    dialog.hide();
    this.deleteDialog(uuid);
    this.addDelegatedEvents();
  }

  dialogHidden(uuid)
  {
    var dialog = this.getDialog(uuid);
    dialog.hide();
    this.addDelegatedEvents();
  }

  removeDelegatedEvents()
  {
    if ('ontouchstart' in window)
    {
      window.removeEventListener('touchstart', this.evtTouchStart);
      window.removeEventListener('touchend', this.evtTouchEnd);
      window.removeEventListener('touchmove', this.evtTouchMove);
    }
    else
    {
      window.removeEventListener('mousedown', this.evtMouseDown);
      window.removeEventListener('mouseup', this.evtMouseUp);
      window.removeEventListener('mousemove', this.evtMouseMove);
    }
    window.removeEventListener("copy", this.evtCopy);
    window.removeEventListener("cut", this.evtCut);
    window.removeEventListener("paste", this.evtPaste);
  }

  addDelegatedEvents()
  {
    if ('ontouchstart' in window)
    {
      window.addEventListener('touchstart', this.evtTouchStart);
      window.addEventListener('touchend', this.evtTouchEnd);
      window.addEventListener('touchmove', this.evtTouchMove);
    }
    else
    {
      window.addEventListener('mousedown', this.evtMouseDown);
      window.addEventListener('mouseup', this.evtMouseUp);
      window.addEventListener('mousemove', this.evtMouseMove);
    }
    window.addEventListener("copy", this.evtCopy);
    window.addEventListener("cut", this.evtCut);
    window.addEventListener("paste", this.evtPaste);
  }

  processEvent(ev, data)
  {
    this.stateMachine.processEvent(ev, data);
  }

  addTab(tab){
    this.tabButtonDiv.appendChild(tab.button);
    this.windowTabs[tab.name] = tab;
  }

  removeTab(tab){
    if (tab in this.windowTabs){
      this.tabButtonDiv.removeChild(this.windowTabs[tab].button);
      delete this.windowTabs[tab];
    }
  }

  setSelectedTab(selectedTabName){
    this.selectedWindowTab = this.windowTabs[selectedTabName];
    while (this.tabControlsDiv.firstChild)
    {
      this.tabControlsDiv.removeChild(this.tabControlsDiv.firstChild);
    }
    for (var tabname in this.windowTabs) {
      if (this.windowTabs.hasOwnProperty(tabname)) {
        if (tabname == selectedTabName){
          this.windowTabs[tabname].setSelected(true);
          this.tabControlsDiv.appendChild(this.windowTabs[tabname].div);
        } else {
          this.windowTabs[tabname].setSelected(false);
        }
      }
    }
  }
}
