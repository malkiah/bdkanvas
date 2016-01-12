'use strict';

class BDKanvasClient
{
  constructor() {
    this.cid = Utils.generateUUID();
    this.ws = null;
    this.sid = null;
    this.statemachine = new StateMachineBDKanvasClient(this);
  }

  connect(data) {
    let obj = this;
    this.sid = data.sid;
    this.clientData = data;
    this.ws = new WebSocket(data.url);
    this.onMessage = function(e) {
      var data = JSON.parse(e.data);
      switch (data.response) {
        case 'ok':
          obj.statemachine.processEvent(SMC_EVENT_CONTACTED, null);
          break;
        case 'connected':
          obj.statemachine.processEvent(SMC_EVENT_CONNECTED, null);
          break;
        case 'sync':
          obj.statemachine.processEvent(SMC_EVENT_MESSAGE, data);
          break;
        case 'ping':
          obj.statemachine.processEvent(SMC_EVENT_PING, data);
          break;
        case 'error':
          obj.statemachine.processEvent(SMC_EVENT_ERROR, data);
          break;
      }
    };
    this.onClose = function(e) {
      obj.statemachine.processEvent(SMC_EVENT_DISCONNECTED, null);
    };
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
  }

  disconnect(){
    this.ws.close();
  }

  connectionOk() {
    if (this.clientData.keep)
    {
      docCookies.setItem('sid',this.clientData.sid, Infinity);
      docCookies.setItem('username',this.clientData.username, Infinity);
      docCookies.setItem('password',this.clientData.plainPassword, Infinity);
      docCookies.setItem('anonymous',this.clientData.anonymous, Infinity);
      docCookies.setItem('protect',this.clientData.protect, Infinity);
      docCookies.setItem('others',this.clientData.others, Infinity);
      docCookies.setItem('keep',this.clientData.keep, Infinity);
    }
  }

  unsetCookies() {
    if (this.clientData.keep)
    {
      docCookies.removeItem('sid');
      docCookies.removeItem('username');
      docCookies.removeItem('password');
      docCookies.removeItem('anonymous');
      docCookies.removeItem('protect');
      docCookies.removeItem('others');
      docCookies.removeItem('keep');
    }
  }

  obtainKeepCookies() {
    if (docCookies.getItem('keep') == 'true'){
      BDKanvasInstance.setConnectionData(
        docCookies.getItem('sid'),
        docCookies.getItem('username'),
        docCookies.getItem('password'),
        docCookies.getItem('anonymous') == 'true',
        docCookies.getItem('protect'),
        docCookies.getItem('others') == 'true',
        docCookies.getItem('keep') == 'true'
      );
    }
  }

  joinSession() {
    var msg = {
      type: 'join',
      cid: this.cid,
      sid: this.sid,
      username: this.clientData.username,
      password: this.clientData.password,
      anonymous: this.clientData.anonymous,
      protect: this.clientData.protect,
      others: this.clientData.others,
      keep: this.clientData.keep
    };
    this.ws.send(JSON.stringify(msg));
  }

  requestSync() {
    var msg = {
      type: 'request_sync',
      cid: this.cid,
      sid: this.sid
    };
    this.ws.send(JSON.stringify(msg));
  }

  message(data) {
    switch (data.actionType) {
      case 'begindrawbrush':
        var brush = new BDKBrush(BDKanvasInstance.context, data.lineData);
        BDKanvasInstance.addDrawable(brush);
        break;
      case 'addbrushpoint':
        var point = new Point(data.pointData.x, data.pointData.y);
        BDKanvasInstance.getDrawable(data.brushUUID).addPoint(point);
        break;
      case 'commitbrush':
        var brush = BDKanvasInstance.getDrawable(data.brushUUID);
        var action = new ActionCommitBrush(brush, false, data.actionUUID);
        action.performAction();
        break;
      case 'drawline':
        var line = new BDKLine(BDKanvasInstance.context, data.lineData);
        var action = new ActionCommitLine(line, false, data.actionUUID);
        action.performAction();
        break;
      case 'drawcircle':
        var circle = new BDKCircle(BDKanvasInstance.context, data.circleData);
        var action = new ActionCommitCircle(circle, false, data.actionUUID);
        action.performAction();
        break;
      case 'changeConfig':
        var action = new ActionChangeConfig(data.oldConfig, data.newConfig, false, data.actionUUID);
        action.performAction();
        break;
      case 'undo':
        actionStackInstance.undoUUID(data.actionUUID);
        break;
      case 'redo':
        actionStackInstance.redoUUID(data.actionUUID);
        break;
      case 'loadfile':
        BDKanvasInstance.load(data.filedata, false);
        break;
      case 'endMovingSelection':
        var action = new ActionCommitMoveDrawables(data.drawablesUUID, false, data.actionUUID);
        action.setInitialPosition(new Point(data.initialPoint.x, data.initialPoint.y));
        action.setFinalPosition(new Point(data.finalPoint.x, data.finalPoint.y));
        action.performAction();
        break;
      case 'deleteDrawables':
        var action = new ActionDeleteDrawables(data.drawablesUUID, false, data.actionUUID);
        action.performAction();
        break;
      case 'pasteDrawables':
        var drawables = [];
        for (var i = 0; i < data.drawablesData.length; i++) {
          var ddata = data.drawablesData[i]
          var evalStr = ddata.drawableType + ".unserialize" + ddata.drawableVersion + "(ddata);";
          var drawable = eval(evalStr);
          drawables.push(drawable);
        }
        var action = new ActionPasteDrawables(drawables, false, data.actionUUID);
        action.performAction();
        break;
      case 'scaleDrawables':
        var action = new ActionCommitScaleSelection(false, data.actionUUID);
        action.setPreDrawablesGData(data.preDrawablesGData);
        action.setPostDrawablesGData(data.postDrawablesGData);
        action.performAction();
        break;
      case 'commitImage':
        var image = new BDKImage(BDKanvasInstance.context, data.imageData);
        var action = new ActionCommitImage(image,false, data.actionUUID);
        action.performAction();
        break;
      case 'changeDrawablesProperty':
        var action = new ActionChangeDrawablesProperty(data.drawablesUUID, data.pname, data.pvalue,false, data.actionUUID);
        action.performAction();
        break;
    }
  }

  sendCommitBrush(id, actUUID) {
    let obj = this;
    var msg = {
      type: 'sync',
      cid: obj.cid,
      sid: obj.sid,
      actionType: 'commitbrush',
      brushUUID: id,
      actionUUID: actUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendBeginDrawingBrush(id) {
    let obj = this;
    var lineData = BDKanvas.getInstance().getDrawable(id).serialize();
    var msg = {
      type: 'sync',
      cid: obj.cid,
      sid: obj.sid,
      actionType: 'begindrawbrush',
      lineData: lineData
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendAddBrushPoint(id, point) {
    let obj = this;
    var pointData = point.serialize();
    var msg = {
      type: 'sync',
      cid: obj.cid,
      sid: obj.sid,
      actionType: 'addbrushpoint',
      brushUUID: id,
      pointData: pointData
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendLine(id, actUUID) {
    let obj = this;
    var lineData = BDKanvas.getInstance().getDrawable(id).serialize();
    var msg = {
      type: 'sync',
      cid: obj.cid,
      sid: obj.sid,
      actionType: 'drawline',
      lineData: lineData,
      actionUUID: actUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendCircle(id, actUUID) {
    let obj = this;
    var circleData = BDKanvas.getInstance().getDrawable(id).serialize();
    var msg = {
      type: 'sync',
      cid: obj.cid,
      sid: obj.sid,
      actionType: 'drawcircle',
      circleData: circleData,
      actionUUID: actUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendConfig(oldConfig, newConfig, actionUUID) {
    let obj = this;
    var msg = {
      type: 'sync',
      cid: obj.cid,
      sid: obj.sid,
      actionType: 'changeConfig',
      oldConfig: oldConfig,
      newConfig: newConfig,
      actionUUID: actionUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendAction(data) {
    switch (data.action) {
      case 'beginDrawingBrush':
        this.sendBeginDrawingBrush(data.uuid);
        break;
      case 'addBrushPoint':
        this.sendAddBrushPoint(data.uuid, data.point);
        break;
      case 'commitBrush':
        this.sendCommitBrush(data.uuid, data.actionUUID);
        break;
      case 'endDrawingLine':
        this.sendLine(data.uuid, data.actionUUID);
        break;
      case 'endDrawingCircle':
        this.sendCircle(data.uuid, data.actionUUID);
        break;
      case 'changeConfig':
        this.sendConfig(data.oldConfig, data.newConfig, data.actionUUID);
        break;
      case 'endMovingSelection':
        this.sendEndMovingSelection(data);
        break;
      case 'deleteDrawables':
        this.sendDeleteDrawables(data);
        break;
      case 'pasteDrawables':
        this.pasteDrawables(data);
        break;
      case 'scaleDrawables':
        this.scaleDrawables(data);
        break;
      case 'commitImage':
        this.sendCommitImage(data);
        break;
      case 'changeDrawablesProperty':
        this.changeDrawablesProperty(data);
        break;
    }
  }

  processEvent(evt, data) {
    this.statemachine.processEvent(evt, data);
  }

  pong(pnum) {
    var msg = {
      type: 'pong',
      cid: this.cid,
      sid: this.sid,
      num: pnum
    };

    this.ws.send(JSON.stringify(msg));
  }

  undoredo(type, uuid){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionUUID: uuid,
      actionType: type
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendLoadFile(data){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionType: "loadfile",
      filedata: data
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendEndMovingSelection(data){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionType: "endMovingSelection",
      drawablesUUID: data.drawablesUUID,
      actionUUID: data.actionUUID,
      initialPoint: data.initialPoint,
      finalPoint: data.finalPoint
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendDeleteDrawables(data){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionType: "deleteDrawables",
      drawablesUUID: data.drawablesUUID,
      actionUUID: data.actionUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  pasteDrawables(data){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionType: "pasteDrawables",
      drawablesData: data.drawablesData,
      actionUUID: data.actionUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  sendCommitImage(data){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionType: "commitImage",
      imageData: data.imageData,
      actionUUID: data.actionUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  scaleDrawables(data){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionType: "scaleDrawables",
      preDrawablesGData: data.preDrawablesGData,
      postDrawablesGData: data.postDrawablesGData,
      actionUUID: data.actionUUID
    };

    this.ws.send(JSON.stringify(msg));
  }

  changeDrawablesProperty(data){
    var msg = {
      type: 'sync',
      cid: this.cid,
      sid: this.sid,
      actionType: "changeDrawablesProperty",
      drawablesUUID: data.drawablesUUID,
      pname: data.pname,
      pvalue: data.pvalue,
      actionUUID: data.actionUUID
    };

    this.ws.send(JSON.stringify(msg));
  }
}
