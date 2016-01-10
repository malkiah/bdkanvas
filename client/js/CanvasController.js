'use strict';

var CC_MAX_LOG_ENTRIES = 100;
var CC_DEBUG = true;
var CC_DEBUG_FONTSIZE = 12;
var CC_DEBUG_LINES = 10;

// CanvasController events
// Redraw event
var CC_EVENT_REDRAW = "CC_EVENT_REDRAW";
// Pointer events
var CC_EVENT_POINTERUP = "CC_EVENT_POINTERUP";
var CC_EVENT_POINTERDOWN = "CC_EVENT_POINTERDOWN";
var CC_EVENT_POINTERMOVE = "CC_EVENT_POINTERMOVE";
// Copy / paste
var CC_EVENT_COPY = "CC_EVENT_COPY";
var CC_EVENT_CUT = "CC_EVENT_CUT";
var CC_EVENT_PASTE = "CC_EVENT_PASTE";

class CanvasController
{
  constructor()
  {
    this.log = [];
    this.canvas = null;
    this.context = null;
    this.stateMachine = null;
    this.scrollX = 0;
    this.scrollY = 0;
    this.dirty = true;
  }

  logDebug(msg)
  {
    this.log.push(msg);
    if (this.log.length > CC_MAX_LOG_ENTRIES)
    {
      this.log.splice(0,1);
    }
    this.processEvent(CC_EVENT_REDRAW, null);
  }

  moveDown()
  {
    this.scrollY += this.getMoveAmount();
    this.dirty = true;
  }

  moveUp()
  {
    this.scrollY -= this.getMoveAmount();
    if (this.scrollY < 0)
    {
      this.scrollY = 0;
    }
    this.dirty = true;
  }

  moveRight()
  {
    this.scrollX += this.getMoveAmount();
    this.dirty = true;
  }

  moveLeft()
  {
    this.scrollX -= this.getMoveAmount();
    if (this.scrollX < 0)
    {
      this.scrollX = 0;
    }
    this.dirty = true;
  }

  setScroll(x,y){
    this.scrollX = 0;
    this.scrollY = 0;
    this.moveOffset(x,y);
    this.dirty = true;
  }

  moveOffset(x,y)
  {
    this.scrollX += x;
    this.scrollY += y;
    if (this.scrollX < 0)
    {
      this.scrollX = 0;
    }
    if (this.scrollX > this.getMaxX())
    {
      this.scrollX = this.getMaxX();
    }
    if (this.scrollY < 0)
    {
      this.scrollY = 0;
    }
    //this.logDebug("Scroll X: " + this.scrollX + " - Scroll Y: " + this.scrollY);
    this.dirty = true;
  }

  getMaxX()
  {
    alert("getMaxX must be redefined.");
  }

  redraw()
  {
    alert("Must be redefined by subclass.");
  }

  getMoveAmount()
  {
    alert("Must be redefined by subclass.");
  }

  init(canvas, context, uimanager)
  {
    this.canvas = canvas;
    this.context = context;
    this.uimanager = uimanager;
  }

  processEvent(ev, data)
  {
    this.stateMachine.processEvent(ev, data);
  }

  isValidPoint(p)
  {
    return (p.x >= 0) && (p.y >= 0);
  }

  resize()
  {
    //var W = this.container.offsetWidth;// * window.devicePixelRatio;
    //var H = this.container.offsetHeight;// * window.devicePixelRatio;
    var W = window.innerWidth;
    var H = window.innerHeight - UIManagerInstance.getControlsHeight();
    if ((this.canvas.width !== W) || (this.canvas.height !== H))
    {
      this.canvas.width = W;
      this.canvas.height = H;
      //this.logDebug("New canvas size: " + W + "x" + H);
    }
    this.dirty = true;
  }

  copy(){
    // Redefine
  }

  cut(){
    // Redefine
  }

  paste(){
    // Redefine
  }
}
