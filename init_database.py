#!/usr/bin/env python3
"""
データベースの初期化とテーブル作成スクリプト
"""
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings
from app.models.todo import ToDo
from app.models.category import Category
from app.models.expense import Expense
from app.repositories.category_repository import CategoryRepository
from app.services.category_service import CategoryService

def init_database():
    """データベースとテーブルを初期化し、初期カテゴリーを作成"""
    print("データベースを初期化しています...")
    
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
    init_database()
    print("データベースの初期化が完了しました。")
