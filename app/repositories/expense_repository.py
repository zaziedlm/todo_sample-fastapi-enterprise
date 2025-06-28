from sqlmodel import Session, select, func, text
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal
from app.models.expense import Expense
from app.models.category import Category
from app.api.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseSummary, MonthlyExpense


class ExpenseRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_expense(self, expense_data: ExpenseCreate) -> Expense:
        expense = Expense(**expense_data.model_dump())
        self.session.add(expense)
        self.session.commit()
        self.session.refresh(expense)
        return expense

    def get_expense(self, expense_id: int) -> Optional[Expense]:
        statement = select(Expense).where(Expense.id == expense_id)
        return self.session.exec(statement).first()

    def get_expenses(self, year: Optional[int] = None, month: Optional[int] = None) -> List[Expense]:
        statement = select(Expense)
        if year and month:
            statement = statement.where(
                func.strftime('%Y', Expense.date) == str(year),
                func.strftime('%m', Expense.date) == f"{month:02d}"
            )
        statement = statement.order_by(Expense.date.desc())
        return self.session.exec(statement).all()

    def update_expense(self, expense_id: int, expense_data: ExpenseUpdate) -> Optional[Expense]:
        expense = self.get_expense(expense_id)
        if expense:
            update_data = expense_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(expense, key, value)
            expense.updated_at = datetime.now()
            self.session.commit()
            self.session.refresh(expense)
        return expense

    def delete_expense(self, expense_id: int) -> bool:
        expense = self.get_expense(expense_id)
        if expense:
            self.session.delete(expense)
            self.session.commit()
            return True
        return False

    def get_monthly_total(self, year: int, month: int) -> Decimal:
        statement = select(func.sum(Expense.amount)).where(
            func.strftime('%Y', Expense.date) == str(year),
            func.strftime('%m', Expense.date) == f"{month:02d}"
        )
        result = self.session.exec(statement).first()
        return result or Decimal('0')

    def get_category_summary(self, year: int, month: int) -> List[ExpenseSummary]:
        statement = select(
            Category.name,
            Category.id,
            Category.color,
            func.sum(Expense.amount).label('total_amount')
        ).join(
            Expense, Category.id == Expense.category_id
        ).where(
            func.strftime('%Y', Expense.date) == str(year),
            func.strftime('%m', Expense.date) == f"{month:02d}"
        ).group_by(Category.id, Category.name, Category.color)
        
        results = self.session.exec(statement).all()
        return [
            ExpenseSummary(
                category_name=result[0],
                category_id=result[1],
                color=result[2],
                total_amount=result[3] or Decimal('0')
            )
            for result in results
        ]

    def get_monthly_trend(self, months: int = 12) -> List[MonthlyExpense]:
        # 過去指定月分の月次合計を取得
        statement = text("""
            SELECT 
                CAST(strftime('%Y', date) AS INTEGER) as year,
                CAST(strftime('%m', date) AS INTEGER) as month,
                SUM(amount) as total_amount
            FROM expense 
            WHERE date >= date('now', '-{} months')
            GROUP BY strftime('%Y-%m', date)
            ORDER BY year, month
        """.format(months))
        
        results = self.session.exec(statement).all()
        return [
            MonthlyExpense(
                year=result[0],
                month=result[1],
                total_amount=result[2] or Decimal('0')
            )
            for result in results
        ]
