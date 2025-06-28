from typing import List, Optional
from datetime import datetime
from app.repositories.expense_repository import ExpenseRepository
from app.repositories.category_repository import CategoryRepository
from app.api.schemas.expense import (
    ExpenseCreate, ExpenseUpdate, ExpenseRead, 
    ExpenseSummary, MonthlyExpense, DashboardData
)


class ExpenseService:
    def __init__(self, expense_repo: ExpenseRepository, category_repo: CategoryRepository):
        self.expense_repo = expense_repo
        self.category_repo = category_repo

    def create_expense(self, expense_data: ExpenseCreate) -> ExpenseRead:
        expense = self.expense_repo.create_expense(expense_data)
        return ExpenseRead.model_validate(expense)

    def get_expense(self, expense_id: int) -> Optional[ExpenseRead]:
        expense = self.expense_repo.get_expense(expense_id)
        if expense:
            return ExpenseRead.model_validate(expense)
        return None

    def get_expenses(self, year: Optional[int] = None, month: Optional[int] = None) -> List[ExpenseRead]:
        expenses = self.expense_repo.get_expenses(year, month)
        return [ExpenseRead.model_validate(expense) for expense in expenses]

    def update_expense(self, expense_id: int, expense_data: ExpenseUpdate) -> Optional[ExpenseRead]:
        expense = self.expense_repo.update_expense(expense_id, expense_data)
        if expense:
            return ExpenseRead.model_validate(expense)
        return None

    def delete_expense(self, expense_id: int) -> bool:
        return self.expense_repo.delete_expense(expense_id)

    def get_dashboard_data(self, year: int, month: int) -> DashboardData:
        monthly_total = self.expense_repo.get_monthly_total(year, month)
        category_summary = self.expense_repo.get_category_summary(year, month)
        monthly_trend = self.expense_repo.get_monthly_trend(12)
        
        return DashboardData(
            monthly_total=monthly_total,
            category_summary=category_summary,
            monthly_trend=monthly_trend
        )
