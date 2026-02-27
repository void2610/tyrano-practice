;廊下を表示するだけのテストシーン
[cm]
[clearfix]

@bg storage="rouka.jpg"

[chara_show  name="akane"]

*rouka_start

#あかね
廊下に来たよ！[p]
じゃあ教室に戻ろうか[p]

[glink target="*classroom" text="教室に戻る"]
[glink target="*rouka_start" text="まだ廊下にいる"]

[s]

*classroom
@bg storage="room.jpg" time=1000 method="slide"
#あかね
教室に戻ってきたね！[p]

[chara_hide name="akane"]
@layopt layer=message0 visible=false
@jump storage="title.ks"

[s]
