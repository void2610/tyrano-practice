; 自動変換ファイル - 元原稿: docs/scenario_draft.txt
; 変換日時: 2026-03-02

*scene_start

; 朝の教室シーン

@bg storage="classroom_morning.jpg" time="1000"
@playbgm storage="morning.ogg" volume=70 loop=true

#
朝の光が差し込む教室。[r]まだ生徒の姿はまばらだった。[p]

[chara_show name="akane" time="600"]

#akane
おはようございます！[p]

#akane
今日の授業、楽しみですね。[p]

#yamato
ああ……まあな。[p]

[chara_mod name="akane" face="happy"]

#akane
元気ないですよ、やまとくん！[r]もっとポジティブに行きましょう！[p]

@fadeoutbgm time=2000

*scene_end
