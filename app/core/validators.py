"""
統一的なバリデーション機能
経費入力における金額検証を統一的に処理します
"""

from decimal import Decimal, InvalidOperation
from typing import Any, Union
from pydantic import field_validator
import re


class AmountValidator:
    """
    金額入力の統一バリデーター
    日本円での整数金額のみを受け入れます
    """
    
    @staticmethod
    def validate_amount(value: Any) -> Decimal:
        """
        金額の統一バリデーション
        
        Args:
            value: 入力値（数値、文字列、Decimal）
            
        Returns:
            Decimal: 検証済みの金額（小数点以下2桁、.00形式）
            
        Raises:
            ValueError: 無効な金額の場合
        """
        if value is None:
            raise ValueError("金額は必須です")
        
        # 文字列の場合の前処理
        if isinstance(value, str):
            # 空文字チェック
            if not value.strip():
                raise ValueError("金額は必須です")
            
            # 数字以外の文字が含まれているかチェック（ピリオドとマイナス以外）
            if not re.match(r'^-?\d*\.?\d*$', value.strip()):
                raise ValueError("金額には数字のみ入力してください")
        
        # Decimal変換
        try:
            if isinstance(value, str):
                decimal_value = Decimal(value.strip())
            else:
                decimal_value = Decimal(str(value))
        except (InvalidOperation, ValueError):
            raise ValueError("有効な数値を入力してください")
        
        # 負の値チェック
        if decimal_value < 0:
            raise ValueError("金額は0以上で入力してください")
        
        # 最大値チェック（9,999,999円）
        max_amount = Decimal('9999999')
        if decimal_value > max_amount:
            raise ValueError("金額は9,999,999円以下で入力してください")
        
        # 小数点以下のチェック
        # 整数部分のみを受け入れ、小数点以下があればエラー
        if decimal_value % 1 != 0:
            raise ValueError("金額は整数で入力してください（小数点以下は入力できません）")
        
        # 整数として処理し、.00形式で返す
        return Decimal(int(decimal_value)).quantize(Decimal('0.00'))


def amount_field_validator(field_name: str = 'amount'):
    """
    Pydanticフィールドバリデーター用のデコレーター関数
    
    Args:
        field_name: バリデーション対象のフィールド名
        
    Returns:
        field_validator: Pydanticのfield_validatorデコレーター
    """
    return field_validator(field_name)(AmountValidator.validate_amount)