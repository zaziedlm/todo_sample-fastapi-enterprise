# Decimal → String 変換調査資料

このディレクトリには、Expense系APIのamount項目におけるDecimal → String変換の調査で使用したテストファイルが保管されています。

## ファイル一覧

### test_decimal.py
- Decimal型のJSON serialization動作テスト
- FastAPIのjsonable_encoderの動作確認
- Decimal → floatへの変換確認

### debug_decimal_conversion.py
- Pydantic V2でのDecimal変換メカニズム調査
- `model_dump()`と`model_dump(mode='json')`の動作比較
- Decimal → String変換のタイミング特定

### fastapi_response_test.py
- FastAPI内部でのPydanticserialization呼び出し追跡
- monkeypatchを使った詳細な呼び出しフロー調査
- 実際のレスポンス生成プロセス確認

## 調査結果サマリー

**変換の実行パス:**
```
FastAPI endpoint return
↓
routing.py:327 serialize_response()
↓
routing.py:201 jsonable_encoder(response_content)
↓
encoders.py:223 _model_dump()
↓
_compat.py:181 model.model_dump(mode='json')
↓
Pydantic BaseModel.model_dump(mode='json')
```

**核心実装箇所:** `fastapi/_compat.py:181` の `_model_dump()` 関数

**設計意図:** JSON標準準拠とDecimal精度保持の両立