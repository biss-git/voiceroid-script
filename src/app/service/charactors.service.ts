import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CharactorsService {

  constructor() { }

  tempData: any = {
    blocks: [
      {
        type: 'paragraph',
        data: {
          id: 0,
          text: 'ここが台本です。\r\n自由に編集できます。\r\n編集データは上部ボタンから読込、下部ボタンから保存ができます。'
        }
      },
      {
        type: 'paragraph',
        data: {
          id: 1,
          text: '「Tabキー」でキャラクタを割り当てることができます。'
        }
      },
      {
        type: 'paragraph',
        data: {
          id: 2,
          text: '「キャラクター情報編集」でキャラの名称を変更できます。'
        }
      },
      {
        type: 'paragraph',
        data: {
          id: 3,
          text: '「VOICEROID2用スクリプト」からボイスロイド２エディター用のテキストを生成することができます。'
        }
      },
    ]
  };

  characters = [
    { id: 0, show: true, name: '', src: 'assets/images/null.png', isNull:true},
    { id: 1, show: true, name: '琴葉 葵', src: 'http://drive.google.com/uc?export=view&id=1-nc1FWnQv2rxWigCjpQOjobjkLeN2rwi', isNull:false},
    { id: 2, show: true, name: '琴葉 茜', src: 'http://drive.google.com/uc?export=view&id=1yTYoO-xS8rq37j91SjiE0avmF3Phwi58', isNull:false},
    { id: 3, show: true, name: '結月ゆかり', src: 'http://drive.google.com/uc?export=view&id=1rwRf-uWscQ1miba3YDq6wL5CI2Mr2oAq', isNull:false},
    { id: 4, show: true, name: '紲星あかり', src: 'http://drive.google.com/uc?export=view&id=1XzudWgamS905WSjVn3N4-rpfIRMnFEZ_', isNull:false},
    { id: 5, show: true, name: '民安ともえ(v1)', src: 'http://drive.google.com/uc?export=view&id=1Ph06uTW_41pcqFON9nCdebJLfGtBMqOc', isNull:false},
    { id: 6, show: true, name: 'ついなちゃん（標準語）', src: 'http://drive.google.com/uc?export=view&id=16OLU2rHFrCmYnSa3cQ0yFCjzs5xXtqD8', isNull:false},
    { id: 7, show: true, name: '京町セイカ(v1)', src: 'http://drive.google.com/uc?export=view&id=1HVjoeRGSEeFGWi-IbxNBISTcxfOgZ5UF', isNull:false},
    { id: 8, show: true, name: '東北きりたん', src: 'http://drive.google.com/uc?export=view&id=1ect7RTqdhSrfLOzIv1EIoYHejfNw-6zh', isNull:false},
  ];
}
