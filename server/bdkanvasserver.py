from tornado import websocket, web, ioloop, httpserver
from bdksqlitevalidator import BDKSqliteValidator
from clienthandler import ClientHandler
from bdkanvasuser import BDKanvasUser
from bdkanvassession import BDKanvasSession
import time
import socket, configparser

class BDKanvasServer(object):
    """docstring for BDKanvasServer"""

    def __init__(self):
        super(BDKanvasServer, self).__init__()
        self.sessions = {}
        self.settings = configparser.ConfigParser()
        self.settings.read("config.cfg")
        self.MAX_ANON_SESSIONS = int(self.settings.get('General','MAX_ANON_SESSIONS'))
        self.PRINT_LOG = self.settings.get('General','PRINT_LOG') == 'True'
        validatorclass = self.settings.get('Validator','VALIDATOR_TYPE')
        klass = globals()[validatorclass]
        self.validator = klass()
        self.log = open('server.log','w')

    def logMessage(self, message):
        msg = time.asctime() + " - " + message
        self.log.write(msg + "\n")
        if self.PRINT_LOG:
            print(msg)

    def run(self):
        application = web.Application([
        (r'/bdks', ClientHandler)
        ])
        application.settings["serverInstance"] = self;
        http_server = httpserver.HTTPServer(application)
        http_server.listen(8888)
        myIP = socket.gethostbyname(socket.gethostname())
        msg = "*** Websocket Server Started at {0}".format(myIP)
        self.logMessage(msg)
        try:
            ioloop.IOLoop.instance().start()
        except KeyboardInterrupt:
            self.close_all_sessions()
            ioloop.IOLoop.instance().stop()

    def close_all_sessions(self):
        for sid in self.sessions:
            self.sessions[sid].close_all_clients()

    def get_anon_session_number(self):
        result = 0
        for sid in self.sessions:
            if self.sessions[sid].owner == None:
                result = result + 1
        return result

    def get_anon_session_sids(self):
        result = ''
        for sid in self.sessions:
            if self.sessions[sid].owner == None:
                if result != '':
                    result = result + ', '
                result = result + sid
        return result

    def get_user_session_number(self, username):
        result = 0
        for sid in self.sessions:
            if (self.sessions[sid].owner != None) and (self.sessions[sid].owner.username == username):
                result = result + 1
        return result

    def create_session(self, sid, owner, allow_others, protect):
        result = {}
        result['response'] = False
        result['message'] = ''
        # Si es anonima
        if owner == None:
            anon_num = self.get_anon_session_number()
            self.logMessage('Trying to create an anonymous session. {0} of {1} existing.'.format(anon_num,self.MAX_ANON_SESSIONS))
            # Si se ha llegado al maximo de sesiones anonimas, error
            if anon_num >= self.MAX_ANON_SESSIONS:
                names = self.get_anon_session_sids()
                result['response'] = False
                result['message'] = 'No more anonymous sessions allowed. Try connecting to: ' + names
            # Si no se ha llegado al maximo de sesiones anonimas, se crea
            else:
                self.sessions[sid] = BDKanvasSession(self, sid, None, True, None)
                result['response'] = True
        # Si no es anonima
        else:
            # Si se ha llegado al maximo de sesiones del usuario, error
            if self.get_user_session_number(owner.username) >= owner.max_sessions:
                result['response'] = False
                result['message'] = 'No more sessions allowed for this user.'
            # Si no se ha llegado al maximo de sesiones del usuario, se crea
            else:
                self.sessions[sid] = BDKanvasSession(self, sid, owner, allow_others, protect)
                result['response'] = True
        return result

    def add_client_to_session(self, sid, client, protect):
        result = {}
        result['response'] = False
        result['message'] = ''
        if sid in self.sessions:
            result = self.sessions[sid].add_client(client, protect)
        else:
            result['message'] = 'Session does not exist'
        return result

    def remove_client_from_session(self, sid, cid):
        self.sessions[sid].remove_client(cid)
        if self.sessions[sid].get_client_number() == 0:
            self.logMessage("No more clients in {0}. Destroying session.".format(sid))
            del self.sessions[sid]

    def get_clients_from_session(self, sid):
        return self.sessions[sid].get_clients()

    def add_message_to_session(self, sid, msg):
        self.sessions[sid].add_message(msg)

    def get_messages_from_session(self, sid):
        return self.sessions[sid].get_messages()

    def validate_user(self, username, password):
        return self.validator.validate_user(username, password)

    def session_exists(self, sid):
        return sid in self.sessions

serverInstance = BDKanvasServer()
serverInstance.run()
