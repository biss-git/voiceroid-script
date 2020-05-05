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
          text: 'ここが台本です。\n自由に編集できます。\n台本データは上部から読込、下部ボタンから保存ができます。'
        }
      },
      {
        type: 'paragraph',
        data: {
          id: 1,
          text: '「Tabキー」でキャラクタを割り当てられます。'
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
          text: '「ボイスロイド２用スクリプト」からボイスロイドに読み上げてもらうテキストを生成できます。'
        }
      },
      {
        type: 'paragraph',
        data: {
          id: 4,
          text: '「Altキー」で選択中のブロックのテキストをコピーできます。'
        }
      },
    ]
  };

  characters = [
    { id: 0, show: true, name: '', src: 'assets/images/null.png', isNull:true},
    { id: 1, show: true, name: '琴葉 葵', src: 'https://drive.google.com/uc?export=view&id=1-nc1FWnQv2rxWigCjpQOjobjkLeN2rwi', isNull:false},
    { id: 2, show: true, name: '琴葉 茜', src: 'https://drive.google.com/uc?export=view&id=1yTYoO-xS8rq37j91SjiE0avmF3Phwi58', isNull:false},
    { id: 3, show: true, name: '結月ゆかり', src: 'https://drive.google.com/uc?export=view&id=1rwRf-uWscQ1miba3YDq6wL5CI2Mr2oAq', isNull:false},
    { id: 4, show: true, name: '紲星あかり', src: 'https://drive.google.com/uc?export=view&id=1XzudWgamS905WSjVn3N4-rpfIRMnFEZ_', isNull:false},
    { id: 5, show: true, name: '民安ともえ(v1)', src: 'https://drive.google.com/uc?export=view&id=1Ph06uTW_41pcqFON9nCdebJLfGtBMqOc', isNull:false},
    { id: 6, show: true, name: 'ついなちゃん（標準語）', src: 'https://drive.google.com/uc?export=view&id=16OLU2rHFrCmYnSa3cQ0yFCjzs5xXtqD8', isNull:false},
    { id: 7, show: true, name: '京町セイカ(v1)', src: 'https://drive.google.com/uc?export=view&id=1HVjoeRGSEeFGWi-IbxNBISTcxfOgZ5UF', isNull:false},
    { id: 8, show: true, name: '東北きりたん', src: 'https://drive.google.com/uc?export=view&id=1ect7RTqdhSrfLOzIv1EIoYHejfNw-6zh', isNull:false},
  ];
}
