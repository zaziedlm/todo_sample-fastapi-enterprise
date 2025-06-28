from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, create_engine
from typing import List
from app.core.config import settings
from app.repositories.category_repository import CategoryRepository
from app.services.category_service import CategoryService
from app.api.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])

engine = create_engine(settings.DATABASE_URL)


def get_session():
    with Session(engine) as session:
        yield session


def get_category_service(session: Session = Depends(get_session)) -> CategoryService:
    category_repo = CategoryRepository(session)
    return CategoryService(category_repo)


@router.post("/", response_model=CategoryRead)
def create_category(
    category_data: CategoryCreate,
    category_service: CategoryService = Depends(get_category_service)
):
    return category_service.create_category(category_data)


@router.get("/", response_model=List[CategoryRead])
def get_categories(
    category_service: CategoryService = Depends(get_category_service)
):
    return category_service.get_categories()


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(
    category_id: int,
    category_service: CategoryService = Depends(get_category_service)
):
    category = category_service.get_category(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    category_service: CategoryService = Depends(get_category_service)
):
    category = category_service.update_category(category_id, category_data)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    category_service: CategoryService = Depends(get_category_service)
):
    success = category_service.delete_category(category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}


@router.post("/init-defaults")
def init_default_categories(
    category_service: CategoryService = Depends(get_category_service)
):
    category_service.init_default_categories()
    return {"message": "Default categories initialized"}
