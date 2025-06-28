from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, create_engine
from typing import List, Optional
from datetime import datetime
from app.core.config import settings
from app.repositories.expense_repository import ExpenseRepository
from app.repositories.category_repository import CategoryRepository
from app.services.expense_service import ExpenseService
from app.api.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate, DashboardData

router = APIRouter(prefix="/expenses", tags=["expenses"])

engine = create_engine(settings.DATABASE_URL)


def get_session():
    with Session(engine) as session:
        yield session


def get_expense_service(session: Session = Depends(get_session)) -> ExpenseService:
    expense_repo = ExpenseRepository(session)
    category_repo = CategoryRepository(session)
    return ExpenseService(expense_repo, category_repo)


@router.post("/", response_model=ExpenseRead)
def create_expense(
    expense_data: ExpenseCreate,
    expense_service: ExpenseService = Depends(get_expense_service)
):
    return expense_service.create_expense(expense_data)


@router.get("/", response_model=List[ExpenseRead])
def get_expenses(
    year: Optional[int] = Query(None, description="Filter by year"),
    month: Optional[int] = Query(None, description="Filter by month (1-12)"),
    expense_service: ExpenseService = Depends(get_expense_service)
):
    return expense_service.get_expenses(year, month)


@router.get("/{expense_id}", response_model=ExpenseRead)
def get_expense(
    expense_id: int,
    expense_service: ExpenseService = Depends(get_expense_service)
):
    expense = expense_service.get_expense(expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseRead)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    expense_service: ExpenseService = Depends(get_expense_service)
):
    expense = expense_service.update_expense(expense_id, expense_data)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    expense_service: ExpenseService = Depends(get_expense_service)
):
    success = expense_service.delete_expense(expense_id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted successfully"}


@router.get("/dashboard/data", response_model=DashboardData)
def get_dashboard_data(
    year: Optional[int] = Query(None, description="Year (default: current year)"),
    month: Optional[int] = Query(None, description="Month (default: current month)"),
    expense_service: ExpenseService = Depends(get_expense_service)
):
    now = datetime.now()
    year = year or now.year
    month = month or now.month
    
    return expense_service.get_dashboard_data(year, month)
