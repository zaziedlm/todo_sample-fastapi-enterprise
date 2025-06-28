from typing import List, Optional
from app.repositories.category_repository import CategoryRepository
from app.api.schemas.category import CategoryCreate, CategoryUpdate, CategoryRead
from app.models.category import Category


class CategoryService:
    def __init__(self, category_repo: CategoryRepository):
        self.category_repo = category_repo

    def create_category(self, category_data: CategoryCreate) -> CategoryRead:
        category = self.category_repo.create_category(category_data)
        return CategoryRead.model_validate(category)

    def get_category(self, category_id: int) -> Optional[CategoryRead]:
        category = self.category_repo.get_category(category_id)
        if category:
            return CategoryRead.model_validate(category)
        return None

    def get_categories(self) -> List[CategoryRead]:
        categories = self.category_repo.get_categories()
        return [CategoryRead.model_validate(category) for category in categories]

    def update_category(self, category_id: int, category_data: CategoryUpdate) -> Optional[CategoryRead]:
        category = self.category_repo.update_category(category_id, category_data)
        if category:
            return CategoryRead.model_validate(category)
        return None

    def delete_category(self, category_id: int) -> bool:
        return self.category_repo.delete_category(category_id)

    def init_default_categories(self) -> None:
        """初期カテゴリーを作成"""
        default_categories = [
            {"name": "食費", "description": "食事・食材費", "color": "#FF6B6B"},
            {"name": "交通費", "description": "電車・バス・タクシー", "color": "#4ECDC4"},
            {"name": "光熱費", "description": "電気・ガス・水道", "color": "#45B7D1"},
            {"name": "通信費", "description": "携帯・インターネット", "color": "#96CEB4"},
            {"name": "住居費", "description": "家賃・管理費", "color": "#FECA57"},
            {"name": "医療費", "description": "病院・薬代", "color": "#FF9FF3"},
            {"name": "娯楽費", "description": "映画・ゲーム・趣味", "color": "#54A0FF"},
            {"name": "衣服費", "description": "洋服・靴・アクセサリー", "color": "#5F27CD"},
            {"name": "教育費", "description": "書籍・セミナー・講座", "color": "#00D2D3"},
            {"name": "その他", "description": "分類されないその他の支出", "color": "#C4C4C4"}
        ]
        
        existing_categories = self.get_categories()
        if not existing_categories:
            for cat_data in default_categories:
                self.create_category(CategoryCreate(**cat_data))
