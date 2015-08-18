class BDKanvasUser(object):
    """docstring for BDKanvasServer"""

    def __init__(self, username, max_sessions):
        super(BDKanvasUser, self).__init__()
        self.username = username
        self.max_sessions = max_sessions

    def get_username(self):
        return self.username

    def get_max_sessions(self):
        return self.max_sessions
