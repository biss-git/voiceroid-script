import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { PhraseService } from '../../../service/phrase.service';
import { FormBuilder } from '@angular/forms';
import { NbThemeService } from '@nebular/theme';
import { FileloadService } from '../../../service/fileload.service';
import { LayoutService } from '../../../@core/utils';

@Component({
  selector: 'ngx-phrase-dictionary',
  styleUrls: ['./phrase-dictionary.component.scss'],
  templateUrl: './phrase-dictionary.component.html',
})
export class PhraseDictionaryComponent implements AfterViewInit, OnDestroy {

  constructor(private phraseService: PhraseService,
              private formBuilder: FormBuilder,
              private theme: NbThemeService,
              private fileload: FileloadService) {
    this.checkoutForm = this.formBuilder.group({
      serchWord: '',
    });
  }

  // 色
  bgColor = '#eeeeee';
  textColor = '#222222';
  dropAreaColor = '#ffffff';

  // フレーズ辞書情報
  filename = '';
  phrase = [];
  number = 0;

  checkoutForm; // 検索のためのフォーム

  private themeSubscription: any;
  private layoutSubscription: any;

  ngAfterViewInit() {
    setTimeout(() => {
      this.phrase = this.phraseService.phrase;
      this.filename = this.phraseService.filename;
    }, 10);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.bgColor = config.variables.bg.toString();
      this.textColor = config.variables.fgText.toString();
      this.dropAreaColor = this.bgColor;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }


  // ファイルを選択　からファイルが選択されたとき
  onChangeInput(event) {
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.readFile(file);
    }
  }

  // ドラッグ＆ドロップで読み込むとき
  drop(e){
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer.files.length > 0){
      const file = e.dataTransfer.files[0];
      this.readFile(file);
    }
    this.dropAreaColor = this.bgColor;
    return false;
  }
  dragover(e){
    e.stopPropagation();
    e.preventDefault();
    this.dropAreaColor = '#dddddd';
  }
  dragleave(e){
    e.stopPropagation();
    e.preventDefault();
    this.dropAreaColor = this.bgColor;
  }

  private readFile(file){
    this.filename = file.name;
    this.fileload.fileToText(file, true)
      .then(text => {
        this.phraseService.loadPhrase(text, file.name);
        this.phrase = this.phraseService.phrase;
        this.phraseService.selectPhrase(0);
        this.phraseService.changePhrase();
        this.filename = this.phraseService.filename;
      })
      .catch(err => console.log(err));
  }

  // フレーズ一覧からフレーズがクリックされたとき
  onClick(num){
    if (this.phraseService.phrase == null ||
       num == null){
      return;
    }

    this.phraseService.num = num;
    this.phraseService.num %= this.phraseService.phrase.length;
    this.phraseService.selectPhrase(this.phraseService.num);
    this.phraseService.changePhrase();

    const target = document.getElementById('phraseGraph');
    target.scrollIntoView();

  }

  // 検索処理
  onSubmit(data): boolean{
    // ボイスロイドの辞書は全角で保存されているため、全角で検索する
    const zenkakuWard = this.hankakuToZenkaku(data.serchWord);
    this.phrase = this.phraseService.phrase.filter(x => x.title.includes(zenkakuWard));
    return false;
  }

  // 半角英数字を全角に直して返す
  private hankakuToZenkaku(str) {
    if (str == null){
      return '';
    }
    let result: string = str;
    result = result.replace(/[A-Za-z0-9]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
    return result;
  }

}
