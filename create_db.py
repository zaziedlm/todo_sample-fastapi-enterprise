import sqlite3

# todo.db というファイルに接続（存在しない場合は自動作成）
conn = sqlite3.connect("todo.db")

# テーブルを作成（例）
conn.execute('''
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
''')

conn.commit()
conn.close()
