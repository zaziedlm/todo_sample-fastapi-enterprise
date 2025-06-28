from sqlmodel import Session, select
from typing import List, Optional
from app.models.category import Category
from app.api.schemas.category import CategoryCreate, CategoryUpdate


class CategoryRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_category(self, category_data: CategoryCreate) -> Category:
        category = Category(**category_data.model_dump())
        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category

    def get_category(self, category_id: int) -> Optional[Category]:
        statement = select(Category).where(Category.id == category_id)
        return self.session.exec(statement).first()

    def get_categories(self) -> List[Category]:
        statement = select(Category)
        return self.session.exec(statement).all()

    def update_category(self, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        category = self.get_category(category_id)
        if category:
            update_data = category_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(category, key, value)
            self.session.commit()
            self.session.refresh(category)
        return category

    def delete_category(self, category_id: int) -> bool:
        category = self.get_category(category_id)
        if category:
            self.session.delete(category)
            self.session.commit()
            return True
        return False
