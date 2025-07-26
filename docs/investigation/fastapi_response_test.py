import sys
import traceback
from decimal import Decimal
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder

class TestExpense(BaseModel):
    amount: Decimal
    name: str

app = FastAPI()

# モンキーパッチして呼び出しを追跡
original_model_dump = TestExpense.model_dump
original_model_dump_json = TestExpense.model_dump_json

def tracked_model_dump(self, **kwargs):
    print(f"=== model_dump called with kwargs: {kwargs} ===")
    traceback.print_stack(limit=5)
    result = original_model_dump(self, **kwargs)
    print(f"=== model_dump result: {result} ===")
    return result

def tracked_model_dump_json(self, **kwargs):
    print(f"=== model_dump_json called with kwargs: {kwargs} ===")
    traceback.print_stack(limit=5)
    result = original_model_dump_json(self, **kwargs)
    print(f"=== model_dump_json result: {result} ===")
    return result

TestExpense.model_dump = tracked_model_dump
TestExpense.model_dump_json = tracked_model_dump_json

@app.get("/test-response")
def test_response():
    expense = TestExpense(amount=Decimal('123.45'), name="test")
    print(f"Returning expense: {expense}")
    return expense

# テスト実行
if __name__ == "__main__":
    from fastapi.testclient import TestClient
    
    client = TestClient(app)
    print("=== FastAPI Response Test ===")
    response = client.get("/test-response")
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.text}")
    print(f"Response JSON: {response.json()}")