import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import VoiceroidEditor from './plugin/voiceroid-editor';
import { NbThemeService } from '@nebular/theme';
import { FileloadService } from '../../../service/fileload.service';
import { DownloadService } from '../../../service/download.service';
import { CharactorsService } from '../../../service/charactors.service';

@Component({
  selector: 'ngx-editorjs',
  templateUrl: './editorjs.component.html',
  styleUrls: ['./editorjs.component.scss'],
})
export class EditorjsComponent implements AfterViewInit, OnDestroy {

  constructor(private theme: NbThemeService,
              private download: DownloadService,
              private fileload: FileloadService,
              private charaService: CharactorsService) { }

  id: string = 'editorjs';

  bgColor = '#eeeeee';
  textColor = '#222222';
  dropAreaColor = '#eeeeee';

  script = '';

  characters = [
    { id: 0, show: true, name: '', src: '', isNull: true},
  ];

  private editor: EditorJS;

  private config: EditorJS.EditorConfig = {
    holder: this.id,
    autofocus: true,
    tools: {
      paragraph: VoiceroidEditor,
    },
  };

  private themeSubscription: any;

  ngAfterViewInit() {
    setTimeout(() => {
      this.characters = this.charaService.characters;
      VoiceroidEditor.characters = this.charaService.characters;
      if(this.charaService.tempData){
        this.config.data = this.charaService.tempData;
      }
      this.editor = new EditorJS(this.config);
    }, 10);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      console.log(config);
      VoiceroidEditor.bgColor = config.variables.bg.toString();
      VoiceroidEditor.textColor = config.variables.fgText.toString();
      this.reflesh();
      setTimeout(() => {
        this.bgColor = config.variables.bg.toString();
        this.textColor = config.variables.fgText.toString();
        this.dropAreaColor = this.bgColor;
      }, 10);
    });
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.editor.save().then(
      data => {
        this.charaService.tempData = data;
      },
    );
  }

  // エディターを作りなおしてリフレッシュする、主に背景色、文字色、キャラクター情報を適用するため
  private reflesh(){
    if (this.editor){
      this.editor.save().then(
        data => {
          this.config.data = data;
          this.editor.destroy();
          this.editor = new EditorJS(this.config);
        },
      );
    }
  }

  // ファイルを選択からファイルを読み込むとき
  onChangeInput(event) {
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.readFile(file);
    }
  }

  // ファイルのドラッグ＆ドロップのとき
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
    //this.filename = file.name;
    const extension = this.fileload.getExtension(file.name);
    this.fileload.fileToText(file, false)
      .then(text => {
        let data;
        if (extension == '.vois'){
          data = JSON.parse(text);
        }
        else if(extension == '.vcha'){
          this.charaService.characters = JSON.parse(text);
          this.characters = this.charaService.characters;
          VoiceroidEditor.characters = this.charaService.characters;
          this.reflesh();
          setTimeout(() => {
            const target = document.getElementById('characterList');
            target.scrollIntoView();
          }, 1000);
          return;
        }
        else{
          data = this.TabTextToBlocks(text);
        }
        this.config.data = data;
        this.editor.destroy();
        this.editor = new EditorJS(this.config);
      })
      .catch(err => console.log(err));
  }

  // タブ付き文字をeditor に対応した形式に直す
  private TabTextToBlocks(text: string): any{
    const blocks = [];
    const lines = text.split(/\r\n|\r|\n/);
    lines.forEach((line) => {
      const tabs = line.match(/\t+/);
      let id = 0;
      if (tabs){
        id = tabs[0].length;
      }
      line = line.replace(/\t+/, '');
      blocks.push({
        'type': 'paragraph',
        'data': {
          'id': id,
          'text': line,
        },
      });
    });
    return {blocks};
  }

  // 台本ファイルを保存
  onSave(){
    this.editor.save().then(
      data => {
        const json = JSON.stringify(data, undefined, 2);
        this.download.downloadText(json, '台本', true, '.vois');
      },
    );
  }

  // 台本ファイルをタブ付きテキストで保存
  onSaveTabText(){
    this.editor.save().then(
      data => {
        let script = '';
        data.blocks.forEach((block) => {
          let tabs = '';
          const tab = '\t';
          for (let i = 0; i < block.data['id']; i++){
            tabs += tab;
          }
          script += tabs;
          script += block.data['text'];
          script += '\r\n';
        });
        this.download.downloadText(script, '台本', true, '.txt');
      },
    );
  }

  // キャラクターのすべてのチェックを切り替える
  allCheck(){
    // return を使いたいのでforEachではなくfor文で書いてる
    for ( let i = 0; i < this.characters.length; i++ ){
      if (!this.characters[i].show && this.characters[i].name){
        this.showAllCharacters();
        return;
      }
    }
    this.hideAllCharacters();
  }
  private showAllCharacters(){
    this.characters.forEach( (c) => {
      if(c.name){
        c.show = true;
      }
    });
  }
  private hideAllCharacters(){
    this.characters.forEach( (c) => {
      if(c.name){
        c.show = false;
      }
    });
  }

  // キャラクター情報を保存
  onSaveChara(){
    const json = JSON.stringify(this.characters, undefined, 2);
    this.download.downloadText(json, 'キャラクター情報', true, '.vcha');
  }


  // ボイスロイド２用のスクリプト生成
  GenerateScript(){
    this.editor.save().then(
      data => {
        let script = '';
        let currentShow = true;
        data.blocks.forEach((block) => {

          // 表示・非表示の判定
          if (block.data['id'] == null){
            // id が不明な場合は何もしない
            return;
          }
          const chara = this.characters[block.data['id']];
          if (!chara.show ||
             chara.name == '' && !currentShow){
            // そのキャラにチェックがついていない　または
            // キャラ名が空で現在の状態が非表示　の場合は出力しない
            currentShow = false;
            return;
          }
          currentShow = true;

          // 台詞一つ分の文字列を生成
          let line = '';
          const name = chara.name;
          if (name){
            line = name + '＞';
          }
          line += block.data['text'].replace(/<br>/g, '\r\n');
          script += line + '\r\n';
        });
        this.script = script;
      },
    );
  }

  // ボイスロイド２用スクリプトをクリップボードにコピー
  CopyScript(){
    if (navigator.clipboard){
      navigator.clipboard.writeText(this.script).then(
        () => {/* 成功 */},
        () => {/* 失敗 */},
      );
    }
  }

}


