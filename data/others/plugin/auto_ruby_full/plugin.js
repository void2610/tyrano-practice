// auto_ruby_full プラグイン
// ティラノスクリプト V6 向け 自動ルビ付与プラグイン
// フック対象: TYRANO.kag.ftag.master_tag.text.start / buildMessageHTML

(function () {
  // ルビ辞書
  // 一括ルビ: { 単語: "よみ" }
  // 個別ルビ: { 単語: ["よ", "み1", "よ", "み2"] }
  const rubyDict = {};

  // 辞書登録タグ
  // 一括ルビ: [arb_auto ruby="単語" text="よみ"]
  // 個別ルビ: [arb_auto ruby="自動人形" split="オ|ート|マ|タ"]
  //   split は "|" 区切りで各文字に対応するルビを指定する
  //   文字数と split の区切り数が一致しなければならない
  // master_tag は init() 時にコピー済みなので直接登録する
  TYRANO.kag.ftag.master_tag.arb_auto = {
    vital: ["ruby"],
    pm: {},
    kag: TYRANO.kag,
    start: function (pm) {
      if (pm.split) {
        // 個別ルビモード: "|" 区切りの配列として登録
        rubyDict[pm.ruby] = pm.split.split("|");
      } else {
        // 一括ルビモード: 文字列として登録
        rubyDict[pm.ruby] = pm.text;
      }
      TYRANO.kag.ftag.nextOrder();
    },
  };

  // text.start をフックして pm.val にルビ変換を適用
  const _textStart = TYRANO.kag.ftag.master_tag.text.start;
  TYRANO.kag.ftag.master_tag.text.start = function (pm) {
    pm.val = applyRuby(pm.val);
    _textStart.call(this, pm);
  };

  // buildMessageHTML をフックして <ruby> タグを適切に処理する
  // buildMessageHTML は1文字ずつ処理するため <ruby> をそのまま渡すと
  // タグ文字列が1文字ずつ分解されてしまう。
  // そこで <ruby>...</ruby> をUnicode私用領域の1文字（プレースホルダー）に
  // 置き換えてから元の処理に渡し、結果のHTMLでプレースホルダーをルビHTMLに戻す。
  const _buildMessageHTML = TYRANO.kag.ftag.master_tag.text.buildMessageHTML;
  TYRANO.kag.ftag.master_tag.text.buildMessageHTML = function (message_str, should_use_inline_block) {
    if (!message_str.includes("<ruby>")) {
      // ルビがなければ元の処理に委譲
      return _buildMessageHTML.call(this, message_str, should_use_inline_block);
    }

    // <ruby>...</ruby> をプレースホルダー文字に置き換える
    const placeholders = [];
    const modified = message_str.replace(/<ruby>[\s\S]*?<\/ruby>/g, (match) => {
      // Unicode 私用領域（U+E000〜）を使う（シナリオには現れない文字）
      const placeholder = String.fromCodePoint(0xE000 + placeholders.length);
      placeholders.push({ placeholder, html: match });
      return placeholder;
    });

    // 元の buildMessageHTML で処理（プレースホルダーは1文字として扱われ span でラップされる）
    let result = _buildMessageHTML.call(this, modified, should_use_inline_block);

    // span 内のプレースホルダーをルビHTMLに戻す
    for (const { placeholder, html } of placeholders) {
      result = result.split(placeholder).join(html);
    }

    return result;
  };

  // 登録済み単語を長い順に適用してルビHTMLに変換する
  function applyRuby(text) {
    // 長い単語を優先してマッチさせるためにソート
    const words = Object.keys(rubyDict).sort((a, b) => b.length - a.length);
    for (const word of words) {
      const reading = rubyDict[word];
      const escaped = escapeRegex(word);
      // すでに <ruby>〜</ruby> で囲まれている箇所は二重置換しない
      const regex = new RegExp(
        `(?<!<ruby[^>]*>[^<]*)${escaped}(?![^<]*<\\/ruby>)`,
        "g"
      );
      if (Array.isArray(reading)) {
        // 個別ルビ: 各文字に対して <ruby>文字<rt>ルビ</rt></ruby> を生成
        const chars = [...word]; // サロゲートペア対応のため spread で分割
        if (chars.length !== reading.length) {
          // 文字数と split 数が一致しない場合はスキップ
          continue;
        }
        const replacement = chars
          .map((ch, i) => `<ruby>${ch}<rt>${reading[i]}</rt></ruby>`)
          .join("");
        text = text.replace(regex, replacement);
      } else {
        // 一括ルビ: 単語全体に一つのルビを付ける
        text = text.replace(
          regex,
          `<ruby>${word}<rt>${reading}</rt></ruby>`
        );
      }
    }
    return text;
  }

  // 正規表現の特殊文字をエスケープする
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
})();
