import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { PhraseService } from '../../../service/phrase.service';
import { NbThemeService } from '@nebular/theme';
import { FileloadService } from '../../../service/fileload.service';
import { FileInfo } from '../../../@core/data/file-info';

@Component({
  selector: 'ngx-phrase-dictionary',
  styleUrls: ['./phrase-dictionary.component.scss'],
  templateUrl: './phrase-dictionary.component.html',
})
export class PhraseDictionaryComponent implements AfterViewInit, OnDestroy {

  constructor(private phraseService: PhraseService,
              private theme: NbThemeService,
              private fileload: FileloadService) {
  }



  // 色
  bgColor = '#eeeeee';
  textColor = '#222222';

  // フレーズ辞書情報
  filename = '';
  phrase = [];
  number = 0;

  private themeSubscription: any;

  settings = {
    pager: {
      perPage: 10,
    },
    actions:{
      add: false,
      edit: false,
      position:'right',
    },
    delete: {
      deleteButtonContent: '<i class="nb-edit"></i>',
      confirmDelete: true,
    },
    columns: {
      num: {
        title: 'ID',
        type: 'number',
        width: '100px',
      },
      title: {
        title: 'フレーズ',
        type: 'string',
        width: '90%',
      },
    },
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.phrase = this.phraseService.phrase;
      this.filename = this.phraseService.filename;
    }, 10);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.bgColor = config.variables.bg.toString();
      this.textColor = config.variables.fgText.toString();
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  onFileLoad(file: FileInfo){
    if(file.extension == '.pdic'){
      this.phraseService.loadPhrase(file.content, file.name);
      this.phrase = this.phraseService.phrase;
      this.phraseService.selectPhrase(0);
      this.phraseService.changePhrase();
      this.filename = this.phraseService.filename;
    }
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

  onDeleteConfirm(event): void {
    event.confirm.reject();
    if (this.phraseService.phrase == null ||
        event.data==null || event.data.num == null){
     return;
    }

    this.phraseService.num = event.data.num;
    this.phraseService.num %= this.phraseService.phrase.length;
    this.phraseService.selectPhrase(this.phraseService.num);
    this.phraseService.changePhrase();

    const target = document.getElementById('phraseGraph');
    target.scrollIntoView();
  }

}
