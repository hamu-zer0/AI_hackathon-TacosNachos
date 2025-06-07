from __future__ import annotations

import ast
import json
import re
from pathlib import Path
from typing import Dict, Optional

import torch
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from transformers import AutoModelForCausalLM, AutoTokenizer
import uvicorn

###############################
#  Model & Tokenizer ロード   #
###############################

def find_snapshot_dir(base: Path) -> Path:
    """refs/main に書かれたコミット SHA から実体スナップショットを返す"""
    ref_file = base / "refs" / "main"
    sha = ref_file.read_text().strip()
    snap_dir = base / "snapshots" / sha
    if not snap_dir.exists():
        raise FileNotFoundError(f"snapshot {sha} が見つかりません › {snap_dir}")
    return snap_dir

# キャッシュパス
BASE_DIR = Path(__file__).parent / "cache" / "models--Qwen--Qwen2.5-1.5B-Instruct"
MODEL_DIR = find_snapshot_dir(BASE_DIR)

print("[api_server] Loading model …")
TOKENIZER = AutoTokenizer.from_pretrained(MODEL_DIR)
MODEL = AutoModelForCausalLM.from_pretrained(
    MODEL_DIR,
    torch_dtype=torch.bfloat16,
    device_map="auto",
).eval()
print("[api_server] Model ready ✔")

###############################
#        FastAPI part         #
###############################

app = FastAPI(title="Conspiracy Persuasion Evaluator")
# CORSを回避するために追加（今回の肝）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,   # 追記により追加
    allow_methods=["*"],      # 追記により追加
    allow_headers=["*"]       # 追記により追加
)

# システムプロンプトを少し改善
SYSTEM_PROMPT = """
あなたは、陰謀論に染まろうとしている人物を正気に戻す評価専門家です。
以下のルールに厳密に従い、必ず一行の JSON のみを出力してください。
JSON以外の出力は禁止されています。

【追加ルール】
• メッセージが 10 文字未満、もしくは感嘆や命令形（例: 「騙されないで！」「それな」など）で終わる場合、
  共感力と説得力は最低評価(1)とする。

【基本評価基準】
1) 説得力(persuasive): 3〜5。
  ・相手の視点に寄り添い、自ら考えさせる問いかけや情報提供ができているか。
  ・根拠が少しでもあれば3点や4点をお願いします。
  ・疑問文(？)や思考を促す形式が高評価。論破や命令・断定は低評価(1)。
  ・甘めに評価してください

2) 共感力(empathy): 3〜5。
  ・相手の感情を汲み取り、尊重する言葉があるか。
  ・少しでも寄り添っていれば高めの点数をお願いします。
  ・「！」や感嘆、命令形は避け、穏やかな共感表現が高評価。否定や嘲笑は最低評価(1)。
  ・甘めに評価してください

【最重要】
• 入力に対して、出力される点数にはばらつきが必要です。
• 点数の平均は3にしてください。
• 1点は本当に短文だったりただの断定の時にしてください。
• 出力は必ず一行の JSON のみ：{"persuasive":<0-5>,"empathy":<0-5>}
• 説明文・改行・その他の文字は一切含めない
• 解析不能時は {"persuasive":0,"empathy":0}
【出力可能なJSON一覧】
{"persuasive": 3, "empathy": 2}
{"persuasive": 3, "empathy": 3}
{"persuasive": 3, "empathy": 4}
{"persuasive": 3, "empathy": 5}
{"persuasive": 4, "empathy": 3}
{"persuasive": 4, "empathy": 4}
{"persuasive": 4, "empathy": 5}
{"persuasive": 5, "empathy": 3}
{"persuasive": 5, "empathy": 4}
{"persuasive": 5, "empathy": 5}

---
以下の「テーマ」と「メッセージ」を読み評価してください。
"""


# 汎用的に "{ ... }" をすべて抜き出して JSON を試行パース
BRACE_PATTERN = re.compile(r"\{[^{}]*\}", re.S)


def build_chat_prompt(theme: str, user_input: str) -> str:
    """Qwen chat template を使い、system+user メッセージを作成"""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"テーマ: {theme}\nメッセージ: {user_input}"},
    ]
    return TOKENIZER.apply_chat_template(messages, add_special_tokens=True, tokenize=False)


def extract_json_block(text: str) -> Optional[Dict[str, int]]:
    """文字列中の波括弧ブロックを順に試し、persuasive/empathy を含む dict を返す"""
    for m in BRACE_PATTERN.finditer(text):
        block = m.group()
        try:
            obj = json.loads(block)
            if {
                "persuasive",
                "empathy",
            } <= obj.keys():  # 両キーが存在
                return obj
        except Exception:
            continue
    return None


@app.post("/")
async def evaluate_text(request: Request) -> Dict[str, int]:
    try:
        raw = (await request.body()).decode("utf-8").strip()
        if not raw:
            raise ValueError("Empty request body")

        # JSON またはシングルクォート dict を許容
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            data = ast.literal_eval(raw)

        if not isinstance(data, dict):
            raise ValueError("Payload must be a dict with 'theme' and 'input'.")

        theme = str(data.get("theme", "")).strip()
        user_input = str(data.get("input", "")).strip()
        if not theme or not user_input:
            raise ValueError("Missing 'theme' or 'input' field.")

        prompt_text = build_chat_prompt(theme, user_input)
        inputs = TOKENIZER(prompt_text, return_tensors="pt").to(MODEL.device)

        with torch.no_grad():
            outputs = MODEL.generate(
                **inputs,
                max_new_tokens=32,
                do_sample=False,
            )
        
        # 入力プロンプトのトークン数を取得
        prompt_len = inputs["input_ids"].shape[-1]
        # プロンプト部分を除き、モデルが生成した部分のみをスライス
        response_tokens = outputs[0][prompt_len:]
        # 生成部分のみをデコード
        response_text = TOKENIZER.decode(response_tokens, skip_special_tokens=True).strip()
        
        print("[LLM raw]", response_text)

        parsed = extract_json_block(response_text)
        if parsed is not None:
            persuasive = int(parsed.get("persuasive", 0))
            empathy = int(parsed.get("empathy", 0))
            if 0 <= persuasive <= 5 and 0 <= empathy <= 5:
                print("[LLM ok]", parsed)
                return {"persuasive": persuasive, "empathy": empathy}
    except Exception as e:
        print(f"[api_server] Error: {e}")

    # フォールバック
    return {"persuasive": 0, "empathy": 0}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
