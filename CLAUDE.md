# ティラノスクリプト V6 プロジェクト

## 概要
ティラノスクリプト（TyranoScript）V6 を使用したノベルゲーム開発プロジェクト。
テキストベースでの開発を前提とし、Claude Code で `.ks` ファイルを直接編集する。

## ディレクトリ構造
```
tyrano-practice/
├── index.html          # エントリーポイント（ブラウザで開いてゲーム起動）
├── data/               # ゲームコンテンツ（主な編集対象）
│   ├── scenario/       # シナリオファイル (.ks)
│   ├── fgimage/        # 前景画像（キャラクター立ち絵等）
│   ├── bgimage/        # 背景画像
│   ├── image/          # UI画像（ボタン、タイトル等）
│   ├── bgm/            # BGM音声ファイル
│   ├── system/         # システム設定 (Config.tjs, KeyConfig.js 等)
│   └── others/         # その他素材
├── tyrano/             # エンジン本体（原則編集しない）
│   ├── plugins/kag/    # タグパーサー・コアロジック
│   ├── css/            # エンジンCSS
│   ├── libs/           # サードパーティライブラリ
│   └── images/         # エンジンUI画像
├── LICENCE.txt
├── package.json
└── readme.txt
```

## 開発ルール

### シナリオファイル (.ks) の編集
- シナリオファイルは `data/scenario/` に配置する
- ファイルの文字コードは UTF-8 を使用する
- 新しいシーンを追加する場合は `data/scenario/` に新規 `.ks` ファイルを作成する
- `first.ks` はゲーム開始時に最初に呼ばれるファイル。初期化処理を記述する
- `title.ks` はタイトル画面
- `scene1.ks` 以降にゲーム本編のシナリオを記述する

### .ks ファイルの基本構文
```
; セミコロンで始まる行はコメント

; タグ記法（2種類）
[tag_name param1="value1" param2="value2"]
@tag_name param1="value1" param2="value2"

; テキスト表示
こんにちは。これはテキストです。[l][r]
; [l] = クリック待ち、[r] = 改行、[p] = 改ページ待ち

; ラベル定義
*label_name

; ジャンプ
@jump storage="scene2.ks" target="*label_name"

; 背景変更
@bg storage="room.jpg" time="1000"

; キャラクター表示
@chara_show name="akane" time="600"

; 選択肢
[glink text="選択肢1" target="*choice1" size=20]
[glink text="選択肢2" target="*choice2" size=20]
[s]
```

### 設定ファイル
- `data/system/Config.tjs` : ゲーム全体の設定（画面サイズ、文字設定等）
- `data/system/KeyConfig.js` : キーボード・ゲームパッド設定

### tyrano/ ディレクトリについて
- エンジン本体のため、原則として編集しない
- カスタマイズが必要な場合はプラグインとして `data/` 以下に配置する

## 自動ルビ機能（auto_ruby_full プラグイン）

`data/others/plugin/auto_ruby_full/` に実装済み。辞書に登録した単語に自動でルビを付与する。

### 辞書への登録（`data/scenario/ruby_dict.ks`）

```
; 一括ルビ: 単語全体に読みを付ける
[arb_auto ruby="魔法" text="まほう"]

; 個別ルビ: 各文字に対応するルビを "|" 区切りで指定（文字数と一致必須）
[arb_auto ruby="自動人形" split="オ|ート|マ|タ"]
```

- 単語を追加したら `ruby_dict.ks` に登録するだけでよい
- 長い単語が優先してマッチする（「召喚陣」と「召喚」が両方あれば「召喚陣」が先にマッチ）
- ルビが二重に付くことはない

## コメント規約
- プログラム内の全てのコメントは日本語で記述する
- `.ks` ファイルのコメントは `;`（セミコロン）で開始する

## 動作確認
- ローカルHTTPサーバーを使用してゲームを実行する
  - `npx serve .` → `http://localhost:3000`
