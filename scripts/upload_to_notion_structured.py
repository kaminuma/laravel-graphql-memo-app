#!/usr/bin/env python3
"""
Notion アップロードスクリプト（階層構造版）
JSONから階層構造のNotionページを作成
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv
from notion_client import Client

# 環境変数読み込み
load_dotenv()

# Notion API設定
notion = Client(auth=os.getenv('NOTION_TOKEN'))

# プロジェクトルート
PROJECT_ROOT = Path(__file__).parent.parent
SPECS_DIR = PROJECT_ROOT / 'specs'


def create_content_blocks(content_data):
    """contentデータからNotionブロックを生成"""
    blocks = []

    if isinstance(content_data, dict):
        # summary
        if 'summary' in content_data:
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {"rich_text": [{"text": {"content": "概要"}}]}
            })
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": [{"text": {"content": content_data['summary']}}]}
            })

        # arguments
        if 'arguments' in content_data and content_data['arguments']:
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {"rich_text": [{"text": {"content": "引数"}}]}
            })

            # テーブル風に表示（コードブロック）
            table_text = "| 引数名 | 型 | 必須 | 説明 |\n"
            table_text += "|--------|-----|------|------|\n"
            for arg in content_data['arguments']:
                required = "○" if arg.get('required', False) else "×"
                table_text += f"| {arg['name']} | {arg['type']} | {required} | {arg.get('description', '')} |\n"

            blocks.append({
                "object": "block",
                "type": "code",
                "code": {
                    "language": "markdown",
                    "rich_text": [{"text": {"content": table_text[:2000]}}]
                }
            })

        # returns
        if 'returns' in content_data:
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {"rich_text": [{"text": {"content": "戻り値"}}]}
            })
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": [{"text": {"content": content_data['returns']}}]}
            })

        # security
        if 'security' in content_data and content_data['security']:
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {"rich_text": [{"text": {"content": "セキュリティ"}}]}
            })
            for sec in content_data['security']:
                blocks.append({
                    "object": "block",
                    "type": "bulleted_list_item",
                    "bulleted_list_item": {"rich_text": [{"text": {"content": sec}}]}
                })

        # example
        if 'example' in content_data:
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {"rich_text": [{"text": {"content": "使用例"}}]}
            })
            blocks.append({
                "object": "block",
                "type": "code",
                "code": {
                    "language": "graphql",
                    "rich_text": [{"text": {"content": content_data['example'][:2000]}}]
                }
            })

        # fields (型定義用)
        if 'fields' in content_data and content_data['fields']:
            blocks.append({
                "object": "block",
                "type": "heading_3",
                "heading_3": {"rich_text": [{"text": {"content": "フィールド"}}]}
            })

            table_text = "| フィールド名 | 型 | 説明 |\n"
            table_text += "|------------|-----|------|\n"
            for field in content_data['fields']:
                table_text += f"| {field['name']} | {field['type']} | {field.get('description', '')} |\n"

            blocks.append({
                "object": "block",
                "type": "code",
                "code": {
                    "language": "markdown",
                    "rich_text": [{"text": {"content": table_text[:2000]}}]
                }
            })

        # description (型定義用)
        if 'description' in content_data:
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {"rich_text": [{"text": {"content": content_data['description']}}]}
            })

    return blocks


def create_notion_page(parent_id, page_data):
    """
    Notionページを作成（再帰的に子ページも作成）
    """
    title = page_data.get('title', 'Untitled')
    page_type = page_data.get('type', 'page')

    print(f"  📄 作成中: {title}")

    # ページ作成
    children_blocks = []

    # contentがあればブロックに変換
    if 'content' in page_data:
        children_blocks = create_content_blocks(page_data['content'])

    try:
        response = notion.pages.create(
            parent={"page_id": parent_id},
            properties={
                "title": [{"text": {"content": title}}]
            },
            children=children_blocks[:100]  # Notion制限: 最初の100ブロックのみ
        )

        page_id = response['id']
        page_url = response['url']

        # 残りのブロックを追加
        if len(children_blocks) > 100:
            print(f"    📝 残りのブロック({len(children_blocks) - 100}個)を追加中...")
            for i in range(100, len(children_blocks), 100):
                chunk = children_blocks[i:i + 100]
                notion.blocks.children.append(page_id, children=chunk)

        # 子ページを再帰的に作成
        if 'children' in page_data and page_data['children']:
            for child_data in page_data['children']:
                create_notion_page(page_id, child_data)

        return page_url

    except Exception as e:
        print(f"    ❌ エラー: {e}")
        return None


def main():
    print("=" * 60)
    print("📤 Notion 階層構造アップロードツール")
    print("=" * 60)

    # Notion APIトークンチェック
    if not os.getenv('NOTION_TOKEN'):
        print("❌ エラー: NOTION_TOKENが設定されていません")
        sys.exit(1)

    if not os.getenv('NOTION_PARENT_PAGE_ID'):
        print("❌ エラー: NOTION_PARENT_PAGE_IDが設定されていません")
        sys.exit(1)

    # JSONファイル読み込み
    json_file = SPECS_DIR / 'api_spec_structured.json'

    if not json_file.exists():
        print(f"❌ エラー: {json_file} が見つかりません")
        print("   先に generate_spec_structured.py を実行してください")
        sys.exit(1)

    with open(json_file, 'r', encoding='utf-8') as f:
        structured_data = json.load(f)

    print(f"\n📄 ファイル: {json_file}")
    print(f"📝 タイトル: {structured_data['title']}")

    # 親ページIDを取得
    parent_page_id = os.getenv('NOTION_PARENT_PAGE_ID')

    # ルートページを作成
    print("\n🔄 Notion階層構造を作成中...")

    root_url = create_notion_page(parent_page_id, structured_data)

    if root_url:
        print("\n" + "=" * 60)
        print("🎉 アップロード完了！")
        print("=" * 60)
        print(f"\n📚 仕様書ページ:")
        print(f"   {root_url}")
    else:
        print("\n❌ アップロードに失敗しました")
        sys.exit(1)


if __name__ == '__main__':
    main()
