from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, create_engine
from app.core.config import settings
from app.services.expense_service import ExpenseService
from app.api.schemas.expense import ExpenseEntryCreate, ExpenseEntryRead, ExpenseEntryUpdate, MonthlySummary
from typing import List, Optional
from datetime import date

router = APIRouter(prefix="/expenses", tags=["expenses"])

engine = create_engine(settings.DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


@router.get("/", response_model=List[ExpenseEntryRead])
def read_entries(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    session: Session = Depends(get_session)
):
    service = ExpenseService(session)
    if start_date and end_date:
        return service.get_entries_by_date_range(start_date, end_date)
    return service.list_entries()


@router.get("/{entry_id}", response_model=ExpenseEntryRead)
def read_entry(entry_id: int, session: Session = Depends(get_session)):
    service = ExpenseService(session)
    entry = service.get_entry(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.get("/summary/{year}/{month}", response_model=MonthlySummary)
def get_monthly_summary(
    year: int,
    month: int,
    session: Session = Depends(get_session)
):
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Invalid month")
    
    service = ExpenseService(session)
    return service.get_monthly_summary(year, month)


@router.post("/", response_model=ExpenseEntryRead, status_code=201)
def create_entry(entry: ExpenseEntryCreate, session: Session = Depends(get_session)):
    service = ExpenseService(session)
    return service.create_entry(entry)


@router.put("/{entry_id}", response_model=ExpenseEntryRead)
def update_entry(
    entry_id: int,
    entry_data: ExpenseEntryUpdate,
    session: Session = Depends(get_session)
):
    service = ExpenseService(session)
    updated = service.update_entry(entry_id, entry_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Entry not found")
    return updated


@router.delete("/{entry_id}", response_model=ExpenseEntryRead)
def delete_entry(entry_id: int, session: Session = Depends(get_session)):
    service = ExpenseService(session)
    deleted = service.delete_entry(entry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entry not found")
    return deleted