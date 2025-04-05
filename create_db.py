import sqlite3

# test.db というファイルに接続（存在しない場合は自動作成）
conn = sqlite3.connect("test.db")

# テーブルを作成（例）
conn.execute('''
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0
)
''')

conn.commit()
conn.close()
