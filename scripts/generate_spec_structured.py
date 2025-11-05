#!/usr/bin/env python3
"""
仕様書生成スクリプト（構造化版）
GraphQLを解析して階層構造のJSONで出力
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# 環境変数読み込み
load_dotenv()

# Gemini API設定
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent
SPECS_DIR = PROJECT_ROOT / 'specs'
SPECS_DIR.mkdir(exist_ok=True)


def read_graphql_files():
    """GraphQLスキーマファイルを全て読み込む"""
    graphql_dir = PROJECT_ROOT / 'server' / 'graphql'
    files_content = {}

    for graphql_file in graphql_dir.rglob('*.graphql'):
        relative_path = graphql_file.relative_to(graphql_dir)
        with open(graphql_file, 'r', encoding='utf-8') as f:
            files_content[str(relative_path)] = f.read()

    return files_content


def generate_structured_spec(files_content):
    """Gemini APIで構造化された仕様書を生成"""

    # ファイル内容を結合
    combined_content = "\n\n".join([
        f"## ファイル: {path}\n```graphql\n{content}\n```"
        for path, content in files_content.items()
    ])

    prompt = f"""
以下のGraphQLスキーマファイルを解析し、**階層構造のJSON形式**で仕様書を生成してください。

# GraphQLスキーマ
{combined_content}

# 出力形式（JSON）
以下の構造で、**純粋なJSONのみ**を出力してください（説明文や```json``` は不要）：

{{
  "title": "API仕様書",
  "children": [
    {{
      "title": "📊 Query仕様",
      "type": "page",
      "children": [
        {{
          "title": "todos",
          "type": "page",
          "content": {{
            "summary": "Todo一覧を取得するクエリです。",
            "arguments": [
              {{"name": "completed", "type": "Boolean", "required": false, "description": "完了状態でフィルタリング"}},
              {{"name": "priority", "type": "Priority", "required": false, "description": "優先度でフィルタリング（HIGH/MEDIUM/LOW）"}}
            ],
            "returns": "[Todo!]!",
            "security": ["@guard: 認証必須", "@whereAuth: ユーザーのTodoのみ取得"],
            "example": "query GetTodos {{\\n  todos(completed: false) {{\\n    id\\n    title\\n  }}\\n}}"
          }}
        }}
      ]
    }},
    {{
      "title": "✏️ Mutation仕様",
      "type": "page",
      "children": [
        {{
          "title": "createTodo",
          "type": "page",
          "content": {{
            "summary": "新しいTodoを作成します。",
            "arguments": [...],
            "returns": "Todo!",
            "example": "..."
          }}
        }}
      ]
    }},
    {{
      "title": "🧱 型定義",
      "type": "page",
      "children": [
        {{
          "title": "Todo",
          "type": "page",
          "content": {{
            "description": "Todoアイテムを表す型",
            "fields": [
              {{"name": "id", "type": "ID!", "description": "TodoのID"}},
              {{"name": "title", "type": "String!", "description": "タイトル"}}
            ]
          }}
        }}
      ]
    }}
  ]
}}

# 重要なルール
1. 全てのQueryを「📊 Query仕様」配下に配置
2. 全てのMutationを「✏️ Mutation仕様」配下に配置
3. 全ての型定義を「🧱 型定義」配下に配置
4. 各API/型は個別のページとして定義
5. contentには実装詳細を含める
6. 日本語で記述
7. **JSONのみを出力**（前後に説明文を付けない）
"""

    print("🤖 Gemini APIで構造化仕様書を生成中...")
    response = model.generate_content(prompt)

    # レスポンスからJSONを抽出
    text = response.text.strip()

    # ```json ``` で囲まれている場合は除去
    if text.startswith('```'):
        lines = text.split('\n')
        text = '\n'.join(lines[1:-1])

    try:
        structured_data = json.loads(text)
        return structured_data
    except json.JSONDecodeError as e:
        print(f"❌ JSON解析エラー: {e}")
        print(f"レスポンス: {text[:500]}...")
        sys.exit(1)


def main():
    print("=" * 60)
    print("📝 構造化仕様書自動生成ツール")
    print("=" * 60)

    # Gemini APIキーチェック
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ エラー: GEMINI_API_KEYが設定されていません")
        sys.exit(1)

    try:
        # GraphQLファイル読み込み
        print("\n🔍 GraphQLファイルを解析中...")
        graphql_files = read_graphql_files()
        print(f"   {len(graphql_files)}個のファイルを検出")

        # 構造化仕様書生成
        structured_data = generate_structured_spec(graphql_files)

        # JSON保存
        output_path = SPECS_DIR / 'api_spec_structured.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(structured_data, f, ensure_ascii=False, indent=2)

        print(f"✅ 構造化仕様書を生成しました: {output_path}")

        # サマリー表示
        print("\n📊 生成された構造:")
        print(f"  - タイトル: {structured_data['title']}")
        for section in structured_data['children']:
            print(f"    └── {section['title']}")
            if 'children' in section:
                for item in section['children']:
                    print(f"        └── {item['title']}")

        print("\n" + "=" * 60)
        print("🎉 構造化仕様書生成完了！")
        print("=" * 60)
        print("\n次のステップ:")
        print("  python scripts/upload_to_notion_structured.py")

    except Exception as e:
        print(f"\n❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
