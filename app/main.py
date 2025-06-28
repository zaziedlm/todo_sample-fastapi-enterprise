from fastapi import FastAPI
from fastapi_mcp import FastApiMCP
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine
from app.core.config import settings
from app.api.endpoints import todo, category, expense
# モデルをインポートしてテーブル作成を確実にする
from app.models.todo import ToDo
from app.models.category import Category
from app.models.expense import Expense

app = FastAPI(title="ToDo Sample App")

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.jsの開発サーバーのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine(settings.DATABASE_URL, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # 初期カテゴリーの作成
    try:
        from sqlmodel import Session
        from app.repositories.category_repository import CategoryRepository
        from app.services.category_service import CategoryService
        
        with Session(engine) as session:
            category_repo = CategoryRepository(session)
            category_service = CategoryService(category_repo)
            category_service.init_default_categories()
    except Exception as e:
        print(f"Failed to initialize default categories: {e}")


app.include_router(todo.router)
app.include_router(category.router)
app.include_router(expense.router)

mcp = FastApiMCP(app)
mcp.mount()
