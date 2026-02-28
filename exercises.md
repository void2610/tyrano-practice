# ティラノスクリプト練習問題

このプロジェクトのコードベースを実際に編集して、ティラノスクリプトの基本を身につけましょう。
動作確認は `npx serve .` でローカルサーバーを起動し、ブラウザで確認してください。

---

## 練習1: テキスト表示の基本

**対象ファイル**: `data/scenario/scene1.ks`

48行目付近のナレーションを以下のように変更してください。

```
……[p]
帰るか。。。[p]
```

↓ 変更後

```
……[p]
帰るか。。。[l][r]
いや、もう少しだけ待ってみよう。[p]
```

**確認ポイント**: `[p]` と `[l][r]` の違いを実際にプレイして確認しましょう。
- `[l]` の後にテキストが消えず、改行されて続きが表示されるか？
- `[p]` ではクリック後にテキストが全て消えるか？

---

## 練習2: キャラクターの表情切り替え

**対象ファイル**: `data/scenario/scene1.ks`

56〜57行目のナレーション部分に、表情変更を追加してください。

```
#
誰だ！？[p]
```

↓ 変更後（あかね登場後の62〜63行目も含めて修正）

```
#
誰だ！？[p]

[chara_show name="akane"]
[chara_mod name="akane" face="angry"]
#あかね
ちょっと！無視しないでよ！[p]
[chara_mod name="akane" face="default"]
あ、ごめんね。改めまして、こんにちは。[p]
私の名前はあかね。[p]
```

**確認ポイント**: 表情が angry → default(normal) に切り替わることを確認しましょう。

---

## 練習3: 新しいシナリオファイルを作る

**作成ファイル**: `data/scenario/scene2.ks`

以下の要件で新しいシーンを作成してください。

1. 背景を `rouka.jpg`（廊下）にする
2. メッセージウィンドウを表示する
3. あかねを表示する
4. あかねが「廊下に来たよ！」と言う
5. クリック待ちの後、タイトル画面に戻る

**ヒント**: scene1.ks の冒頭（3〜29行目）の初期化処理を参考にしてください。ただし、キャラクター定義（`chara_new`, `chara_face`）は scene1.ks で既に行われているので、同じゲーム内で既に定義済みならそのまま使えます。新規ファイルから独立して起動する場合は再定義が必要です。

<details>
<summary>解答例（クリックで開く）</summary>

```
; scene2.ks - 廊下シーン

*start

[cm]
[clearfix]

[bg storage="rouka.jpg" time="500"]

[position layer="message0" left=160 top=500 width=1000 height=200 page=fore visible=true]
[position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]
@layopt layer=message0 visible=true

[ptext name="chara_name_area" layer="message0" color="white" size=28 bold=true x=180 y=510]
[chara_config ptext="chara_name_area"]

[chara_new name="akane" storage="chara/akane/normal.png" jname="あかね"]

[chara_show name="akane"]
#akane
廊下に来たよ！[p]
ここは寒いから教室に戻ろうか。[p]

[chara_hide name="akane"]
@jump storage="title.ks"
[s]
```

</details>

---

## 練習4: 選択肢で分岐させる

**対象ファイル**: 練習3で作った `data/scenario/scene2.ks`

あかねの「教室に戻ろうか」の後に、結果が異なる選択肢を追加してください。

- 「戻ろう」 → 背景を `room.jpg` に変えて「教室に戻ってきたね」と表示
- 「もう少しいよう」 → そのまま廊下で「じゃあもうちょっとだけね」と表示

どちらのルートも最終的にタイトル画面に戻るようにしてください。

**ヒント**:
- `[glink]` でボタン型選択肢を配置
- `[s]` で選択待ち
- 各分岐先にラベル（`*label`）を定義
- 合流地点のラベルも作ると良い

<details>
<summary>解答例（クリックで開く）</summary>

scene2.ks の「教室に戻ろうか。[p]」の後に以下を追加:

```
[glink color="blue" size="28" x="360" width="500" y="150" text="戻ろう" target="*go_back"]
[glink color="blue" size="28" x="360" width="500" y="250" text="もう少しいよう" target="*stay"]
[s]

*go_back
[chara_mod name="akane" face="happy"]
[bg storage="room.jpg" time="1000" method="crossfade"]
#akane
教室に戻ってきたね！やっぱりあったかい。[p]
@jump target="*ending"

*stay
#akane
じゃあもうちょっとだけね。[p]
寒いけど、たまにはいいかも。[p]
@jump target="*ending"

*ending
[chara_hide name="akane"]
@layopt layer=message0 visible=false
@jump storage="title.ks"
[s]
```

</details>

---

## 練習5: タイトル画面にボタンを追加する

**対象ファイル**: `data/scenario/title.ks`

練習3〜4で作った scene2.ks へのボタンをタイトル画面に追加してください。

**要件**:
- 既存ボタンの下（y=680 付近）に配置
- ボタン画像がないので `[glink]` を使う
- テキストは「練習シーン」

**ヒント**: `[button]` は画像が必要ですが、`[glink]` はテキストだけでボタンを作れます。ただし `[button]` と `[glink]` は `[s]` の前に配置する必要があります。

<details>
<summary>解答例（クリックで開く）</summary>

title.ks の `[s]` の前（15行目の直前）に以下を追加:

```
[glink color="blue" size="20" x="135" width="300" y="680" text="練習シーン" storage="scene2.ks"]
```

</details>

---

## 練習6: BGMとSEを使う

**対象ファイル**: `data/scenario/scene2.ks`

scene2.ks にBGMとSEの演出を追加してください。

**要件**:
1. シーン開始時にBGMを再生する（`data/bgm/` にある音声ファイルを使用）
2. 選択肢を選んだときにBGMをフェードアウトで停止する
3. エンディング前にBGMを止める

**使用タグ**:
```
; BGM再生
@playbgm storage="ファイル名" loop=true

; BGMフェードアウト停止
@stopbgm time="2000"

; SE再生（効果音）
@playse storage="ファイル名"
```

**注意**: `data/bgm/` にある実際のファイル名を確認してから記述してください。ファイルがない場合はこの練習はスキップしてください。

---

## 練習7: マクロを定義して使う

**対象ファイル**: `data/scenario/scene2.ks`

scene2.ks の冒頭で、メッセージウィンドウの初期化処理が長くなっています。これを**マクロ**にまとめてください。

**要件**: 以下の初期化処理をマクロ `init_messagewindow` として定義し、呼び出しに置き換える

<details>
<summary>解答例（クリックで開く）</summary>

scene2.ks の先頭付近にマクロ定義を追加:

```
[macro name="init_messagewindow"]
  [position layer="message0" left=160 top=500 width=1000 height=200 page=fore visible=true]
  [position layer=message0 page=fore margint="45" marginl="50" marginr="70" marginb="60"]
  @layopt layer=message0 visible=true
  [ptext name="chara_name_area" layer="message0" color="white" size=28 bold=true x=180 y=510]
  [chara_config ptext="chara_name_area"]
[endmacro]
```

以降は `[init_messagewindow]` と1行書くだけで同じ処理が実行されます:

```
*start
[cm]
[clearfix]
[bg storage="rouka.jpg" time="500"]
[init_messagewindow]
...
```

</details>

---

## 練習8: 変数とフラグを使った分岐

**対象ファイル**: `data/scenario/scene2.ks`

練習4の選択肢に「フラグ管理」を追加してください。

**要件**:
- 「戻ろう」を選んだら `f.went_back = true` を設定
- 「もう少しいよう」を選んだら `f.went_back = false` を設定
- エンディングで、フラグに応じてあかねのセリフを変える

**使用タグ**:
```
; 変数に値を代入
[eval exp="f.went_back = true"]

; 条件分岐
[if exp="f.went_back == true"]
  素直でよろしい！[p]
[else]
  風邪ひいちゃうよ？[p]
[endif]
```

**ポイント**: `tf.` ではなく `f.` を使うことで、この値はセーブデータに保存されます。ロード時にも分岐結果が維持されます。

<details>
<summary>解答例（クリックで開く）</summary>

```
*go_back
[eval exp="f.went_back = true"]
[chara_mod name="akane" face="happy"]
[bg storage="room.jpg" time="1000" method="crossfade"]
#akane
教室に戻ってきたね！やっぱりあったかい。[p]
@jump target="*ending"

*stay
[eval exp="f.went_back = false"]
#akane
じゃあもうちょっとだけね。[p]
寒いけど、たまにはいいかも。[p]
@jump target="*ending"

*ending
[chara_show name="akane"]
#akane
[if exp="f.went_back == true"]
素直に戻ってくれて嬉しいな！[p]
[else]
もう寒いから次は絶対戻ろうね！[p]
[endif]

[chara_hide name="akane"]
@layopt layer=message0 visible=false
@jump storage="title.ks"
[s]
```

</details>

---

## 練習9: Config.tjs を編集する

**対象ファイル**: `data/system/Config.tjs`

以下の設定変更を行って、動作の違いを確認してください。

1. **文字表示速度を遅くする**: `chSpeed` を `30` → `80` に変更
2. **画面サイズを変更する**: `scWidth` と `scHeight` を `960` x `540` に変更
3. **フォントサイズを大きくする**: `defaultFontSize` を `28` → `36` に変更

各変更後にブラウザをリロードして違いを確認し、確認が終わったら元に戻してください。

---

## 練習10: 総合問題 — オリジナルシーンを作る

**作成ファイル**: `data/scenario/myscene.ks`

以下の要素を全て含むオリジナルシーンを1つ作成してください。

- [ ] 背景を最低2回切り替える（異なる `method` を使う）
- [ ] あかねとやまとの2人を登場させる
- [ ] 表情を最低2回切り替える
- [ ] `[font]` でテキストの色またはサイズを変更する箇所がある
- [ ] 結果が異なる選択肢がある（全ルート同じ先ではない）
- [ ] `f.` 変数を1つ以上使う
- [ ] 最後にタイトル画面に戻る
- [ ] title.ks にこのシーンへのボタンを追加する

自由にストーリーを考えて実装してみてください。
