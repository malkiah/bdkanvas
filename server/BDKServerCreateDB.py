import sqlite3

def main(argv):
    conn = sqlite3.connect('BDKanvas.db')

    c = conn.cursor()
    c.execute('''CREATE TABLE users
                (username text, password text, maxsessions int)
            ''')

    conn.commit()
