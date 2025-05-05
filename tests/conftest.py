import sys
import os
from pathlib import Path

# プロジェクトのルートパスを取得
root_path = Path(__file__).parent.parent

# インポートパスにプロジェクトルートを追加
sys.path.insert(0, str(root_path))