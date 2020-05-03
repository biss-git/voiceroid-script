# voiceroid-script

ボイスロイド用の台本データや調声データの編集、保存、および共有を目的として作ったWebアプリです。

[このリンクから使用できます。](https://biss-git.github.io/voiceroid-script/)

## 出来ること

#### 台本編集



#### フレーズ辞書表示

## 使い方


## 利用素材

githubのリポジトリには含めていませんが、[blueberry様](https://seiga.nicovideo.jp/user/illust/1584023)のキャラクター素材を利用しています。


## 主に使用しているライブラリ
#### [ngx-admin](https://github.com/akveo/ngx-admin)
Angularプロジェクトのベースとして使っています。  
なんかいい感じの見た目にしてくれて、４種類のテーマもいい感じです。  
プロジェクトの構成を見ていても勉強になります。


#### [Editor.js](https://github.com/codex-team/editor.js)
台本編集に使用しているテキストエディタ―です。  
ブロックという単位で小さなエディターがスタックされる作りで、感覚的に操作できるエディターです。  
プラグインも比較的簡単に作れるので、キャラクター画像をテキストの左側に付けることができました。  
ただ、2020年5月現在ではまだ発展途上のためか動作の粗いところもあり、利用にあたってはちょっと手を加えています。詳細は custmized-library/editorjs にメモしておきました。


#### [Plotly.js](https://github.com/plotly/plotly.js/)
非常に高機能なグラフライブラリです。  
y軸をまとめたり、グラフ上に注釈をつけたり、画像として保存出来たりします。  
最初のグラフ生成時の処理が重くて固まるのが玉に瑕ですが、とても頼りになります。  
ただ、Plotly.updateやrelayoutなどの動作が難しく、軸範囲の初期値が古いままだったり、widthやheightを変更するとresizeが効かなくなったりします。


#### 作ったひと
[ビス](https://biss-git.github.io/Portfolio/)

