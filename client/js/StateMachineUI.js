'use strict';

// States
var SMUI_STATE_DELEGATE = "SMUI_STATE_DELEGATE";
var SMUI_STATE_DIALOG = "SMUI_STATE_DIALOG";
var SMUI_STATE_SELECT = "SMUI_STATE_SELECT";
// Mouse events
var SMUI_EVENT_MOUSEDOWN = "SMUI_EVENT_MOUSEDOWN";
var SMUI_EVENT_MOUSEUP = "SMUI_EVENT_MOUSEUP";
var SMUI_EVENT_MOUSEMOVE = "SMUI_EVENT_MOUSEMOVE";
// Touch events
var SMUI_EVENT_TOUCHSTART = "SMUI_EVENT_TOUCHSTART";
var SMUI_EVENT_TOUCHEND = "SMUI_EVENT_TOUCHEND";
var SMUI_EVENT_TOUCHDRAG = "SMUI_EVENT_TOUCHDRAG";
// UI events
var SMUI_EVENT_DELEGATEMODE = "SMUI_EVENT_DELEGATEMODE";
var SMUI_EVENT_SELECTMODE = "SMUI_EVENT_SELECTMODE";
var SMUI_EVENT_RESIZE = "SMUI_EVENT_RESIZE";
// Dialog event
var SMUI_EVENT_OPENDIALOG = "SMUI_EVENT_OPENDIALOG";
var SMUI_EVENT_CLOSEDIALOG = "SMUI_EVENT_CLOSEDIALOG";
var SMUI_EVENT_HIDEDIALOG = "SMUI_EVENT_HIDEDIALOG";
// Tab event
var SMUI_EVENT_TABBUTTON = "SMUI_EVENT_TABBUTTON";
// Copy / paste
var SMUI_EVENT_COPY = "SMUI_EVENT_COPY";
var SMUI_EVENT_CUT = "SMUI_EVENT_CUT";
var SMUI_EVENT_PASTE = "SMUI_EVENT_PASTE";

class StateMachineUI extends StateMachine
{
  constructor(uimanager)
  {
    super();
    this.uimanager = uimanager;
    this.state = SMUI_STATE_DELEGATE;
    this.logic = {
      SMUI_STATE_DELEGATE: {
        SMUI_EVENT_MOUSEDOWN: StateMachineUI.pointerDownDelegate,
        SMUI_EVENT_TOUCHSTART: StateMachineUI.pointerDownDelegate,
        SMUI_EVENT_MOUSEUP: StateMachineUI.pointerUpDelegate,
        SMUI_EVENT_TOUCHEND: StateMachineUI.pointerUpDelegate,
        SMUI_EVENT_MOUSEMOVE: StateMachineUI.pointerMoveDelegate,
        SMUI_EVENT_TOUCHDRAG: StateMachineUI.pointerMoveDelegate,
        SMUI_EVENT_SELECTMODE: StateMachineUI.selectMode,
        SMUI_EVENT_RESIZE: StateMachineUI.resize,
        SMUI_EVENT_OPENDIALOG: StateMachineUI.dialogOpened,
        SMUI_EVENT_TABBUTTON: StateMachineUI.tabButton,
        SMUI_EVENT_COPY: StateMachineUI.copy,
        SMUI_EVENT_CUT: StateMachineUI.cut,
        SMUI_EVENT_PASTE: StateMachineUI.paste
      },
      SMUI_STATE_SELECT: {
        SMUI_EVENT_DELEGATEMODE: StateMachineUI.delegateMode,
        SMUI_EVENT_RESIZE: StateMachineUI.resize,
        SMUI_EVENT_OPENDIALOG: StateMachineUI.dialogOpened
      },
      SMUI_STATE_DIALOG: {
        SMUI_EVENT_CLOSEDIALOG: StateMachineUI.dialogClosed,
        SMUI_EVENT_HIDEDIALOG: StateMachineUI.dialogHidden
      }
    };
  }

  static pointerDownDelegate(sm, data)
  {
    sm.uimanager.canvascontroller.processEvent(CC_EVENT_POINTERDOWN, data);
  }

  static pointerUpDelegate(sm, data)
  {
    sm.uimanager.canvascontroller.processEvent(CC_EVENT_POINTERUP, data);
  }

  static pointerMoveDelegate(sm, data)
  {
    sm.uimanager.canvascontroller.processEvent(CC_EVENT_POINTERMOVE, data);
  }

  static resize(sm, data)
  {
    sm.uimanager.resize();
  }

  static selectMode(sm, data)
  {
    //this.uimanager.logUI("selectMode");
  }

  static delegateMode(sm, data)
  {
    //this.uimanager.logUI("drawMode");
  }

  static dialogOpened(sm, data)
  {
    sm.uimanager.dialogOpened(data);
    sm.state = SMUI_STATE_DIALOG;
  }

  static dialogClosed(sm, data)
  {
    sm.uimanager.dialogClosed(data);
    sm.state = SMUI_STATE_DELEGATE;
  }

  static dialogHidden(sm, data)
  {
    sm.uimanager.dialogHidden(data);
    sm.state = SMUI_STATE_DELEGATE;
  }

  static tabButton(sm, data){
    sm.uimanager.setSelectedTab(data.name);
  }

  static copy(sm, data){
    sm.uimanager.canvascontroller.processEvent(CC_EVENT_COPY, data);
  }

  static cut(sm, data){
    sm.uimanager.canvascontroller.processEvent(CC_EVENT_CUT, data);
  }

  static paste(sm, data){
    sm.uimanager.canvascontroller.processEvent(CC_EVENT_PASTE, data);
  }
}
