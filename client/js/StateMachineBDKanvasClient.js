'use strict';

// States
var SMC_NOT_CONNECTED = "SMC_NOT_CONNECTED";
var SMC_WAIT_CONTACT = "SMC_WAIT_CONTACT";
var SMC_WAIT_JOIN = "SMC_WAIT_JOIN";
var SMC_CONNECTED = "SMC_CONNECTED";

// Events
var SMC_EVENT_READY = "SMC_EVENT_READY";
var SMC_EVENT_CONTACTED = "SMC_EVENT_CONTACTED";
var SMC_EVENT_CONNECTED = "SMC_EVENT_CONNECTED";
var SMC_EVENT_SEND_ACTION = "SMC_EVENT_SEND_ACTION";
var SMC_EVENT_MESSAGE = "SMC_EVENT_MESSAGE";
var SMC_EVENT_DISCONNECT = "SMC_EVENT_DISCONNECT";
var SMC_EVENT_DISCONNECTED = "SMC_EVENT_DISCONNECTED";
var SMC_EVENT_PING = "SMC_EVENT_PING";
var SMC_EVENT_ERROR = "SMC_EVENT_ERROR";
var SMC_EVENT_SEND_UNDOREDO = "SMC_EVENT_SEND_UNDOREDO";
var SMC_EVENT_LOAD_FILE = "SMC_EVENT_LOAD_FILE";

class StateMachineBDKanvasClient extends StateMachine
{
  constructor(client)
  {
    super();
    this.client = client;
    this.state = SMC_NOT_CONNECTED;
    this.logic = {
      SMC_NOT_CONNECTED: {
        SMC_EVENT_READY: StateMachineBDKanvasClient.connect,
        SMC_EVENT_ERROR: StateMachineBDKanvasClient.connectError
      },
      SMC_WAIT_CONTACT: {
        SMC_EVENT_CONTACTED: StateMachineBDKanvasClient.contacted,
        SMC_EVENT_DISCONNECTED: StateMachineBDKanvasClient.disconnected,
        SMC_EVENT_ERROR: StateMachineBDKanvasClient.connectError
      },
      SMC_WAIT_JOIN:{
        SMC_EVENT_CONNECTED: StateMachineBDKanvasClient.requestSync,
        SMC_EVENT_DISCONNECTED: StateMachineBDKanvasClient.disconnected,
        SMC_EVENT_ERROR: StateMachineBDKanvasClient.connectError
      },
      SMC_CONNECTED: {
        SMC_EVENT_MESSAGE: StateMachineBDKanvasClient.message,
        SMC_EVENT_SEND_ACTION: StateMachineBDKanvasClient.sendAction,
        SMC_EVENT_DISCONNECTED: StateMachineBDKanvasClient.disconnected,
        SMC_EVENT_PING: StateMachineBDKanvasClient.ping,
        SMC_EVENT_SEND_UNDOREDO: StateMachineBDKanvasClient.undoredo,
        SMC_EVENT_LOAD_FILE: StateMachineBDKanvasClient.loadFile,
        SMC_EVENT_DISCONNECT: StateMachineBDKanvasClient.disconnect,
        SMC_EVENT_ERROR: StateMachineBDKanvasClient.connectError
      }
    };
  }

  static connect(sm, data)
  {
    sm.state = SMC_WAIT_CONTACT;
    sm.client.connect(data);
  }

  static contacted(sm, data)
  {
    sm.state = SMC_WAIT_JOIN;
    sm.client.joinSession();
  }

  static requestSync(sm, data)
  {
    sm.state = SMC_CONNECTED;
    BDKanvasInstance.setConnectedButtons();
    sm.client.requestSync();
  }

  static message(sm, data)
  {
    sm.client.message(data);
  }

  static sendAction(sm, data)
  {
    sm.client.sendAction(data);
  }

  static disconnected(sm, data)
  {
    alert("Session has been disconnected.");
    BDKanvasInstance.setDisconnectedButtons();
    sm.state = SMC_NOT_CONNECTED;
  }

  static disconnect(sm, data)
  {
    sm.client.disconnect();
    BDKanvasInstance.setDisconnectedButtons();
    sm.state = SMC_NOT_CONNECTED;
  }

  static ping(sm, data)
  {
    sm.client.pong(data.num);
  }

  static undoredo(sm, data){
    sm.client.undoredo(data.action, data.uuid);
  }

  static loadFile(sm, data){
    sm.client.sendLoadFile(data);
  }

  static connectError(sm, data){
    sm.client.disconnect();
    alert(data.message);
  }
}
