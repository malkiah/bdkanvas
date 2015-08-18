from tornado import websocket, web, ioloop, httpserver
import json, time, threading

class ClientHandler(websocket.WebSocketHandler):
    """docstring for ClientHandler"""

    STATE_NO_SESSION = 0;
    STATE_WAIT_SYNC = 1;
    STATE_SESSION = 2;

    def __init__(self, application, request):
        super(ClientHandler, self).__init__(application, request)
        self.state = self.STATE_NO_SESSION
        self.sid = 0
        self.cid = 0
        self.failedConns = 0
        self.alive = True
        self.numPing = 0
        self.lastPing = 0
        self.serverInstance = application.settings["serverInstance"]
        self.pingThread = threading.Thread(target = self.checkConnection)
        self.user = None

    def open(self):
        msg = {}
        msg['response'] = 'ok'
        self.write_message(msg)
        self.serverInstance.logMessage("Client connected. Waiting for its session.")

    def join_valid_session(self, data):
        self.sid = data['sid']
        self.cid = data['cid']
        result = {}
        result['response'] = False
        result['message'] = ''
        continue_user = False
        # Si no es anonima, validamos el usuario
        if data['anonymous'] == False:
            self.user = self.serverInstance.validate_user(data['username'], data['password'])
            # Si el usuario no es correcto, no continuamos por el usuario
            if (self.user == None):
                result['message'] = "Incorrect username or password."
            # Si el usuario es correcto, continuamos por el usuario
            else:
                continue_user = True
        # Si es anonima, no hace falta validar el usuario
        else:
            continue_user = True
        # Si el usuario esta validado
        if continue_user:
            # Si la sesion no existe
            if not self.serverInstance.session_exists(data['sid']):
                # Intenamos crear la sesion
                result = self.serverInstance.create_session(data['sid'], self.user, data['others'],data['protect'])
                # Si se ha creado
                if result['response']:
                    # Intentamos unirnos
                    result = self.serverInstance.add_client_to_session(data['sid'], self, data['protect'])
            # Si existe, intentamos unirnos
            else:
                result = self.serverInstance.add_client_to_session(data['sid'], self, data['protect'])
        if not result['response']:
            self.sid = 0;
            self.cid = 0;
            self.user = None
        return result

    def on_message(self, msg):
        data = json.loads(msg)
        if self.state == self.STATE_NO_SESSION:
            # Only accept "join" messages
            if data['type'] == "join":
                r = self.join_valid_session(data)
                if (r['response']):
                    self.state = self.STATE_WAIT_SYNC
                    self.serverInstance.logMessage("Adding {0} to {1}.".format(self.cid, self.sid))
                    msg = {}
                    msg['response'] = 'connected'
                    self.write_message(msg)
                    self.pingThread.start()
                else:
                    self.send_error_and_disconnect(r['message'])
        if self.state == self.STATE_WAIT_SYNC:
            if data['type'] == 'request_sync':
                self.serverInstance.logMessage("{0} requests sync.".format(data['cid']))
                self.syncPrevious()
                self.state = self.STATE_SESSION
        elif self.state == self.STATE_SESSION:
            if data['type'] == "sync":
                self.serverInstance.logMessage("Syncing from {0}.".format(data['cid']))
                clients = self.serverInstance.get_clients_from_session(self.sid)
                data['response'] = 'sync'
                msg_response = json.dumps(data)
                for client_id in clients:
                    if client_id != self.cid:
                        clients[client_id].sync(msg_response)
                self.serverInstance.add_message_to_session(self.sid, msg_response)
            elif data['type'] == "pong":
                self.lastPing = data['num'];

    def on_close(self):
        if self.state == self.STATE_SESSION:
            self.serverInstance.logMessage("{0} closed its connection.".format(self.cid))
            self.serverInstance.remove_client_from_session(self.sid, self.cid)
            self.alive = False

    def check_origin(self, origin):
        return True

    def syncPrevious(self):
        messages = self.serverInstance.get_messages_from_session(self.sid)
        for msg in messages:
            self.sync(msg)

    def sync(self, msg):
        self.serverInstance.logMessage("Syncing message to {0}.".format(self.cid))
        self.write_message(msg)

    def send_error_and_disconnect(self, message):
        msg = {}
        msg['response'] = 'error'
        msg['message'] = message
        self.alive = False
        self.write_message(msg)
        self.close()

    def checkConnection(self):
        time.sleep(10)
        while self.alive:
            if (self.numPing - self.lastPing) < 5:
                msg = {}
                msg['response'] = 'ping'
                msg['num'] = self.numPing
                self.write_message(msg)
                self.numPing = self.numPing + 1
                time.sleep(10)
            else:
                self.serverInstance.logMessage("Too many lost pings from {0}. Disconnecting.".format(self.cid))
                self.alive = False
                self.serverInstance.remove_client_from_session(self.sid, self.cid)
                self.close()
                self.serverInstance.logMessage("{0} has been disconnected.".format(self.cid))
