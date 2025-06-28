#!/usr/bin/env python3
"""
データベースを完全に削除して再作成するスクリプト
"""
import os
import sys
import sqlite3
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings
from app.models.todo import ToDo
from app.models.category import Category
from app.models.expense import Expense
from app.repositories.category_repository import CategoryRepository
from app.services.category_service import CategoryService

def recreate_database():
    """データベースを完全に削除して再作成"""
    print("データベースを再作成しています...")
    
    # データベースファイルを削除
    db_file = "todo.db"
    if os.path.exists(db_file):
        try:
            os.remove(db_file)
            print(f"{db_file} を削除しました。")
        except Exception as e:
            print(f"データベースファイルの削除に失敗しました: {e}")
            print("手動でサーバーを停止してから再実行してください。")
            return
    
    # エンジンを作成
    engine = create_engine(settings.DATABASE_URL, echo=True)
    
    # 全てのテーブルを作成
    SQLModel.metadata.create_all(engine)
    print("テーブルが作成されました。")
    
    # 初期カテゴリーを作成
    print("初期カテゴリーを作成しています...")
    try:
        with Session(engine) as session:
            category_repo = CategoryRepository(session)
            category_service = CategoryService(category_repo)
            category_service.init_default_categories()
            print("初期カテゴリーが作成されました。")
    except Exception as e:
        print(f"初期カテゴリーの作成に失敗しました: {e}")

if __name__ == "__main__":
    recreate_database()
    print("データベースの再作成が完了しました。")
