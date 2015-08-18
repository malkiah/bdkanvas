import sqlite3, hashlib, sys

if (len(sys.argv) == 4):
    conn = sqlite3.connect('BDKanvas.db')

    c = conn.cursor()
    c.execute('''INSERT INTO users (username, password, maxsessions)
                VALUES (?, ?, ?)
            ''', (sys.argv[1], hashlib.md5(sys.argv[2]).hexdigest(), sys.argv[3]))

    conn.commit()
else:
    print("Usage: BDKServerCreateUser.py username password maxsessions")
