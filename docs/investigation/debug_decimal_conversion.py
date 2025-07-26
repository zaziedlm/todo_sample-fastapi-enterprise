from decimal import Decimal
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import json

# Test data
test_decimal = Decimal('123.45')

print("=== Decimal → String 変換調査 ===")
print(f"元のDecimal: {test_decimal} (type: {type(test_decimal)})")

# 1. FastAPIのjsonable_encoder
encoded = jsonable_encoder(test_decimal)
print(f"jsonable_encoder結果: {encoded} (type: {type(encoded)})")

# 2. Pydanticモデルでの動作
class TestModel(BaseModel):
    amount: Decimal

model = TestModel(amount=test_decimal)
print(f"Pydanticモデル内: {model.amount} (type: {type(model.amount)})")

# 3. model_dump()の動作
dumped = model.model_dump()
print(f"model_dump()結果: {dumped} (type: {type(dumped['amount'])})")

# 4. model_dump(mode='json')の動作
json_dumped = model.model_dump(mode='json')
print(f"model_dump(mode='json')結果: {json_dumped} (type: {type(json_dumped['amount'])})")

# 5. JSON serialization
json_str = model.model_dump_json()
print(f"model_dump_json()結果: {json_str}")

# 6. dict→jsonable_encoder
dict_data = {"amount": test_decimal}
dict_encoded = jsonable_encoder(dict_data)
print(f"dict→jsonable_encoder: {dict_encoded} (amount type: {type(dict_encoded['amount'])})")