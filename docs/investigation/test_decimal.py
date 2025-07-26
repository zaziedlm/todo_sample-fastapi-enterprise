from decimal import Decimal
import json
from fastapi.encoders import jsonable_encoder

print("=== Decimal JSON serialization test ===")
d = Decimal('123.45')
print(f"Decimal: {d}")
print(f"Type: {type(d)}")

try:
    json_result = json.dumps(d)
    print(f"JSON dumps: {json_result}")
except Exception as e:
    print(f"JSON dumps Error: {e}")

# FastAPI jsonable_encoder test
fastapi_result = jsonable_encoder(d)
print(f"FastAPI jsonable_encoder: {fastapi_result}")
print(f"FastAPI result type: {type(fastapi_result)}")

# Test with dict
data = {"amount": d}
fastapi_dict_result = jsonable_encoder(data)
print(f"FastAPI dict result: {fastapi_dict_result}")
print(f"Amount in dict type: {type(fastapi_dict_result['amount'])}")