import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { count } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PhraseService {

  public filename = 'ファイルはまだ読み込まれていません';

  public num = 0;
  public id = 'phrase1';
  public title = 'これはサンプルです、フレーズ辞書を読み込んでください。';
  public value = '$2_2(Vol ABSLEVEL=1.20)(Spd ABSSPEED=1.00)(EMPH ABSLEVEL=1.58)コ^レワD|0(Vol ABSLEVEL=0.87)(Spd ABSSPEED=1.17)(EMPH ABSLEVEL=1.00)^サ!ンプルVデDス$2_2(Vol ABSLEVEL=1.00)(Spd ABSSPEED=1.03)フ^レDーズVジ!ショVオ$2_2(Vol ABSLEVEL=0.78)(Spd ABSSPEED=0.89)(Pit ABSLEVEL=0.96)(EMPH ABSLEVEL=0.40)^ヨ$1_1(Vol ABSLEVEL=0.96)(Spd ABSSPEED=0.94)(Pit ABSLEVEL=1.10)(EMPH ABSLEVEL=0.80)^ミ$1_1(Vol ABSLEVEL=1.13)(Spd ABSSPEED=0.73)(Pit ABSLEVEL=1.22)(EMPH ABSLEVEL=1.06)^コ$1_1(Vol ABSLEVEL=0.94)(Spd ABSSPEED=0.92)(Pit ABSLEVEL=1.08)(EMPH ABSLEVEL=1.44)^ン$1_1(Vol ABSLEVEL=1.27)(Spd ABSSPEED=0.98)(Pit ABSLEVEL=1.26)(EMPH ABSLEVEL=1.74)^デ$2_2(Vol ABSLEVEL=1.00)(Spd ABSSPEED=1.00)(Pit ABSLEVEL=1.00)(EMPH ABSLEVEL=1.00)ク^ダサ!イ$2(Pau MSEC=514)(Vol ABSLEVEL=0.00)(Spd ABSSPEED=2.00)<F>';

  public change: boolean;
  dataChange = new Subject<boolean>();

  public phrase = [
    {
      num: 0,
      id: 'phrase1',
      title: 'これはサンプルです、フレーズ辞書を読み込んでください。',
      value: '$2_2(Vol ABSLEVEL=1.20)(Spd ABSSPEED=1.00)(EMPH ABSLEVEL=1.58)コ^レワD|0(Vol ABSLEVEL=0.87)(Spd ABSSPEED=1.17)(EMPH ABSLEVEL=1.00)^サ!ンプルVデDス$2_2(Vol ABSLEVEL=1.00)(Spd ABSSPEED=1.03)フ^レDーズVジ!ショVオ$2_2(Vol ABSLEVEL=0.78)(Spd ABSSPEED=0.89)(Pit ABSLEVEL=0.96)(EMPH ABSLEVEL=0.40)^ヨ$1_1(Vol ABSLEVEL=0.96)(Spd ABSSPEED=0.94)(Pit ABSLEVEL=1.10)(EMPH ABSLEVEL=0.80)^ミ$1_1(Vol ABSLEVEL=1.13)(Spd ABSSPEED=0.73)(Pit ABSLEVEL=1.22)(EMPH ABSLEVEL=1.06)^コ$1_1(Vol ABSLEVEL=0.94)(Spd ABSSPEED=0.92)(Pit ABSLEVEL=1.08)(EMPH ABSLEVEL=1.44)^ン$1_1(Vol ABSLEVEL=1.27)(Spd ABSSPEED=0.98)(Pit ABSLEVEL=1.26)(EMPH ABSLEVEL=1.74)^デ$2_2(Vol ABSLEVEL=1.00)(Spd ABSSPEED=1.00)(Pit ABSLEVEL=1.00)(EMPH ABSLEVEL=1.00)ク^ダサ!イ$2(Pau MSEC=514)(Vol ABSLEVEL=0.00)(Spd ABSSPEED=2.00)<F>',
    },
    {
      num: 1,
      id: 'phrase2',
      title: 'グラフの右にある凡例をクリックすると、表示・非表示が切り替えられます。',
      value: '$2_2(EMPH ABSLEVEL=1.22)^グ!ラフノ|0(EMPH ABSLEVEL=0.71)ミ^ギニア!ル$1_1(Spd ABSSPEED=1.03)(EMPH ABSLEVEL=1.15)ハ^ンレーオ|0(EMPH ABSLEVEL=0.96)ク^リ!ック|0(EMPH ABSLEVEL=0.68)ス^ル!ト$2_2(Spd ABSSPEED=0.95)(Pit ABSLEVEL=0.97)(EMPH ABSLEVEL=0.78)ヒョ^ージ$1_1(Spd ABSSPEED=1.00)(Pit ABSLEVEL=1.03)(EMPH ABSLEVEL=1.32)ヒ^ヒョ!ージガ|0(Spd ABSSPEED=1.05)(Pit ABSLEVEL=1.00)(EMPH ABSLEVEL=1.00)キ^リカエラレマ!ス<F>',
    },
    {
      num: 2,
      id: 'phrase3',
      title: 'グラフ上の数字はマウス操作で、移動・編集できます。',
      value: '$2_2グ^ラVフジョDーノ|0(Spd ABSSPEED=1.00)ス^ージDワ$2_2(Spd ABSSPEED=1.00)マ^ウDスソ!ーサデD$2_2(Spd ABSSPEED=0.97)(Pit ABSLEVEL=0.97)イ^ドーD$1_1(Spd ABSSPEED=1.03)(Pit ABSLEVEL=1.03)ヘ^ンVシュー|0(Spd ABSSPEED=1.00)(Pit ABSLEVEL=1.00)デ^キマ!スD<F>',
    },
    {
      num: 3,
      id: 'phrase4',
      title: '琴フェスにいっきたーい！',
      value: '$2_2(Pit ABSLEVEL=1.10)(EMPH ABSLEVEL=1.37)コ^トフェス|0(Pit ABSLEVEL=1.22)(EMPH ABSLEVEL=1.64)^ニ|0(Pit ABSLEVEL=0.87)(EMPH ABSLEVEL=0.49)イ^ッV|0(Pit ABSLEVEL=1.32)(EMPH ABSLEVEL=1.23)^キ|0(Pit ABSLEVEL=1.02)(EMPH ABSLEVEL=0.37)^タ!ー|0(Pit ABSLEVEL=1.24)(EMPH ABSLEVEL=0.90)^ー|0(Pit ABSLEVEL=1.37)(EMPH ABSLEVEL=0.56)^ーV|0(Pit ABSLEVEL=1.60)(EMPH ABSLEVEL=0.42)ーD^ー|0(Pit ABSLEVEL=1.76)(EMPH ABSLEVEL=0.21)^ー!イ|0(Pit ABSLEVEL=1.02)(EMPH ABSLEVEL=1.79)^ッ|0(Pit ABSLEVEL=0.53)(EMPH ABSLEVEL=0.84)<A>',
    },
    {
      num: 4,
      id: 'phrase5',
      title: '葵です。',
      value: '$2_2(Spd ABSSPEED=1.25)(Pit ABSLEVEL=0.89)(EMPH ABSLEVEL=0.00)^ア|0(Pit ABSLEVEL=0.97)^ー|0(Pit ABSLEVEL=1.04)^オ|0(Pit ABSLEVEL=1.10)^ー|0(Pit ABSLEVEL=1.14)^イ|0(Pit ABSLEVEL=1.16)^ー|0(Pit ABSLEVEL=1.16)^デ|0(Pit ABSLEVEL=1.18)^ー|0(Spd ABSSPEED=1.00)(Pit ABSLEVEL=1.18)^スD<F>',
    },
  ];


  constructor() { }


  // フレーズの読込
  loadPhrase(dictionary: string, filename: string){
    this.phrase = [];
    const lines = dictionary.split('\r\n');
    lines.forEach(l => {l = l.replace('\r\n', ''); });
    let count = 0;
    for (let i = 0; i < lines.length; i++){
      if (lines[i].substring(0, 4) === 'num:'){
        this.phrase.push({
          num: count,
          id: lines[i],
          title: lines[i + 1],
          value: lines[i + 2],
        });
        count += 1;
        i += 2;
      }
    }
    this.filename = filename + ' _ ' + this.phrase.length + ' 件';
  }

  // フレーズの選択
  selectPhrase(num){
    this.id = this.phrase[num].id;
    this.title = this.phrase[num].title;
    this.value = this.phrase[num].value;
  }

  // フレーズが変更されたことを知らせる
  public changePhrase(){
    this.dataChange.next(true);
  }



  /**
   * フレーズからグラフデータを生成する
   * フレーズ辞書のパーサー的な関数
   */
  public phraseToGraph(phrase: string) {
    const moras: number[] = [];
    const moras_text = [];
    const moras_text_one: string[] = [];
    const acc = [];
    const moras_vol = [];
    const vol: number[] = [];
    let vol_text = [];
    const moras_spd = [];
    const spd: number[] = [];
    let spd_text = [];
    const moras_pit = [];
    const pit: number[] = [];
    let pit_text = [];
    const moras_emp = [];
    const emp: number[] = [];
    let emp_text = [];
    const moras_pau = [];
    const pau = [];
    const pau_size: number[] = [];
    const pau_text = [];
    const large_pau = 16;
    const small_pau = 12;
    let v = 1;
    let s = 1;
    let p = 1;
    let e = 1;
    let a = 0;
    let count = -1;

    if ( phrase.length < 5 ||
      phrase.substring(0, 4) != '$2_2'){
      return null;
    }

    phrase = phrase.substr(4);

    while ( phrase.length > 0 ) {

      const m2: string = phrase.substring(0, 2);
      if ( this.m2List.includes(m2) ){
        // ２文字でヒット
        count += 1;
        const dv = phrase.substring(2, 3);
        let dv_str = '';
        if ( dv === 'D' ){
          dv_str = '▽';
        }
        else if ( dv === 'V' ){
          dv_str = '▼';
        }
        const m = count;
        moras.push(m);
        moras_text.push(dv_str + '<br>' + m2);
        moras_text_one.push(m2);
        acc.push(a);
        if (v >= 0){
          moras_vol.push(m);
          vol.push(v);
          v = -1;
        }
        if (s >= 0){
          moras_spd.push(m);
          spd.push(s);
          s = -1;
        }
        if (p >= 0){
          moras_pit.push(m);
          pit.push(p);
          p = -1;
        }
        if (e >= 0){
          moras_emp.push(m);
          emp.push(e);
          e = -1;
        }
        phrase = phrase.substr(2);
        continue;
      }

      const m1: string = phrase.substring(0, 1);
      if ( this.m1List.includes(m1) ){
        // １文字でヒット
        count += 1;
        const dv = phrase.substring(1, 2);
        let dv_str = '';
        if ( dv === 'D' ){
          dv_str = '▽';
        }
        else if ( dv === 'V' ){
          dv_str = '▼';
        }
        const m = count;
        moras.push(m);
        moras_text.push(dv_str + '<br>' + m1);
        moras_text_one.push(m1);
        acc.push(a);
        if (v >= 0){
          moras_vol.push(m);
          vol.push(v);
          v = -1;
        }
        if (s >= 0){
          moras_spd.push(m);
          spd.push(s);
          s = -1;
        }
        if (p >= 0){
          moras_pit.push(m);
          pit.push(p);
          p = -1;
        }
        if (e >= 0){
          moras_emp.push(m);
          emp.push(e);
          e = -1;
        }
      }
      else if ( m1 === '^' ) {
        a = 1;
      }
      else if ( m1 === '!' ) {
        a = 0;
      }
      else if ( m1 === '|' ){
        a = 0;
        count += 1;
        moras.push(moras[moras.length - 1]);
        moras_text.push('');
        acc.push(null);
      }
      else if ( m1 === '(' ){
        const array = phrase.match(/[0-9]+\.?[0-9]*/g);
        if (array.length == 0){
          console.log('phrase');
          console.log(phrase);
          phrase = phrase.substr(1);
          continue;
        }
        const val = parseFloat(array[0]);
        switch ( phrase.substring(0, 4) ) {
          case '(EMP':
            e = val;
            if (phrase.substring(0, 13) == '(EMPH REVERT)'){ e = 1; }
            break;
          case '(Vol':
            v = val;
            if (phrase.substring(0, 12) == '(Vol REVERT)'){ v = 1; }
            break;
          case '(Spd':
            s = val;
            if (phrase.substring(0, 12) == '(Spd REVERT)'){ s = 1; }
            break;
          case '(Pit':
            p = val;
            if (phrase.substring(0, 12) == '(Pit REVERT)'){ p = 1; }
            break;
          case '(Pau':
            count += 1;
            const m = count;
            moras.push(m);
            moras_text.push('');
            moras_text_one.push('');
            acc.push(null);
            moras_pau.push(m);
            pau.push(1);
            pau_text.push(val);
            if (val < 300){
              pau_size.push(small_pau);
            }else{
              pau_size.push(large_pau);
            }
            break;
          }
      }
      else if ( m1 === '<' || m1 === '$' ){
        let m = '';
        switch (phrase) {
          case '<F>':
            m = '。';
            break;
          case '<R>':
            m = '？';
            break;
          case '<H>':
            m = '♪';
            break;
          case '<A>':
            m = '！';
            break;
          case '$2_2':
            m = '--';
            break;
          default:
            if (phrase.substr(0, 4) === '$2_2'){
              m = '長';
            }
            else if (phrase.substr(0, 4) === '$1_1'){
              m = '短';
            }
        }
        if (m !== ''){
          count += 1;
          if (phrase.length <= 4){  // 末尾のとき
            moras_text.push('<br>' + m);
            moras_text_one.push(m);
            const mm = count;
            moras.push(mm);
            acc.push(null);
              if (v < 0){v = vol[vol.length - 1]; }
            moras_vol.push(mm);
            vol.push(v);
            if (s < 0){s = spd[spd.length - 1]; }
            moras_spd.push(mm);
            spd.push(s);
            if (p < 0){p = pit[pit.length - 1]; }
            moras_pit.push(mm);
            pit.push(p);
            if (e < 0){e = emp[emp.length - 1]; }
            moras_emp.push(mm);
            emp.push(e);
          }
          else{ // ポーズのとき
            const mm = count;
            moras.push(mm);
            moras_text.push('');
            moras_text_one.push('');
            acc.push(null);
            moras_pau.push(mm);
            pau.push(1);
            pau_text.push(m);
            if (m === '短'){
              pau_size.push(small_pau);
            }else{
              pau_size.push(large_pau);
            }
          }
        }
      }

      phrase = phrase.substr(1);
    }


    for (let i = 0; i < acc.length; i++){
      if (acc[i] !== null){
        acc[i] = 0.25 + 1.5 * acc[i];
      }
    }
    vol_text = this.makeMorasText(moras_vol, moras_text_one);
    spd_text = this.makeMorasText(moras_spd, moras_text_one);
    pit_text = this.makeMorasText(moras_pit, moras_text_one);
    emp_text = this.makeMorasText(moras_emp, moras_text_one);

    return {
    moras,     acc, moras_text,
    moras_vol, vol, vol_text,
    moras_spd, spd, spd_text,
    moras_pit, pit, pit_text,
    moras_emp, emp, emp_text,
    moras_pau, pau, pau_text, pau_size };
  }

  private makeMorasText(val: number[], moras: string[]): string[]{
    const texts: string[] = [];
    for (let i = 0; i < val.length - 1; i++){
      let p = '';
      for (let j = val[i]; j < val[i + 1]; j++){
        p += moras[j];
      }
      texts.push(p);
    }
    texts.push('');
    return texts;
  }

  // ボイスロイド２で使用される１文字もモーラ
  private m1List = [
    'ア', 'イ', 'ウ', 'エ', 'オ',
    'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ',
    'ヤ', 'ユ', 'ヨ',
    'ラ', 'リ', 'ル', 'レ', 'ロ',
    'ワ', 'ヲ', 'ン',
    'ヰ', 'ヴ', 'ヱ',
    'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
    'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
    'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
    'バ', 'ビ', 'ブ', 'ベ', 'ボ',
    'パ', 'ピ', 'プ', 'ペ', 'ポ',
    'ァ', 'ィ', 'ゥ', 'ェ', 'ォ',
    'ャ', 'ュ', 'ョ',
    'ー', 'ッ'  ];

    // ボイスロイド２で使用される２文字もモーラ
    private m2List = [
        'イェ',
        'ウィ',         'ウェ', 'ウォ',
                    'キェ',         'キャ', 'キュ', 'キョ',
'クァ', 'クィ',         'クェ', 'クォ',
                    'シェ',         'シャ', 'シュ', 'ショ',
'スァ', 'スィ',         'スェ', 'スォ',
                    'チェ',         'チャ', 'チュ', 'チョ',
'ツァ', 'ツィ',         'ツェ', 'ツォ',
    'ティ',                         'テャ', 'テュ', 'テョ',
            'トゥ',
                    'ニェ',         'ニャ', 'ニュ', 'ニョ',
'ヌァ', 'ヌィ',         'ヌェ', 'ヌォ',
                    'ヒェ',         'ヒャ', 'ヒュ', 'ヒョ',
'ファ', 'フィ',         'フェ', 'フォ', 'フャ', 'フュ', 'フョ',
                    'ミェ',         'ミャ', 'ミュ', 'ミョ',
'ムァ', 'ムィ',         'ムェ', 'ムォ',
                    'リェ',         'リャ', 'リュ', 'リョ',
'ルァ', 'ルィ',         'ルェ', 'ルォ',
'ヴァ', 'ヴィ',         'ヴェ', 'ヴォ', 'ヴャ', 'ヴュ', 'ヴョ',
                    'ギェ',         'ギャ', 'ギュ', 'ギョ',
'グァ', 'グィ',         'グェ', 'グォ',
                    'ジェ',         'ジャ', 'ジュ', 'ジョ',
'ズァ', 'ズィ',         'ズェ', 'ズォ',
    'ディ',                         'デャ', 'デュ', 'デョ',
            'ドゥ',
                    'ビェ',         'ビャ', 'ビュ', 'ビョ',
'ブァ', 'ブィ',         'ブェ', 'ブォ', 'ブャ', 'ブュ', 'ブョ',
                    'ピェ',         'ピャ', 'ピュ', 'ピョ',
  'プァ', 'プィ',         'プェ', 'プォ', 'プャ', 'プュ', 'プョ',
  ];

}
