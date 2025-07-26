"""
APIレベルでのバリデーション動作確認テスト
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_decimal_amount_rejection():
    """小数点を含む金額がAPIレベルで拒否されるかテスト"""
    
    # 小数点を含む金額でPOSTリクエスト
    response = client.post("/expenses/", json={
        "amount": 123.45,
        "category_id": 1,
        "date": "2025-01-01",
        "memo": "test decimal"
    })
    
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.json()}")
    
    # バリデーションエラーが返されることを期待
    assert response.status_code == 422
    error_details = response.json()
    assert "detail" in error_details
    print("✓ 小数点を含む金額は正常に拒否されました")

def test_valid_integer_amount():
    """整数金額が正常に受け入れられるかテスト"""
    
    response = client.post("/expenses/", json={
        "amount": 1000,
        "category_id": 1,
        "date": "2025-01-01",
        "memo": "test integer"
    })
    
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.json()}")
    
    if response.status_code == 201 or response.status_code == 200:
        print("✓ 整数金額は正常に受け入れられました")
    else:
        print(f"× 整数金額が拒否されました: {response.json()}")

def test_string_decimal_amount():
    """文字列の小数点金額がAPIレベルで拒否されるかテスト"""
    
    response = client.post("/expenses/", json={
        "amount": "123.45",
        "category_id": 1,
        "date": "2025-01-01",
        "memo": "test string decimal"
    })
    
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.json()}")
    
    # バリデーションエラーが返されることを期待
    assert response.status_code == 422
    print("✓ 文字列の小数点金額は正常に拒否されました")

if __name__ == "__main__":
    print("=== APIバリデーション動作確認 ===")
    
    try:
        test_decimal_amount_rejection()
    except AssertionError as e:
        print(f"× 小数点金額のバリデーションが失敗: {e}")
    
    try:
        test_valid_integer_amount()
    except Exception as e:
        print(f"× 整数金額のテストが失敗: {e}")
    
    try:
        test_string_decimal_amount()
    except AssertionError as e:
        print(f"× 文字列小数点金額のバリデーションが失敗: {e}")
    
    print("=== テスト完了 ===")