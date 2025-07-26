"""
金額バリデーション機能のテスト
"""

import pytest
from decimal import Decimal
from pydantic import ValidationError
from app.core.validators import AmountValidator
from app.api.schemas.expense import ExpenseCreate, ExpenseUpdate


class TestAmountValidator:
    """AmountValidatorクラスのテスト"""
    
    def test_valid_integer_amounts(self):
        """有効な整数金額のテスト"""
        test_cases = [
            (1000, Decimal('1000.00')),
            ('1000', Decimal('1000.00')),
            (0, Decimal('0.00')),
            ('0', Decimal('0.00')),
            (9999999, Decimal('9999999.00')),
        ]
        
        for input_val, expected in test_cases:
            result = AmountValidator.validate_amount(input_val)
            assert result == expected, f"Input: {input_val}, Expected: {expected}, Got: {result}"
    
    def test_invalid_decimal_amounts(self):
        """無効な小数点を含む金額のテスト"""
        test_cases = [
            123.45,
            '123.45',
            Decimal('123.45'),
            '1000.1',
            '0.01',
        ]
        
        for input_val in test_cases:
            with pytest.raises(ValueError, match="金額は整数で入力してください"):
                AmountValidator.validate_amount(input_val)
    
    def test_invalid_negative_amounts(self):
        """負の金額のテスト"""
        test_cases = [-1, '-1', -100.5, '-100']
        
        for input_val in test_cases:
            with pytest.raises(ValueError, match="金額は0以上で入力してください"):
                AmountValidator.validate_amount(input_val)
    
    def test_invalid_string_inputs(self):
        """無効な文字列入力のテスト"""
        test_cases = [
            'abc',
            '1000円',
            '1,000',
            '1000.00円',
            '¥1000',
            '',
            '   ',
        ]
        
        for input_val in test_cases:
            with pytest.raises(ValueError):
                AmountValidator.validate_amount(input_val)
    
    def test_none_input(self):
        """None入力のテスト"""
        with pytest.raises(ValueError, match="金額は必須です"):
            AmountValidator.validate_amount(None)
    
    def test_max_amount_exceeded(self):
        """上限金額超過のテスト"""
        with pytest.raises(ValueError, match="金額は9,999,999円以下で入力してください"):
            AmountValidator.validate_amount(10000000)


class TestExpenseCreateValidation:
    """ExpenseCreateスキーマのバリデーションテスト"""
    
    def test_valid_expense_creation(self):
        """有効な支出データの作成テスト"""
        expense_data = {
            'amount': 1000,
            'category_id': 1,
            'date': '2025-01-01',
            'memo': 'テスト支出'
        }
        
        expense = ExpenseCreate(**expense_data)
        assert expense.amount == Decimal('1000.00')
    
    def test_invalid_decimal_amount_in_expense_create(self):
        """ExpenseCreateでの無効な小数点金額テスト"""
        expense_data = {
            'amount': 123.45,
            'category_id': 1,
            'date': '2025-01-01',
            'memo': 'テスト支出'
        }
        
        with pytest.raises(ValidationError) as exc_info:
            ExpenseCreate(**expense_data)
        
        errors = exc_info.value.errors()
        assert len(errors) == 1
        assert errors[0]['loc'] == ('amount',)
        assert "金額は整数で入力してください" in errors[0]['msg']
    
    def test_string_amount_validation(self):
        """文字列金額のバリデーションテスト"""
        expense_data = {
            'amount': '1500',
            'category_id': 1,
            'date': '2025-01-01',
            'memo': 'テスト支出'
        }
        
        expense = ExpenseCreate(**expense_data)
        assert expense.amount == Decimal('1500.00')


class TestExpenseUpdateValidation:
    """ExpenseUpdateスキーマのバリデーションテスト"""
    
    def test_valid_expense_update(self):
        """有効な支出更新データのテスト"""
        update_data = {
            'amount': 2000,
            'category_id': 2,
        }
        
        expense_update = ExpenseUpdate(**update_data)
        assert expense_update.amount == Decimal('2000.00')
    
    def test_none_amount_in_update(self):
        """ExpenseUpdateでのamount=Noneテスト"""
        update_data = {
            'category_id': 2,
            'memo': '更新されたメモ'
        }
        
        expense_update = ExpenseUpdate(**update_data)
        assert expense_update.amount is None
    
    def test_invalid_decimal_amount_in_update(self):
        """ExpenseUpdateでの無効な小数点金額テスト"""
        update_data = {
            'amount': 456.78,
            'category_id': 2,
        }
        
        with pytest.raises(ValidationError) as exc_info:
            ExpenseUpdate(**update_data)
        
        errors = exc_info.value.errors()
        assert len(errors) == 1
        assert errors[0]['loc'] == ('amount',)
        assert "金額は整数で入力してください" in errors[0]['msg']


if __name__ == "__main__":
    pytest.main([__file__])