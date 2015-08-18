import sqlite3
from bdkanvasuser import BDKanvasUser
from bdkvalidator import BDKValidator

class BDKSqliteValidator(BDKValidator):
    """docstring for BDKSqliteValidator"""

    def __init__(self):
        super(BDKSqliteValidator, self).__init__()

    def validate_user(self, username, password):
        result = None

        conn = sqlite3.connect('BDKanvas.db')

        c = conn.cursor()
        c.execute('''SELECT username, maxsessions FROM users WHERE username = ? AND password = ?''',(username, password))

        udata = c.fetchone()

        if udata != None:
            result = BDKanvasUser(udata[0], udata[1])

        conn.close()


        return result
