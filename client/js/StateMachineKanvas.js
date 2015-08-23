'use strict';

// States
var SMKV_STATE_VIEW_DRAWING_BRUSH = "SMKV_STATE_VIEW_DRAWING_BRUSH";
var SMKV_STATE_DRAWING_BRUSH = "SMKV_STATE_DRAWING_BRUSH";
var SMKV_STATE_MOVING = "SMKV_STATE_MOVING";
var SMKV_STATE_VIEW_MOVING = "SMKV_STATE_VIEW_MOVING";
var SMKV_STATE_VIEW_ZOOMING_IN = "SMKV_STATE_VIEW_ZOOMING_IN";
var SMKV_STATE_VIEW_ZOOMING_OUT = "SMKV_STATE_VIEW_ZOOMING_OUT";
var SMKV_STATE_VIEW_SELECTINGRECT = "SMKV_STATE_VIEW_SELECTINGRECT";
var SMKV_STATE_VIEW_EDITSELECT = "SMKV_STATE_VIEW_EDITSELECT";
var SMKV_STATE_SELECTINGRECT = "SMKV_STATE_SELECTINGRECT";
var SMKV_STATE_MOVING_SELECTEDRECT = "SMKV_STATE_MOVING_SELECTEDRECT";
var SMKV_STATE_SCALING_SELECTEDRECT = "SMKV_STATE_SCALING_SELECTEDRECT";
var SMKV_STATE_VIEW_DRAWING_LINE = "SMKV_STATE_VIEW_DRAWING_LINE";
var SMKV_STATE_DRAWING_LINE = "SMKV_STATE_DRAWING_LINE";
var SMKV_STATE_VIEW_DRAWING_CIRCLE = "SMKV_STATE_VIEW_DRAWING_CIRCLE";
var SMKV_STATE_DRAWING_CIRCLE = "SMKV_STATE_DRAWING_CIRCLE";

// Events
var SMKV_EVENT_CONFIGBTN = "SMKV_EVENT_CONFIGBTN";
var SMKV_EVENT_BRUSHBTN = "SMKV_EVENT_BRUSHBTN";
var SMKV_EVENT_MOVEBTN = "SMKV_EVENT_MOVEBTN";
var SMKV_EVENT_CONNECTBTN = "SMKV_EVENT_CONNECTBTN";
var SMKV_EVENT_DISCONNECTBTN = "SMKV_EVENT_DISCONNECTBTN";
var SMKV_EVENT_ZOOMINBTN = "SMKV_EVENT_ZOOMINBTN";
var SMKV_EVENT_ZOOMOUTBTN = "SMKV_EVENT_ZOOMOUTBTN";
var SMKV_EVENT_MOVEMENTBTN = "SMKV_EVENT_MOVEMENTBTN";
var SMKV_EVENT_SAVEBTN = "SMKV_EVENT_SAVEBTN";
var SMKV_EVENT_LOADBTN = "SMKV_EVENT_LOADBTN";
var SMKV_EVENT_SELECTRECTBTN = "SMKV_EVENT_SELECTRECTBTN";
var SMKV_EVENT_POINTERDOWN_SELECTRECTEMPTY = "SMKV_EVENT_POINTERDOWN_SELECTRECTEMPTY";
var SMKV_EVENT_POINTERDOWN_SELECTRECTTOUCH = "SMKV_EVENT_POINTERDOWN_SELECTRECTTOUCH";
var SMKV_EVENT_POINTERDOWN_SELECTRECTSCALE = "SMKV_EVENT_POINTERDOWN_SELECTRECTSCALE";
var SMKV_EVENT_SELECTDELBTN = "SMKV_EVENT_SELECTDELBTN";
var SMKV_EVENT_INSERTIMGBTN = "SMKV_EVENT_INSERTIMGBTN";
var SMKV_EVENT_EDITSELECTBTN = "SMKV_EVENT_EDITSELECTBTN";
var SMKV_EVENT_COPYBTN = "SMKV_EVENT_COPYBTN";
var SMKV_EVENT_CUTBTN = "SMKV_EVENT_CUTBTN";
var SMKV_EVENT_PASTEBTN = "SMKV_EVENT_PASTEBTN";
var SMKV_EVENT_LINEBTN = "SMKV_EVENT_LINEBTN";
var SMKV_EVENT_ZOOMFITWIDTHBTN = "SMKV_EVENT_ZOOMFITWIDTHBTN";
var SMKV_EVENT_YZOOMINBTN = "SMKV_EVENT_YZOOMINBTN";
var SMKV_EVENT_ABOUTBTN = "SMKV_EVENT_ABOUTBTN";
var SMKV_EVENT_CIRCLEBTN = "SMKV_EVENT_CIRCLEBTN";

class StateMachineKanvas extends StateMachine
{
  constructor(bdkanvas)
  {
    super();
    this.bdkanvas = bdkanvas;
    this.state = SMKV_STATE_VIEW_DRAWING_BRUSH;
    this.logic = {
      SMKV_STATE_VIEW_DRAWING_BRUSH: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.beginDrawingBrush,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_MOVEBTN: StateMachineKanvas.moveTool,
        SMKV_EVENT_ZOOMINBTN: StateMachineKanvas.zoomInTool,
        SMKV_EVENT_ZOOMOUTBTN: StateMachineKanvas.zoomOutTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_SELECTRECTBTN: StateMachineKanvas.selectRectTool,
        SMKV_EVENT_EDITSELECTBTN: StateMachineKanvas.editSelectTool,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_LINEBTN: StateMachineKanvas.lineTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_CIRCLEBTN: StateMachineKanvas.circleTool
      },
      SMKV_STATE_DRAWING_BRUSH: {
        CC_EVENT_POINTERUP: StateMachineKanvas.endDrawingBrush,
        CC_EVENT_POINTERMOVE: StateMachineKanvas.drawbrush,
      },
      SMKV_STATE_VIEW_DRAWING_LINE: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.beginDrawingLine,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_MOVEBTN: StateMachineKanvas.moveTool,
        SMKV_EVENT_ZOOMINBTN: StateMachineKanvas.zoomInTool,
        SMKV_EVENT_ZOOMOUTBTN: StateMachineKanvas.zoomOutTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_SELECTRECTBTN: StateMachineKanvas.selectRectTool,
        SMKV_EVENT_EDITSELECTBTN: StateMachineKanvas.editSelectTool,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_BRUSHBTN: StateMachineKanvas.brushTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_CIRCLEBTN: StateMachineKanvas.circleTool
      },
      SMKV_STATE_DRAWING_LINE: {
        CC_EVENT_POINTERUP: StateMachineKanvas.endDrawingLine,
        CC_EVENT_POINTERMOVE: StateMachineKanvas.drawline,
      },
      SMKV_STATE_VIEW_MOVING: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.beginMoving,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_BRUSHBTN: StateMachineKanvas.brushTool,
        SMKV_EVENT_ZOOMINBTN: StateMachineKanvas.zoomInTool,
        SMKV_EVENT_ZOOMOUTBTN: StateMachineKanvas.zoomOutTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_SELECTRECTBTN: StateMachineKanvas.selectRectTool,
        SMKV_EVENT_EDITSELECTBTN: StateMachineKanvas.editSelectTool,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_LINEBTN: StateMachineKanvas.lineTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_CIRCLEBTN: StateMachineKanvas.circleTool
      },
      SMKV_STATE_MOVING: {
        CC_EVENT_POINTERUP: StateMachineKanvas.endMoving,
        CC_EVENT_POINTERMOVE: StateMachineKanvas.move
      },
      SMKV_STATE_VIEW_ZOOMING_IN: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.zoomIn,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_MOVEBTN: StateMachineKanvas.moveTool,
        SMKV_EVENT_BRUSHBTN: StateMachineKanvas.brushTool,
        SMKV_EVENT_ZOOMOUTBTN: StateMachineKanvas.zoomOutTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_SELECTRECTBTN: StateMachineKanvas.selectRectTool,
        SMKV_EVENT_EDITSELECTBTN: StateMachineKanvas.editSelectTool,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_LINEBTN: StateMachineKanvas.lineTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_CIRCLEBTN: StateMachineKanvas.circleTool
      },
      SMKV_STATE_VIEW_ZOOMING_OUT: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.zoomOut,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_MOVEBTN: StateMachineKanvas.moveTool,
        SMKV_EVENT_BRUSHBTN: StateMachineKanvas.brushTool,
        SMKV_EVENT_ZOOMINBTN: StateMachineKanvas.zoomInTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_SELECTRECTBTN: StateMachineKanvas.selectRectTool,
        SMKV_EVENT_EDITSELECTBTN: StateMachineKanvas.editSelectTool,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_LINEBTN: StateMachineKanvas.lineTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_CIRCLEBTN: StateMachineKanvas.circleTool
      },
      SMKV_STATE_VIEW_SELECTINGRECT: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.selectRectTestPoint,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_BRUSHBTN: StateMachineKanvas.brushTool,
        SMKV_EVENT_MOVEBTN: StateMachineKanvas.moveTool,
        SMKV_EVENT_ZOOMINBTN: StateMachineKanvas.zoomInTool,
        SMKV_EVENT_ZOOMOUTBTN: StateMachineKanvas.zoomOutTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_POINTERDOWN_SELECTRECTEMPTY: StateMachineKanvas.beginSelectRect,
        SMKV_EVENT_POINTERDOWN_SELECTRECTTOUCH:StateMachineKanvas.beginSelectRectMove,
        SMKV_EVENT_POINTERDOWN_SELECTRECTSCALE:StateMachineKanvas.beginSelectRectScale,
        SMKV_EVENT_SELECTDELBTN: StateMachineKanvas.deleteSelection,
        CC_EVENT_COPY: StateMachineKanvas.copy,
        CC_EVENT_CUT: StateMachineKanvas.cut,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_EDITSELECTBTN: StateMachineKanvas.editSelectTool,
        SMKV_EVENT_COPYBTN: StateMachineKanvas.copyBtn,
        SMKV_EVENT_CUTBTN: StateMachineKanvas.cutBtn,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_LINEBTN: StateMachineKanvas.lineTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_CIRCLEBTN: StateMachineKanvas.circleTool
      },
      SMKV_STATE_SELECTINGRECT: {
        CC_EVENT_POINTERUP: StateMachineKanvas.endRectSelection,
        CC_EVENT_POINTERMOVE: StateMachineKanvas.changeRectSelection
      },
      SMKV_STATE_MOVING_SELECTEDRECT: {
        CC_EVENT_POINTERUP: StateMachineKanvas.endRectSelectionMove,
        CC_EVENT_POINTERMOVE: StateMachineKanvas.moveRectSelection
      },
      SMKV_STATE_SCALING_SELECTEDRECT: {
        CC_EVENT_POINTERUP: StateMachineKanvas.endRectSelectionScale,
        CC_EVENT_POINTERMOVE: StateMachineKanvas.scaleRectSelection
      },
      SMKV_STATE_VIEW_EDITSELECT: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.editSelectTestPoint,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_BRUSHBTN: StateMachineKanvas.brushTool,
        SMKV_EVENT_MOVEBTN: StateMachineKanvas.moveTool,
        SMKV_EVENT_ZOOMINBTN: StateMachineKanvas.zoomInTool,
        SMKV_EVENT_ZOOMOUTBTN: StateMachineKanvas.zoomOutTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_SELECTRECTBTN: StateMachineKanvas.selectRectTool,
        SMKV_EVENT_POINTERDOWN_EDITSELECTTOUCH:StateMachineKanvas.beginSelectRectMove,
        SMKV_EVENT_SELECTDELBTN: StateMachineKanvas.deleteSelection,
        CC_EVENT_COPY: StateMachineKanvas.copy,
        CC_EVENT_CUT: StateMachineKanvas.cut,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_LINEBTN: StateMachineKanvas.lineTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_CIRCLEBTN: StateMachineKanvas.circleTool
      },
      SMKV_STATE_VIEW_DRAWING_CIRCLE: {
        CC_EVENT_POINTERDOWN: StateMachineKanvas.beginDrawingCircle,
        SMKV_EVENT_CONFIGBTN: StateMachineKanvas.configDialog,
        SMKV_EVENT_CONNECTBTN: StateMachineKanvas.connectSession,
        SMKV_EVENT_DISCONNECTBTN: StateMachineKanvas.disconnectSession,
        SMKV_EVENT_MOVEBTN: StateMachineKanvas.moveTool,
        SMKV_EVENT_ZOOMINBTN: StateMachineKanvas.zoomInTool,
        SMKV_EVENT_ZOOMOUTBTN: StateMachineKanvas.zoomOutTool,
        SMKV_EVENT_MOVEMENTBTN: StateMachineKanvas.movementButtons,
        SMKV_EVENT_SAVEBTN: StateMachineKanvas.save,
        SMKV_EVENT_LOADBTN: StateMachineKanvas.load,
        SMKV_EVENT_SELECTRECTBTN: StateMachineKanvas.selectRectTool,
        SMKV_EVENT_EDITSELECTBTN: StateMachineKanvas.editSelectTool,
        CC_EVENT_PASTE: StateMachineKanvas.paste,
        SMKV_EVENT_INSERTIMGBTN: StateMachineKanvas.insertImg,
        SMKV_EVENT_PASTEBTN: StateMachineKanvas.pasteBtn,
        SMKV_EVENT_BRUSHBTN: StateMachineKanvas.brushTool,
        SMKV_EVENT_ZOOMFITWIDTHBTN: StateMachineKanvas.zoomFitWidthTool,
        SMKV_EVENT_YZOOMINBTN: StateMachineKanvas.yZoomInTool,
        SMKV_EVENT_ABOUTBTN: StateMachineKanvas.aboutDialog,
        SMKV_EVENT_LINEBTN: StateMachineKanvas.lineTool
      },
      SMKV_STATE_DRAWING_CIRCLE: {
        CC_EVENT_POINTERUP: StateMachineKanvas.endDrawingCircle,
        CC_EVENT_POINTERMOVE: StateMachineKanvas.drawCircle,
      }
    };
  }

  static beginDrawingBrush(sm, data)
  {
    if (sm.bdkanvas.beginDrawingBrush(data.point.x,data.point.y))
    {
      sm.state = SMKV_STATE_DRAWING_BRUSH;
    }
  }

  static endDrawingBrush(sm, data)
  {
    sm.state = SMKV_STATE_VIEW_DRAWING_BRUSH;
    sm.bdkanvas.endDrawingBrush();
  }

  static drawbrush(sm, data)
  {
    sm.bdkanvas.addBrushPoint(data.point.x,data.point.y);
  }

  static beginDrawingLine(sm, data)
  {
    if (sm.bdkanvas.beginDrawingLine(data.point.x,data.point.y))
    {
      sm.state = SMKV_STATE_DRAWING_LINE;
    }
  }

  static endDrawingLine(sm, data)
  {
    sm.state = SMKV_STATE_VIEW_DRAWING_LINE;
    sm.bdkanvas.endDrawingLine();
  }

  static drawline(sm, data)
  {
    sm.bdkanvas.setLinePoint(data.point.x,data.point.y);
  }

  static beginDrawingCircle(sm, data)
  {
    if (sm.bdkanvas.beginDrawingCircle(data.point.x,data.point.y))
    {
      sm.state = SMKV_STATE_DRAWING_CIRCLE;
    }
  }

  static endDrawingCircle(sm, data)
  {
    sm.state = SMKV_STATE_VIEW_DRAWING_CIRCLE;
    sm.bdkanvas.endDrawingCircle();
  }

  static drawCircle(sm, data)
  {
    sm.bdkanvas.setCircleRadiusPoint(data.point.x,data.point.y);
  }

  static configDialog(sm, data)
  {
    sm.bdkanvas.configDialog.show();
  }

  static connectSession(sm, data)
  {
    sm.bdkanvas.connectSession();
  }

  static disconnectSession(sm, data)
  {
    sm.bdkanvas.disconnectSession();
  }

  static moveTool(sm, data)
  {
    sm.state = SMKV_STATE_VIEW_MOVING;
    sm.bdkanvas.buttonModeMoving();
    sm.bdkanvas.tabModeMove();
    sm.bdkanvas.setSelection(null);
  }

  static brushTool(sm, data)
  {
    sm.state = SMKV_STATE_VIEW_DRAWING_BRUSH;
    sm.bdkanvas.buttonModeBrush();
    sm.bdkanvas.tabModeBrush();
    sm.bdkanvas.setSelection(null);
  }

  static circleTool(sm, data)
  {
    sm.state = SMKV_STATE_VIEW_DRAWING_CIRCLE;
    sm.bdkanvas.buttonModeCircle();
    sm.bdkanvas.tabModeCircle();
    sm.bdkanvas.setSelection(null);
  }

  static lineTool(sm, data)
  {
    sm.state = SMKV_STATE_VIEW_DRAWING_LINE;
    sm.bdkanvas.buttonModeLine();
    sm.bdkanvas.tabModeLine();
    sm.bdkanvas.setSelection(null);
  }

  static beginMoving(sm, data)
  {
    if (sm.bdkanvas.beginMoving(data.point.x,data.point.y))
    {
      sm.state = SMKV_STATE_MOVING;
    }
  }

  static endMoving(sm, data)
  {
      sm.state = SMKV_STATE_VIEW_MOVING;
  }

  static move(sm, data)
  {
    sm.bdkanvas.move(data.point.x, data.point.y);
  }

  static zoomIn(sm, data){
    sm.bdkanvas.zoomIn(data.point.x, data.point.y);
  }

  static zoomOut(sm, data){
    sm.bdkanvas.zoomOut(data.point.x, data.point.y);
  }

  static zoomInTool(sm, data){
    sm.state = SMKV_STATE_VIEW_ZOOMING_IN;
    sm.bdkanvas.setSelection(null);
    sm.bdkanvas.buttonModeZoomIn();
    sm.bdkanvas.tabModeZoomIn();
  }

  static zoomOutTool(sm, data){
    sm.state = SMKV_STATE_VIEW_ZOOMING_OUT;
    sm.bdkanvas.setSelection(null);
    sm.bdkanvas.buttonModeZoomOut();
    sm.bdkanvas.tabModeZoomOut();
  }

  static movementButtons(sm, data){
    sm.bdkanvas.moveOffset(data.scrollX, data.scrollY);
  }

  static save(sm, data){
    sm.bdkanvas.saveDialog.show();
  }

  static load(sm, data){
    sm.bdkanvas.loadDialog.show();
  }

  static selectRectTool(sm, data){
    sm.state = SMKV_STATE_VIEW_SELECTINGRECT;
    sm.bdkanvas.buttonModeSelectRect();
    sm.bdkanvas.tabModeSelectRect();
  }

  static selectRectTestPoint(sm, data){
    if ((sm.bdkanvas.selection !== null) &&
    (sm.bdkanvas.selection.geometry.containsPoint(sm.bdkanvas.canvasToInnerPoint(new Point(data.point.x, data.point.y))))) {
      sm.processEvent(SMKV_EVENT_POINTERDOWN_SELECTRECTTOUCH, data);
    }
    else if ((sm.bdkanvas.selection !== null) &&
    (sm.bdkanvas.selection.pointInScaleRect(sm.bdkanvas.canvasToInnerPoint(new Point(data.point.x, data.point.y))))) {
      sm.processEvent(SMKV_EVENT_POINTERDOWN_SELECTRECTSCALE, data);
    } else {
      sm.processEvent(SMKV_EVENT_POINTERDOWN_SELECTRECTEMPTY, data);
    }
  }

  static beginSelectRect(sm, data){
    sm.bdkanvas.beginRectSelection(data.point.x, data.point.y);
    sm.state = SMKV_STATE_SELECTINGRECT;
  }

  static beginSelectRectMove(sm, data){
    sm.bdkanvas.beginRectSelectionMove(data.point.x, data.point.y);
    sm.state = SMKV_STATE_MOVING_SELECTEDRECT;
  }

  static endRectSelection(sm, data){
    sm.bdkanvas.endRectSelection();
    sm.state = SMKV_STATE_VIEW_SELECTINGRECT;
  }

  static changeRectSelection(sm, data){
    sm.bdkanvas.changeRectSelection(data.point.x, data.point.y);
  }

  static endRectSelectionMove(sm, data){
    sm.bdkanvas.endRectSelectionMove();
    sm.state = SMKV_STATE_VIEW_SELECTINGRECT;
  }

  static moveRectSelection(sm, data){
    sm.bdkanvas.moveRectSelection(data.point.x, data.point.y);
  }

  static deleteSelection(sm, data){
    sm.bdkanvas.deleteSelectedElements();
  }

  static copy(sm, data){
    BDKanvasInstance.copy(data);
  }

  static cut(sm, data){
    BDKanvasInstance.cut(data);
  }

  static paste(sm, data){
    if (BDKanvasInstance.paste(data)){
      sm.state = SMKV_STATE_VIEW_SELECTINGRECT;
    }
  }

  static beginSelectRectScale(sm,data){
    sm.bdkanvas.beginRectSelectionScale(data.point.x, data.point.y);
    sm.state = SMKV_STATE_SCALING_SELECTEDRECT;
  }

  static endRectSelectionScale(sm,data){
    sm.bdkanvas.endRectSelectionScale();
    sm.state = SMKV_STATE_VIEW_SELECTINGRECT;
  }

  static scaleRectSelection(sm,data){
    sm.bdkanvas.scaleRectSelection(data.point.x, data.point.y);
  }

  static insertImg(sm, data){
    BDKanvasInstance.insertImageDialog.show();
  }

  static editSelectTestPoint(sm, data) {
    var drawable = BDKanvasInstance.getDrawableInPoint(sm.bdkanvas.canvasToInnerPoint(new Point(data.point.x, data.point.y)));
    if (drawable !== null){
      var s = new BDKSelectionRect();
      s.setSelection([drawable]);
      sm.bdkanvas.setSelection(s);
      sm.state = SMKV_STATE_VIEW_SELECTINGRECT;
      sm.bdkanvas.buttonModeSelectRect();
      sm.bdkanvas.tabModeSelectRect();
    }
  }

  static editSelectTool(sm, data) {
    sm.state = SMKV_STATE_VIEW_EDITSELECT;
    sm.bdkanvas.setSelection(null);
    sm.bdkanvas.buttonModeEditSelect();
    sm.bdkanvas.tabModeEditSelect();
  }

  static copyBtn(sm, data) {
    BDKanvasInstance.clipboard.copy(null);
  }

  static cutBtn(sm, data) {
    BDKanvasInstance.clipboard.cut(null);
  }

  static pasteBtn(sm, data) {
    BDKanvasInstance.clipboard.paste(null);
  }

  static zoomFitWidthTool(sm, data) {
    BDKanvasInstance.zoomFitWidth();
  }

  static yZoomInTool(sm, data) {
    BDKanvasInstance.yZoomIn();
  }

  static aboutDialog(sm, data) {
    BDKanvasInstance.aboutDialog.show();
  }
}
