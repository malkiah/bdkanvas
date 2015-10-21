'use strict';

let BDKanvasInstance = null;
var BDKANVAS_VERSION = "1_0";

class BDKanvas extends CanvasController
{
  constructor()
  {
    if (BDKanvasInstance === null)
    {
      super();
      this.stateMachine = new StateMachineKanvas(this);
      this.drawables = {};
      this.current = null;
      this.client = new BDKanvasClient();
      this.selection = null;
      this.clipboard = new BDKlipboard();
      this.configuration = {
        backgroundColor: "#ffffff",
        zoom: 5,
        viewLines: true,
        lineColor: "#eeeeee",
        lineTextColor: "#000000",
        lineGap: 500,
        columnNumber: 40,
        lineWidth: 2
      };

      actionStackInstance.addChangeListener(this);

      BDKanvasInstance = this;
    }

    return BDKanvasInstance;
  }

  init(canvas, context)
  {
    super.init(canvas, context);
    this.setTools();
    this.saveDialog = new SaveDialog("Save current canvas", 480, 320, UID_MODE_DIALOG);
    this.loadDialog = new LoadDialog("Load canvas", 480, 320, UID_MODE_DIALOG);
    this.insertImageDialog = new InsertImageDialog("Insert image", 480, 320, UID_MODE_DIALOG);
    this.aboutDialog = new AboutDialog("About DBKanvas", 480, 320, UID_MODE_DIALOG);
    this.createGeneralTab();
    this.createSelectionTab();
    this.createBrushTab();
    this.createLineTab();
    this.createCircleTab();
    this.createConnectionTab();
    this.createConfigTab();

    UIManagerInstance.addTab(this.generalTab);
    UIManagerInstance.addTab(this.configTab);
    UIManagerInstance.addTab(this.connectionTab);
    UIManagerInstance.setSelectedTab("generalTab");

    this.buttonModeBrush();
    this.tabModeBrush();

    this.client.obtainKeepCookies();

    setInterval(BDKanvas.timedRedraw,50,this);
  }

  setSelection(s){
    this.selection = s;
    if (this.selection === null){
      this.selectionTab.deleteSection("selection");
    }
  }

  createConfigTab(){
    var obj = this;
    this.configTabBundle = new PropertyBundle();
    this.configTabBundle.createProperty("PropertyColor", {name: "backgroundColor", desc: "Background color", defaultVal: this.configuration.backgroundColor});
    this.configTabBundle.createProperty("PropertyColor", {name: "lineColor", desc: "Line separator color", defaultVal: this.configuration.lineColor});
    this.configTabBundle.createProperty("PropertyColor", {name: "lineTextColor", desc: "Line text color", defaultVal: this.configuration.lineTextColor});
    this.configTabBundle.createProperty("PropertyBoolean", {name: "viewLines", desc: "View lines", defaultVal: this.configuration.viewLines});
    this.configTabBundle.createProperty("PropertyLastColors", {name: "lastbkcolors", desc: "Last background colors", linkedTo: "backgroundColor"});
    this.configTabBundle.createProperty("PropertyRange", {name: "zoom", desc: "Zoom", min: 1, max: 100, step: 1, defaultVal: this.configuration.zoom});
    this.configTabBundle.createProperty("PropertyRange", {name: "lineGap", desc: "Line gap", min: 100, max: 2000, step: 100, defaultVal: this.configuration.lineGap});
    this.configTabBundle.createProperty("PropertyRange", {name: "columnNumber", desc: "Columns", min: 10, max: 100, step: 1, defaultVal: this.configuration.columnNumber});

    this.configTabSection = new UIPropertySectionTab(this.configTabBundle, 2);

    this.configTab = new UIWindowTab("configTab", "Configuration");
    this.configTab.addSection("config");
    this.configTab.addControl("config","configcontrols",this.configTabSection.getDiv());

    this.configTabBundle.addPropertyChangedListener(function(p){
      obj.changeConfiguration();
    });
  }

  setConfigValue(pname, val){
    this.configuration[pname] = val;
    this.configTabBundle.properties[pname].setValue(val);
  }

  getConfigTabValues(){
    return {
      backgroundColor: this.configTabBundle.properties.backgroundColor.getValue(),
      zoom: this.configTabBundle.properties.zoom.getValue(),
      viewLines: this.configTabBundle.properties.viewLines.getValue(),
      lineColor: this.configTabBundle.properties.lineColor.getValue(),
      lineTextColor: this.configTabBundle.properties.lineTextColor.getValue(),
      lineGap: this.configTabBundle.properties.lineGap.getValue(),
      columnNumber: this.configTabBundle.properties.columnNumber.getValue()
    };
  }

  changeConfiguration(){
    var oldConfig = this.configuration;
    this.configuration = this.getConfigTabValues();
    if (
      (oldConfig.lineGap !== this.configuration.lineGap) ||
      (oldConfig.lineColor !== this.configuration.lineColor) ||
      (oldConfig.lineTextColor !== this.configuration.lineTextColor) ||
      (oldConfig.backgroundColor !== this.configuration.backgroundColor) ||
      (oldConfig.columnNumber !== this.configuration.columnNumber)
    ) {
      var data = {
        action: 'sendConfig',
        oldConfig: oldConfig,
        newConfig: this.configuration
      };
      var action = new ActionChangeConfig(oldConfig, this.configuration, true, null);
      action.performAction();
    }
  }

  createBrushTab(){
    this.brushTabBundle = new PropertyBundle();
    this.brushTabBundle.createProperty("PropertyColor", {name: "linecolor", desc: "Line color", defaultVal: "#000000"});
    this.brushTabBundle.createProperty("PropertyRange", {name: "linewidth", desc: "Line width", min: 1, max: 10, step: 1, defaultVal: 2});
    this.brushTabBundle.createProperty("PropertyBoolean", {name: "filled", desc: "Filled", defaultVal: false});
    this.brushTabBundle.createProperty("PropertyColor", {name: "fillcolor", desc: "Fill color", defaultVal: "#000000"});
    this.brushTabBundle.createProperty("PropertyLastColors", {name: "lastcolors", desc: "Last colors", linkedTo: "linecolor"});
    this.brushTabBundle.createProperty("PropertyBoolean", {name: "closed", desc: "Closed line", defaultVal: false});
    this.brushTabBundle.createProperty("PropertyBoolean", {name: "dashed", desc: "Dashed line", defaultVal: false});
    this.brushTabBundle.createProperty("PropertyLastColors", {name: "lastfillcolors", desc: "Last fill", linkedTo: "fillcolor"});

    this.brushTabSection = new UIPropertySectionTab(this.brushTabBundle, 2);

    this.brushTab = new UIWindowTab("brushTab", "Brush");
    this.brushTab.addSection("brush");
    this.brushTab.addControl("brush","brushcontrols",this.brushTabSection.getDiv());
  }

  createCircleTab(){
    this.circleTabBundle = new PropertyBundle();
    this.circleTabBundle.createProperty("PropertyColor", {name: "linecolor", desc: "Line color", defaultVal: "#000000"});
    this.circleTabBundle.createProperty("PropertyColor", {name: "fillcolor", desc: "Fill color", defaultVal: "#000000"});
    this.circleTabBundle.createProperty("PropertyRange", {name: "linewidth", desc: "Line width", min: 1, max: 10, step: 1, defaultVal: 2});
    this.circleTabBundle.createProperty("PropertyBoolean", {name: "filled", desc: "Filled", defaultVal: false});
    this.circleTabBundle.createProperty("PropertyLastColors", {name: "lastcolors", desc: "Last colors", linkedTo: "linecolor"});
    this.circleTabBundle.createProperty("PropertyLastColors", {name: "lastfillcolors", desc: "Last fill", linkedTo: "fillcolor"});
    this.circleTabBundle.createProperty("PropertyBoolean", {name: "dashed", desc: "Dashed line", defaultVal: false});

    this.circleTabSection = new UIPropertySectionTab(this.circleTabBundle, 2);

    this.circleTab = new UIWindowTab("circleTab", "Circle");
    this.circleTab.addSection("circle");
    this.circleTab.addControl("circle","circlecontrols",this.circleTabSection.getDiv());
  }

  createLineTab(){
    this.lineTabBundle = new PropertyBundle();
    this.lineTabBundle.createProperty("PropertyColor", {name: "linecolor", desc: "Line color", defaultVal: "#000000"});
    this.lineTabBundle.createProperty("PropertyRange", {name: "linewidth", desc: "Line width", min: 1, max: 10, step: 1, defaultVal: 2});
    this.lineTabBundle.createProperty("PropertyBoolean", {name: "arrowini", desc: "Initial arrow", defaultVal: false});
    this.lineTabBundle.createProperty("PropertyLastColors", {name: "lastcolors", desc: "Last colors", linkedTo: "linecolor"});
    this.lineTabBundle.createProperty("PropertyBoolean", {name: "dashed", desc: "Dashed line", defaultVal: false});
    this.lineTabBundle.createProperty("PropertyBoolean", {name: "arrowend", desc: "Final arrow", defaultVal: false});

    this.lineTabSection = new UIPropertySectionTab(this.lineTabBundle, 2);

    this.lineTab = new UIWindowTab("lineTab", "Line");
    this.lineTab.addSection("line");
    this.lineTab.addControl("line","linecontrols",this.lineTabSection.getDiv());
  }

  createSelectionTab(){
    this.selectionTab = new UIWindowTab("selectionTab", "Selection");
    this.selectionTab.addSection("delete");
    this.selectionTab.addControl("delete","delete",this.selectDelBtn)
  }

  createGeneralTab(){
    this.generalTab = new UIWindowTab("generalTab", "General");

    this.generalTab.addSection("saveload");
    this.generalTab.addControl("saveload","save",this.saveBtn);
    this.generalTab.addControl("saveload","load",this.loadBtn);

    this.generalTab.addSection("ccp");
    this.generalTab.addControl("ccp","copy",this.copyBtn);
    this.generalTab.addControl("ccp","cut",this.cutBtn);
    this.generalTab.addControl("ccp","paste",this.pasteBtn);

    this.generalTab.addSection("tools");
    this.generalTab.addControl("tools","brush",this.brushBtn);
    this.generalTab.addControl("tools","line",this.lineBtn);
    this.generalTab.addControl("tools","circle",this.circleBtn);
    this.generalTab.addControl("tools","insertImg",this.insertImgBtn);
    this.generalTab.addControl("tools","move",this.moveBtn);
    this.generalTab.addControl("tools","editSelect",this.editSelectBtn);
    this.generalTab.addControl("tools","selectRect",this.selectRectBtn);

    this.generalTab.addSection("undoredo");
    this.generalTab.addControl("undoredo","undo",this.undoBtn);
    this.generalTab.addControl("undoredo","redo",this.redoBtn);

    this.generalTab.addSection("zoom");
    this.generalTab.addControl("zoom","zoomIn",this.zoomInBtn);
    this.generalTab.addControl("zoom","zoomOut",this.zoomOutBtn);
    this.generalTab.addControl("zoom","zoomFitWidth",this.zoomFitWidthBtn);
    this.generalTab.addControl("zoom","yZoomIn",this.yZoomInBtn);

    this.generalTab.addSection("lineCtrl");
    this.generalTab.addControl("lineCtrl","xIni",this.xIniBtn);
    this.generalTab.addControl("lineCtrl","xPrev",this.xPrevBtn);
    this.generalTab.addControl("lineCtrl","xNext",this.xNextBtn);
    this.generalTab.addControl("lineCtrl","xEnd",this.xEndBtn);
    this.generalTab.addControl("lineCtrl","keyEnter",this.keyEnterBtn);

    this.generalTab.addSection("info");
    this.generalTab.addControl("info","about",this.aboutBtn);
  }

  createConnectionTab(){
    var obj = this;
    this.connectionTabBundle = new PropertyBundle();
    this.connectionTabBundle.createProperty("PropertyText", {name: "url", desc: "URL", defaultVal: "ws://" + window.location.host + ":8888/bdks"});
    this.connectionTabBundle.createProperty("PropertyText", {name: "username", desc: "Username", defaultVal: ""});
    this.connectionTabBundle.createProperty("PropertyBoolean", {name: "anonymous", desc: "Anonymous", defaultVal: false});
    this.connectionTabBundle.createProperty("PropertyText", {name: "protect", desc: "Session password", defaultVal: ""});
    this.connectionTabBundle.createProperty("PropertyText", {name: "sid", desc: "Session ID", defaultVal: "test"});
    this.connectionTabBundle.createProperty("PropertyPass", {name: "password", desc: "Password", defaultVal: ""});
    this.connectionTabBundle.createProperty("PropertyBoolean", {name: "others", desc: "Allow other users", defaultVal: true});
    this.connectionTabBundle.createProperty("PropertyBoolean", {name: "keep", desc: "Keep connection", defaultVal: false});

    this.connectionTabSection = new UIPropertySectionTab(this.connectionTabBundle, 2);

    this.connectionTab = new UIWindowTab("connectionTab", "Connection");
    this.connectionTab.addSection("buttons");
    this.connectionTab.addControl("buttons","Connect",this.connectBtn);
    this.connectionTab.addControl("buttons","Disconnect",this.disconnectBtn);

    this.connectionTab.addSection("options");
    this.connectionTab.addControl("options","connectionoptions",this.connectionTabSection.getDiv());

    this.connectionTabBundle.addPropertyChangedListener(function(p){
      obj.changedConnectionOptions();
    });

    this.setDisconnectedButtons();
  }

  setConnectionData(sid, username, password, anonymous, protect, others, keep) {
    this.connectionTabBundle.properties["sid"].setValue(sid);
    this.connectionTabBundle.properties["username"].setValue(username);
    this.connectionTabBundle.properties["password"].setValue(password);
    this.connectionTabBundle.properties["anonymous"].setValue(anonymous);
    this.connectionTabBundle.properties["others"].setValue(others);
    this.connectionTabBundle.properties["protect"].setValue(protect);
    this.connectionTabBundle.properties["keep"].setValue(keep);
  }

  static getInstance()
  {
    return BDKanvasInstance;
  }

  setTools()
  {
    this.addSaveLoadButtons();
    this.addConnectButton();
    this.addBrushButton();
    this.addInsertImageButton();
    this.addMoveButton();
    this.addSelectButton();
    this.addZoomButtons();
    this.addMovementButtons();
    this.addUndoRedoButtons();
    this.addCopyCutPasteButtons();
    this.addInfoButtons();
  }

  redraw() {
    this.resize();
    this.clear();
    this.drawLines();
    for (var drawable in this.drawables) {
      if (this.drawables.hasOwnProperty(drawable)) {
        this.drawables[drawable].draw(this.context);
      }
    }
    this.drawselection();
    this.drawLog();
  }

  drawselection() {
    if (this.selection !== null){
      this.selection.draw(this.context);
    }
  }

  drawLines() {
    if (this.configuration.viewLines)
    {
      // Rows: espacio entre dos: gap / zoom
      var pxPerLine = this.configuration.lineGap / this.getZoom();
      // Número: canvas height / espacio entre dos
      var numrows = this.canvas.height / pxPerLine;
      // offset primera:
      var y = -(this.scrollY % this.configuration.lineGap) / this.getZoom();
      var linenum = Math.floor(this.scrollY / this.configuration.lineGap);
      this.context.strokeStyle = this.configuration.lineColor;
      this.context.lineWidth = this.configuration.lineWidth;
      this.context.fillStyle = this.configuration.lineTextColor;
      this.context.font = "10px Courier";

      for (var i = 0; i <= numrows+1; i++)
      {
        this.context.fillText(linenum, 5, y);
        this.context.beginPath();
        this.context.moveTo(0,y);
        this.context.lineTo(this.canvas.width,y);
        this.context.stroke();
        y += pxPerLine;
        linenum++;
      }

      var numcols = this.canvas.width / pxPerLine;
      var x = -(this.scrollX % this.configuration.lineGap) / this.getZoom();
      var colnum = Math.floor(this.scrollX / this.configuration.lineGap);
      for (var i = 0; i <= numcols+1; i++)
      {
        this.context.fillText(colnum, x, 10);
        x += pxPerLine;
        colnum++;
      }

    }
  }

  clear()
  {
    this.context.fillStyle = this.configuration.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addUndoRedoButtons(){
    let obj = this;
    this.undoBtn = document.createElement("button");
    this.redoBtn = document.createElement("button");

    this.undoBtn.innerHTML = "<img src='img/edit-undo.svg' />";
    this.redoBtn.innerHTML = "<img src='img/edit-redo.svg' />";

    this.undoBtn.disabled = true;
    this.redoBtn.disabled = true;

    this.undoBtnFunc = function(e){
      actionStackInstance.undoLast();
    };
    this.redoBtnFunc = function(e){
      actionStackInstance.redoLast();
    };

    this.undoBtn.addEventListener("click",this.undoBtnFunc);
    this.redoBtn.addEventListener("click",this.redoBtnFunc);
  }

  addInfoButtons(){
    let obj = this;
    this.aboutBtn = document.createElement("button");

    this.aboutBtn.innerHTML = "<img src='img/help-about.svg' />";

    this.aboutBtnFunc = function(e){
      obj.processEvent(SMKV_EVENT_ABOUTBTN, null);
    };

    this.aboutBtn.addEventListener("click",this.aboutBtnFunc);
  }

  addSaveLoadButtons(){
    let obj = this;
    this.saveBtn = document.createElement("button");
    this.loadBtn = document.createElement("button");

    this.saveBtn.innerHTML = "<img src='img/document-save.svg' />";
    this.loadBtn.innerHTML = "<img src='img/document-open.svg' />";

    this.saveBtnFunc = function(e){
      obj.processEvent(SMKV_EVENT_SAVEBTN, null);
    };
    this.loadBtnFunc = function(e){
      obj.processEvent(SMKV_EVENT_LOADBTN, null);
    };

    this.saveBtn.addEventListener("click",this.saveBtnFunc);
    this.loadBtn.addEventListener("click",this.loadBtnFunc);

    //this.kcontrolsdiv.appendChild(this.saveBtn);
    //this.kcontrolsdiv.appendChild(this.loadBtn);
  }

  addInsertImageButton(){
    let obj = this;
    this.insertImgBtn = document.createElement("button");

    this.insertImgBtn.innerHTML = "<img src='img/insert-image.svg' />";

    this.insertImgBtnFunc = function(e){
      obj.processEvent(SMKV_EVENT_INSERTIMGBTN, null);
    };

    this.insertImgBtn.addEventListener("click",this.insertImgBtnFunc);
  }

  addBrushButton() {
    let obj = this;
    this.brushBtn = document.createElement("button");
    this.lineBtn = document.createElement("button");
    this.circleBtn = document.createElement("button");

    this.brushBtn.innerHTML = "<img src='img/draw-brush.svg' />";
    this.lineBtn.innerHTML = "<img src='img/draw-line.svg' />";
    this.circleBtn.innerHTML = "<img src='img/draw-circle.svg' />";

    this.brushBtnFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_BRUSHBTN, null);
    };
    this.lineBtnFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_LINEBTN, null);
    };
    this.circleBtnFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_CIRCLEBTN, null);
    };

    this.brushBtn.addEventListener("click",this.brushBtnFunc);
    this.lineBtn.addEventListener("click",this.lineBtnFunc);
    this.circleBtn.addEventListener("click",this.circleBtnFunc);
  }

  addCopyCutPasteButtons(){
    let obj = this;
    this.copyBtn = document.createElement("button");
    this.cutBtn = document.createElement("button");
    this.pasteBtn = document.createElement("button");

    this.copyBtn.innerHTML = "<img src='img/edit-copy.svg' />";
    this.cutBtn.innerHTML = "<img src='img/edit-cut.svg' />";
    this.pasteBtn.innerHTML = "<img src='img/edit-paste.svg' />";

    this.copyFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_COPYBTN, e);
    };

    this.cutFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_CUTBTN, e);
    };

    this.pasteFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_PASTEBTN, e);
    };

    this.copyBtn.addEventListener("click",this.copyFunc);
    this.cutBtn.addEventListener("click",this.cutFunc);
    this.pasteBtn.addEventListener("click",this.pasteFunc);

  }

  addSelectButton() {
    let obj = this;
    this.selectRectBtn = document.createElement("button");
    this.selectDelBtn = document.createElement("button");
    this.editSelectBtn = document.createElement("button");

    this.selectRectBtn.innerHTML = "<img src='img/select-rectangular.svg' />";
    this.selectDelBtn.innerHTML = "<img src='img/edit-delete.svg' />";
    this.editSelectBtn.innerHTML = "<img src='img/edit-select.svg' />";

    this.selectRectFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_SELECTRECTBTN, null);
    };

    this.selectDelFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_SELECTDELBTN, null);
    };

    this.editSelectFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_EDITSELECTBTN, null);
    };

    this.selectRectBtn.addEventListener("click",this.selectRectFunc);
    this.selectDelBtn.addEventListener("click",this.selectDelFunc);
    this.editSelectBtn.addEventListener("click",this.editSelectFunc);
  }

  addConnectButton() {
    let obj = this;
    this.connectBtn = document.createElement("button");
    this.disconnectBtn = document.createElement("button");
    this.connectBtn.innerHTML = "<img src='img/network-connect.svg' />";
    this.disconnectBtn.innerHTML = "<img src='img/network-disconnect.svg' />";

    this.connectDialogFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_CONNECTBTN, null);
    };
    this.disconnectDialogFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_DISCONNECTBTN, null);
    };

    this.connectBtn.addEventListener("click",this.connectDialogFunc);
    this.disconnectBtn.addEventListener("click",this.disconnectDialogFunc);
  }

  addMoveButton() {
    let obj = this;
    this.moveBtn = document.createElement("button");
    this.moveBtn.innerHTML = "<img src='img/transform-move.svg' />";

    this.moveBtnFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_MOVEBTN, null);
    };

    this.moveBtn.addEventListener("click",this.moveBtnFunc);
  }

  addZoomButtons() {
    let obj = this;
    this.zoomInBtn = document.createElement("button");
    this.zoomOutBtn = document.createElement("button");
    this.zoomFitWidthBtn = document.createElement("button");
    this.yZoomInBtn = document.createElement("button");

    this.zoomInBtn.innerHTML = "<img src='img/zoom-in.svg' />";
    this.zoomFitWidthBtn.innerHTML = "<img src='img/zoom-fit-width.svg' />";
    this.zoomOutBtn.innerHTML = "<img src='img/zoom-out.svg' />";
    this.yZoomInBtn.innerHTML = "<img src='img/y-zoom-in.svg' />";

    this.zoomInFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_ZOOMINBTN, null);
    };
    this.zoomOutFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_ZOOMOUTBTN, null);
    };
    this.zoomFitWidthBtnFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_ZOOMFITWIDTHBTN, null);
    };
    this.yZoomInBtnFunc = function(e)
    {
      obj.processEvent(SMKV_EVENT_YZOOMINBTN, null);
    };

    this.zoomInBtn.addEventListener("click",this.zoomInFunc);
    this.zoomOutBtn.addEventListener("click",this.zoomOutFunc);
    this.zoomFitWidthBtn.addEventListener("click",this.zoomFitWidthBtnFunc);
    this.yZoomInBtn.addEventListener("click",this.yZoomInBtnFunc);
  }

  addMovementButtons(){
    let obj = this;

    this.xIniBtn = document.createElement("button");
    this.xPrevBtn = document.createElement("button");
    this.xNextBtn = document.createElement("button");
    this.xEndBtn = document.createElement("button");
    this.keyEnterBtn = document.createElement("button");

    this.xIniBtn.innerHTML = "<img src='img/media-skip-backward.svg' />";
    this.xPrevBtn.innerHTML = "<img src='img/media-seek-backward.svg' />";
    this.xNextBtn.innerHTML = "<img src='img/media-seek-forward.svg' />";
    this.xEndBtn.innerHTML = "<img src='img/media-skip-forward.svg' />";
    this.keyEnterBtn.innerHTML = "<img src='img/key-enter.svg' />";

    this.xIniBtnFunc = function(){
      var data = {
        scrollX: -obj.scrollX,
        scrollY: 0
      };
      obj.processEvent(SMKV_EVENT_MOVEMENTBTN, data);
    };
    this.xPrevBtnFunc = function(){
      var data = {
        scrollX: -(obj.canvas.width - 10)*obj.getZoom(),
        scrollY:0
      };
      obj.processEvent(SMKV_EVENT_MOVEMENTBTN, data);
    };
    this.xNextBtnFunc = function(){
      var data = {
        scrollX: 9 * obj.canvas.width * obj.getZoom() / 10,
        scrollY: 0
      };
      obj.processEvent(SMKV_EVENT_MOVEMENTBTN, data);
    };
    this.xEndBtnFunc = function(){
      var data = {
        scrollX: obj.getMaxX() - obj.scrollX,
        scrollY: 0
      };
      obj.processEvent(SMKV_EVENT_MOVEMENTBTN, data);
    };
    this.keyEnterBtnFunc = function(){
      var data = {
        scrollX: -obj.scrollX,
        scrollY: obj.configuration.lineGap
      };
      obj.processEvent(SMKV_EVENT_MOVEMENTBTN, data);
    };

    this.xIniBtn.addEventListener("click",this.xIniBtnFunc);
    this.xPrevBtn.addEventListener("click",this.xPrevBtnFunc);
    this.xNextBtn.addEventListener("click",this.xNextBtnFunc);
    this.xEndBtn.addEventListener("click",this.xEndBtnFunc);
    this.keyEnterBtn.addEventListener("click",this.keyEnterBtnFunc);
  }

  drawLog() {
    if (CC_DEBUG)
    {
      this.context.fillStyle = "black";
      this.context.font = CC_DEBUG_FONTSIZE + "px Courier";
      var logX = 10;
      var logY = this.canvas.height - (CC_DEBUG_LINES * CC_DEBUG_FONTSIZE);
      var lastline = (this.log.length > CC_DEBUG_LINES) ? this.log.length - CC_DEBUG_LINES : 0;
      for (var i = lastline; i < this.log.length; i++) {
        this.context.fillText(this.log[i], logX, logY);
        logY += CC_DEBUG_FONTSIZE;
      }
    }
  }

  beginDrawingBrush(x, y) {
    var result = false;
    if ((x > 0) && (y > 0))
    {
      var line = new BDKBrush(this.context, null);
      this.drawables[line.uuid] = line;
      if (line.geometry.addPoint(this.canvasToInnerPoint(new Point(x, y))))
      {
        //this.logDebug("Draw begin (X:" + x + ",Y:" + y + ")");
      }
      this.current = line;
      result = true;
    }
    return result;
  }

  beginDrawingLine(x, y) {
    var result = false;
    if ((x > 0) && (y > 0))
    {
      var p = this.canvasToInnerPoint(new Point(x, y));
      this.offset = new OffsetController(p.x,p.y,0,0);
      var line = new BDKLine(this.context, null);
      this.drawables[line.uuid] = line;
      line.setPoints(p,p);
      this.current = line;
      result = true;
    }
    return result;
  }

  beginDrawingCircle(x, y) {
    var result = false;
    if ((x > 0) && (y > 0))
    {
      var p = this.canvasToInnerPoint(new Point(x, y));
      this.offset = new OffsetController(p.x,p.y,0,0);
      var circle = new BDKCircle(this.context, null);
      this.drawables[circle.uuid] = circle;
      circle.setCenter(p);
      this.current = circle;
      result = true;
    }
    return result;
  }

  beginMoving(x, y) {
    var result = false;
    if ((x > 0) && (y > 0))
    {
      result = true;
      this.offset = new OffsetController(x,y,0,0);
    }
    return result;
  }

  move(x,y) {
    if ((x > 0) && (y > 0))
    {
      this.offset.moveTo(x,y);
      var dpos = this.offset.getLastOffset();
      var offsetX = -dpos.dx * this.getZoom();
      var offsetY = -dpos.dy * this.getZoom();
      this.moveOffset(offsetX, offsetY);
    }
  }

  addBrushPoint(x, y) {
    if ((x > 0) && (y > 0))
    {
      if (this.current instanceof BDKBrush)
      {
        this.current.geometry.addPoint(this.canvasToInnerPoint(new Point(x, y)));
      }
    }
  }

  setLinePoint(x, y) {
    if ((x > 0) && (y > 0))
    {
      if (this.current instanceof BDKLine)
      {
        var p1 = this.offset.getInitialPos();
        var p2 = this.canvasToInnerPoint(new Point(x,y));
        this.offset.moveTo(p2);
        this.current.setPoints(p1,p2);
      }
    }
  }

  setCircleRadiusPoint(x, y) {
    if ((x > 0) && (y > 0))
    {
      if (this.current instanceof BDKCircle)
      {
        var p = this.canvasToInnerPoint(new Point(x,y));
        this.offset.moveTo(p.x, p.y);
        var r = this.offset.getLength();
        this.current.setRadius(r);
      }
    }
  }

  endDrawingBrush() {
    var c = this.current;
    this.setCurrent(null);
    var action = new ActionCommitBrush(c, true, null);
    action.performAction();
  }

  endDrawingLine() {
    var c = this.current;
    this.setCurrent(null);
    var action = new ActionCommitLine(c, true, null);
    action.performAction();
  }

  endDrawingCircle() {
    var c = this.current;
    this.setCurrent(null);
    var action = new ActionCommitCircle(c, true, null);
    action.performAction();
  }

  setCurrent(current) {
    this.current = current;
  }

  getMoveAmount() {
    return this.configuration.lineGap;
  }

  canvasToInnerPoint(p) {
    return new Point(
      p.x * this.getZoom() + this.scrollX,
      p.y * this.getZoom() + this.scrollY
    );
  }

  innerToCanvasPoint(p) {
    return new Point(
      (p.x - this.scrollX) / this.getZoom(),
      (p.y - this.scrollY) / this.getZoom()
    );
  }

  getDrawable(id) {
    var result = null;
    if (id in this.drawables)
    {
      result = this.drawables[id];
    }

    return result;
  }

  buttonModeCircle() {
    this.circleBtn.style.background = "gray";
    this.brushBtn.style.background = null;
    this.lineBtn.style.background = null;
    this.moveBtn.style.background = null;
    this.zoomOutBtn.style.background = null;
    this.zoomInBtn.style.background = null;
    this.selectRectBtn.style.background = null;
    this.editSelectBtn.style.background = null;
  }

  buttonModeBrush() {
    this.circleBtn.style.background = null;
    this.brushBtn.style.background = "gray";
    this.lineBtn.style.background = null;
    this.moveBtn.style.background = null;
    this.zoomOutBtn.style.background = null;
    this.zoomInBtn.style.background = null;
    this.selectRectBtn.style.background = null;
    this.editSelectBtn.style.background = null;
  }

  buttonModeLine() {
    this.circleBtn.style.background = null;
    this.brushBtn.style.background = null;
    this.lineBtn.style.background = "gray";
    this.moveBtn.style.background = null;
    this.zoomOutBtn.style.background = null;
    this.zoomInBtn.style.background = null;
    this.selectRectBtn.style.background = null;
    this.editSelectBtn.style.background = null;
  }

  buttonModeMoving() {
    this.circleBtn.style.background = null;
    this.brushBtn.style.background = null;
    this.lineBtn.style.background = null;
    this.moveBtn.style.background = "gray";
    this.zoomOutBtn.style.background = null;
    this.zoomInBtn.style.background = null;
    this.selectRectBtn.style.background = null;
    this.editSelectBtn.style.background = null;
  }

  buttonModeZoomIn() {
    this.circleBtn.style.background = null;
    this.brushBtn.style.background = null;
    this.lineBtn.style.background = null;
    this.moveBtn.style.background = null;
    this.zoomOutBtn.style.background = null;
    this.zoomInBtn.style.background = "gray";
    this.selectRectBtn.style.background = null;
    this.editSelectBtn.style.background = null;
  }

  buttonModeZoomOut() {
    this.circleBtn.style.background = null;
    this.brushBtn.style.background = null;
    this.lineBtn.style.background = null;
    this.moveBtn.style.background = null;
    this.zoomOutBtn.style.background = "gray";
    this.zoomInBtn.style.background = null;
    this.selectRectBtn.style.background = null;
    this.editSelectBtn.style.background = null;
  }

  buttonModeSelectRect(){
    this.circleBtn.style.background = null;
    this.brushBtn.style.background = null;
    this.lineBtn.style.background = null;
    this.moveBtn.style.background = null;
    this.zoomOutBtn.style.background = null;
    this.zoomInBtn.style.background = null;
    this.selectRectBtn.style.background = "gray";
    this.editSelectBtn.style.background = null;
  }

  buttonModeEditSelect(){
    this.circleBtn.style.background = null;
    this.brushBtn.style.background = null;
    this.lineBtn.style.background = null;
    this.moveBtn.style.background = null;
    this.zoomOutBtn.style.background = null;
    this.zoomInBtn.style.background = null;
    this.selectRectBtn.style.background = null;
    this.editSelectBtn.style.background = "gray";
  }

  getMaxX () {
    return (this.configuration.columnNumber * this.configuration.lineGap) - (this.canvas.width * this.getZoom());
  }

  getMaxZoom() {
    return this.configuration.lineGap/(this.canvas.width / this.configuration.columnNumber);
  }

  getZoom() {
    return Math.min(this.configuration.zoom, this.getMaxZoom());
  }

  zoomIn(x, y) {
    var zoom = this.configuration.zoom;
    if (zoom > 1)
    {
      var innerP = this.canvasToInnerPoint(new Point(x,y));
      this.setConfigValue("zoom", zoom -1);
      var innerM = this.canvasToInnerPoint(new Point(this.canvas.width/2,this.canvas.height/2));
      var scrollX = innerP.x - innerM.x;
      var scrollY = innerP.y - innerM.y;
      this.moveOffset(scrollX,scrollY);
    }
  }

  zoomOut(x, y){
    var zoom = this.configuration.zoom;
    if (zoom < this.getMaxZoom())
    {
      var innerP = this.canvasToInnerPoint(new Point(x,y));
      this.setConfigValue("zoom", zoom + 1);
      var innerM = this.canvasToInnerPoint(new Point(this.canvas.width/2,this.canvas.height/2));
      var scrollX = innerP.x - innerM.x;
      var scrollY = innerP.y - innerM.y;
      this.moveOffset(scrollX,scrollY);
    }
  }

  static timedRedraw(kanvas) {
    kanvas.redraw();
  }

  actionStackChanged(stack, data) {
    this.setUndoRedoButtonState();
    if (data.fromStack)
    {
      this.client.processEvent(SMC_EVENT_SEND_UNDOREDO, data);
    }
  }

  setUndoRedoButtonState(){
    this.undoBtn.disabled = (actionStackInstance.undoList.length === 0);
    this.redoBtn.disabled = (actionStackInstance.redoList.length === 0);
  }

  serializeDrawables(){
    var result = {};
    for (var uuid in this.drawables) {
      if (this.drawables.hasOwnProperty(uuid)) {
        result[uuid] = this.drawables[uuid].serialize();
      }
    }
    return result;
  }

  save(filename)
  {
    var data = {
      drawables: this.serializeDrawables(),
      config: this.configuration,
      filename: filename,
      version: BDKANVAS_VERSION
    };
    var contents = JSON.stringify(data);
    var download = document.createElement("a");
    download.setAttribute('href', 'data:text/plain;charset:utf-8,' + encodeURIComponent(contents));
    download.setAttribute('download', filename);
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  }

  load1_0(data){
    for (var uuid in data.drawables) {
      if (data.drawables.hasOwnProperty(uuid)) {
        var ddata = data.drawables[uuid];
        var evalStr = ddata.drawableType + ".unserialize" + ddata.drawableVersion + "(ddata);";
        var drawable = eval(evalStr);
        this.drawables[drawable.uuid] = drawable;
      }
    }
    this.configuration.lineGap = data.config.lineGap;
    this.configuration.lineColor = data.config.lineColor;
    this.configuration.lineTextColor = data.config.lineTextColor;
    this.configuration.backgroundColor = data.config.backgroundColor;
    this.configuration.columnNumber = data.config.columnNumber;

    this.saveDialog.setFileName(data.filename);
  }

  load(data, local)
  {
    switch (data.version) {
      case "1_0":
      default:
        this.load1_0(data);
        break;
    }
    if (local){
      this.client.processEvent(SMC_EVENT_LOAD_FILE, data);
    }
  }

  beginRectSelection(x,y) {
    var ip = this.canvasToInnerPoint(new Point(x, y))
    this.setSelection(new BDKSelectionRect(ip.x,ip.y,0,0, null));
    this.offset = new OffsetController(ip.x, ip.y,0,0);
  }

  endRectSelection() {
    this.offset.normalize();
    var size = this.offset.getSize();
    var pos = this.offset.getInitialPos();
    this.selection.geometry.setPos(pos.x, pos.y);
    this.selection.geometry.resize(size.width, size.height);
    this.selection.selectDrawables();
  }

  changeRectSelection(x,y){
    var ip = this.canvasToInnerPoint(new Point(x, y))
    this.offset.moveTo(ip.x, ip.y);
    var size = this.offset.getSize();
    this.selection.geometry.resize(size.width, size.height);
  }

  beginRectSelectionMove(x,y) {
    var ip = this.canvasToInnerPoint(new Point(x, y))
    this.offset = new OffsetController(ip.x, ip.y,0,0);
    var drawablesUUID = [];
    for (var i = 0; i < this.selection.selection.length; i++) {
      drawablesUUID.push(this.selection.selection[i].uuid);
    }
    this.actionCommitMoveDrawables = new ActionCommitMoveDrawables(
      drawablesUUID, true, null);
    this.actionCommitMoveDrawables.setInitialPosition(new Point(
      this.selection.geometry.x, this.selection.geometry.y
    ));
  }

  endRectSelectionMove() {
    this.actionCommitMoveDrawables.setFinalPosition(new Point(
      this.selection.geometry.x, this.selection.geometry.y
    ));
    this.actionCommitMoveDrawables.setFinalPosition(new Point(
      this.selection.geometry.x, this.selection.geometry.y
    ));
    this.actionCommitMoveDrawables.performAction();
    this.actionCommitMoveDrawables = null;
  }

  moveRectSelection(x,y){
    var ip = this.canvasToInnerPoint(new Point(x, y))
    this.offset.moveTo(ip.x, ip.y);
    var diff = this.offset.getLastOffset();

    this.selection.move(diff.dx, diff.dy);
  }

  deleteSelectedElements() {
    var drawablesUUID = [];
    for (var i = 0; i < this.selection.selection.length; i++) {
      drawablesUUID.push(this.selection.selection[i].uuid);
    }
    var actionDeleteDrawables = new ActionDeleteDrawables(
      drawablesUUID, true, null);
    actionDeleteDrawables.performAction();
  }

  tabModeMove(){
    UIManagerInstance.removeTab("selectionTab");
    UIManagerInstance.removeTab("brushTab");
    UIManagerInstance.removeTab("lineTab");
    UIManagerInstance.removeTab("circleTab");
  }

  tabModeZoomIn(){
    UIManagerInstance.removeTab("selectionTab");
    UIManagerInstance.removeTab("brushTab");
    UIManagerInstance.removeTab("lineTab");
    UIManagerInstance.removeTab("circleTab");
  }

  tabModeBrush(){
    UIManagerInstance.removeTab("selectionTab");
    UIManagerInstance.addTab(this.brushTab);
    UIManagerInstance.removeTab("lineTab");
    UIManagerInstance.removeTab("circleTab");
  }

  tabModeLine(){
    UIManagerInstance.removeTab("selectionTab");
    UIManagerInstance.removeTab("brushTab");
    UIManagerInstance.addTab(this.lineTab);
    UIManagerInstance.removeTab("circleTab");
  }

  tabModeCircle(){
    UIManagerInstance.removeTab("selectionTab");
    UIManagerInstance.removeTab("brushTab");
    UIManagerInstance.removeTab("lineTab");
    UIManagerInstance.addTab(this.circleTab);
  }

  tabModeZoomOut(){
    UIManagerInstance.removeTab("selectionTab");
    UIManagerInstance.removeTab("brushTab");
    UIManagerInstance.removeTab("lineTab");
    UIManagerInstance.removeTab("circleTab");
  }

  tabModeSelectRect(){
    UIManagerInstance.addTab(this.selectionTab);
    UIManagerInstance.removeTab("brushTab");
    UIManagerInstance.removeTab("lineTab");
    UIManagerInstance.removeTab("circleTab");
  }

  tabModeEditSelect(){
    UIManagerInstance.removeTab("selectionTab");
    UIManagerInstance.removeTab("brushTab");
    UIManagerInstance.removeTab("lineTab");
    UIManagerInstance.removeTab("circleTab");
  }

  copy(e){
    this.clipboard.copy(e);
  }

  cut(e){
    this.clipboard.cut(e);
  }

  paste(e){
    return this.clipboard.paste(e);
  }

  beginRectSelectionScale(x,y){
    var ip = this.canvasToInnerPoint(new Point(x, y))
    this.offset = new OffsetController(
      this.selection.geometry.x,this.selection.geometry.y,
      this.selection.geometry.width,this.selection.geometry.height);
    this.action = new ActionCommitScaleSelection(true, null);
    var gData = {};
    for (var i = 0; i < this.selection.selection.length; i++) {
      gData[this.selection.selection[i].uuid] = this.selection.selection[i].serializeGeometry();
    }
    this.action.setPreDrawablesGData(gData);
  }

  endRectSelectionScale(){
    var gData = {};
    for (var i = 0; i < this.selection.selection.length; i++) {
      gData[this.selection.selection[i].uuid] = this.selection.selection[i].serializeGeometry();
    }
    this.action.setPostDrawablesGData(gData);
    this.action.performAction();
  }

  scaleRectSelection(x,y){
    var ip = this.canvasToInnerPoint(new Point(x, y))
    this.offset.moveTo(ip.x, ip.y);
    var size = this.offset.getSize();
    this.selection.geometry.resize(size.width, size.height);
    this.selection.scaleSelectedOffset(this.offset);
  }

  getDrawableInPoint(p){
    var keys = Object.keys(this.drawables);
    var i = 0;
    var found = false;
    var result = null;
    while ((!found) && (i < keys.length)) {
      if (this.drawables[keys[i]].containsPoint(p)){
        found = true;
        result = this.drawables[keys[i]];
      } else {
        i++;
      }
    }

    return result;
  }

  zoomFitWidth(){
    this.setConfigValue("zoom", Math.ceil(this.getMaxZoom()));
    this.scrollX = 0;
  }

  yZoomIn(){
    this.setConfigValue("zoom", 1);
  }

  redoSelectionTab(sel){
    var selM = new BDKSelectionTabManager();
    selM.selectionChanged(sel);
  }

  connectSession(){
    var data = {
      url: this.connectionTabBundle.properties["url"].getValue(),
      sid: this.connectionTabBundle.properties["sid"].getValue(),
      username: this.connectionTabBundle.properties["username"].getValue(),
      password: Utils.MD5(this.connectionTabBundle.properties["password"].getValue()),
      anonymous: this.connectionTabBundle.properties["anonymous"].getValue(),
      others: this.connectionTabBundle.properties["others"].getValue(),
      protect: this.connectionTabBundle.properties["protect"].getValue(),
      keep: this.connectionTabBundle.properties["keep"].getValue(),
      plainPassword: this.connectionTabBundle.properties["password"].getValue()
    }
    this.client.processEvent(SMC_EVENT_READY, data);
  }

  disconnectSession(){
    this.client.processEvent(SMC_EVENT_DISCONNECT, null);
    this.client.unsetCookies();
  }

  changedConnectionOptions(){
    var anon = this.connectionTabBundle.properties["anonymous"].getValue();
    var disconnected = !this.connectBtn.disabled;
    if (disconnected) {
      var dstate = anon;
      this.connectionTabBundle.properties["username"].setDisabled(dstate);
      this.connectionTabBundle.properties["password"].setDisabled(dstate);
      this.connectionTabBundle.properties["others"].setDisabled(dstate);
    }
  }

  setConnectedButtons(){
    this.disconnectBtn.disabled = false;
    this.connectBtn.disabled = true;
    for (var id in this.connectionTabBundle.properties) {
      if (this.connectionTabBundle.properties.hasOwnProperty(id)) {
        this.connectionTabBundle.properties[id].setDisabled(true);
      }
    }
    this.changedConnectionOptions();
  }

  setDisconnectedButtons(){
    this.disconnectBtn.disabled = true;
    this.connectBtn.disabled = false;
    for (var id in this.connectionTabBundle.properties) {
      if (this.connectionTabBundle.properties.hasOwnProperty(id)) {
        this.connectionTabBundle.properties[id].setDisabled(false);
      }
    }
    this.changedConnectionOptions();
  }

}
