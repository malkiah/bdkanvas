class BDKanvasSession(object):
    """docstring for BDKanvasSession"""
    def __init__(self, serverInstance, sid, owner, allow_others, protect):
        super(BDKanvasSession, self).__init__()
        self.sid = sid
        self.owner = owner
        self.allow_others = allow_others
        self.protect = protect
        self.messages = []
        self.clients = {}
        self.serverInstance = serverInstance
        self.serverInstance.logMessage("Creating session {0}.".format(sid))

    def get_client_number(self):
        return len(self.clients)

    def add_client(self, client, protect):
        self.serverInstance.logMessage("Joining {0} to {1}.".format(client.cid, self.sid))
        result = {}
        result['response'] = False
        result['message'] = ''
        # Si es anonima, sin problemas
        if self.owner == None:
            result['response'] = True
            self.clients[client.cid] = client
        # Si no es anonima
        else:
            # Si permite otros
            if self.allow_others:
                # Si tiene clave
                if self.protect != '' and self.protect != None:
                    # Si la clave es correcta, sin problemas
                    if self.protect == protect:
                        result['response'] = True
                        self.clients[client.cid] = client
                    # Si la clave no es correcta, error
                    else:
                        result['response'] = False
                        result['message'] = 'Incorrect session password.'
                # Si no tiene clave, sin problemas
                else:
                    result['response'] = True
                    self.clients[client.cid] = client
            # Si no permite otros
            else:
                # Si el cliente no es anonimo y el usuario es el mismo, sin problemas
                if (client.user != None) and (self.owner.username == client.user.username):
                    result['response'] = True
                    self.clients[client.cid] = client
                # Si el usuario no es el mismo, error
                else:
                    result['response'] = False
                    result['message'] = 'User not allowed in existing session.'
        return result

    def add_message(self, message):
        self.messages.append(message)

    def get_clients(self):
        return self.clients

    def remove_client(self, cid):
        self.serverInstance.logMessage("Removing {0} from {1}.".format(cid, self.sid))
        del self.clients[cid]
        self.serverInstance.logMessage("Removed {0} from {1}.".format(cid, self.sid))

    def get_messages(self):
        return self.messages

    def close_all_clients(self):
        for cid in self.clients:
            self.clients[cid].send_error_and_disconnect("Server closed.")
