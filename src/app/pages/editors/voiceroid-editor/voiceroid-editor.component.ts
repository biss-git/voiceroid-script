import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
//import VoiceroidEditor from './plugin/voiceroid-editor';
import { NbThemeService } from '@nebular/theme';
import { FileloadService } from '../../../service/fileload.service';
import { DownloadService } from '../../../service/download.service';
import { CharactorsService } from '../../../service/charactors.service';
import {API} from '@editorjs/editorjs';
import { stringify } from 'querystring';

@Component({
  selector: 'ngx-voiceroid-editor',
  templateUrl: './voiceroid-editor.component.html',
  styleUrls: ['./voiceroid-editor.component.scss'],
})
export class VoiceroidEditiorComponent implements AfterViewInit, OnDestroy {

  constructor(private theme: NbThemeService,
              private download: DownloadService,
              private fileload: FileloadService,
              private charaService: CharactorsService) { }

  id: string = 'editorjs';

  bgColor = '#eeeeee';
  textColor = '#222222';
  dropAreaColor = '#eeeeee';

  script = '';
  charaNameType = 'use';

  characters = [
    { id: 0, show: true, name: '', src: '', isNull: true},
  ];

  private editor: EditorJS;

  private config: EditorJS.EditorConfig = {
    holder: this.id,
    autofocus: true,
    tools: {
      paragraph: VoiceroidEditorPlugin,
    },
  };

  private themeSubscription: any;

  ngAfterViewInit() {
    setTimeout(() => {
      this.characters = this.charaService.characters;
      VoiceroidEditorPlugin.characters = this.charaService.characters;
      if(this.charaService.tempData){
        this.config.data = this.charaService.tempData;
      }
      this.editor = new EditorJS(this.config);
    }, 10);
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      VoiceroidEditorPlugin.bgColor = config.variables.bg.toString();
      VoiceroidEditorPlugin.textColor = config.variables.fgText.toString();
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
          VoiceroidEditorPlugin.characters = this.charaService.characters;
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
      let id = 0;
      if( line.indexOf('\t') === 0 ){
        const tabs = line.match(/\t+/);
        id = tabs[0].length;
        line = line.replace(/\t+/, '');
      }
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
        let name = '';
        data.blocks.forEach((block) => {

          // 表示・非表示の判定
          if (block.data['id'] == null){
            // id が不明な場合は何もしない
            return;
          }
          const chara = this.characters[block.data['id']];
          if (!chara.show ||
             chara.isNull && !currentShow){
            // そのキャラにチェックがついていない　または
            // キャラ名が空で現在の状態が非表示　の場合は出力しない
            currentShow = false;
            return;
          }
          currentShow = true;

          // 台詞一つ分の文字列を生成
          let line = '';
          if (!chara.isNull){
            name = chara.name;
            if(this.charaNameType == 'use' && name){
              line = name + '＞';
            }
          }
          if(this.charaNameType == 'all' && name){
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












//プラグインを構成するクラス
class VoiceroidEditorPlugin {

  static bgColor = '#ffff00';
  static textColor = '#0000ff';

  static characters = [
    { id: 0, name: '', src: '', isNull: true}
  ];


  private id: number = 0;

  private div: HTMLDivElement;
  private img: HTMLImageElement;
  private textInput: HTMLTextAreaElement;

  private initId: number = 0;
  private initText: string = '';
  static tempText: string = '';

  private api: API;


  constructor({data, config, api}) {
    this.api = api;
    if (data.text &&
       !(<string>data.text).includes('<textarea')){
      this.initText = data.text;
    }
    else{
      this.initText = '';
    }
    if (data.id){
      this.initId = data.id;
    }
  }

  //メニューバーにアイコンを表示
  static get toolbox() {
    return {
        title: 'Script',
        icon: '<i class="fas fa-images"></i>',
    };
  }

  //プラグインのUIを作成
  render(){

    this.div = document.createElement('div');

    this.img = document.createElement('img');
    this.img.width = 50;
    this.img.height = 10;
    this.img.style.flex = '0 0 50px';
    this.img.style.margin = '6px 10px 0 0';
    this.img.src = 'assets/images/null.png';
    this.img.alt = '';

    this.div.appendChild(this.img);

    this.textInput = document.createElement('textarea');
    this.textInput.classList.add('ce-paragraph', 'cdx-block');
    this.textInput.style.display = 'inline';
    this.textInput.style.border = '0';
    this.textInput.style.resize = 'none';
    this.textInput.style.width = '100%';
    this.textInput.style.backgroundColor = VoiceroidEditorPlugin.bgColor;
    this.textInput.style.color = VoiceroidEditorPlugin.textColor;
    this.textInput.onkeyup = this.onKeyUp.bind(this);
    this.textInput.onkeydown = this.onKeyDown.bind(this);
    this.textInput.setAttribute('rows', '1');

    this.div.appendChild(this.textInput);
    this.div.style.display = 'flex';
    this.div.style.alignItems = 'flex-start';
    this.div.style.userSelect = 'none';

    this.textInput.value = this.initText;
    this.initText = '';
    this.toggleTune(VoiceroidEditorPlugin.characters[this.initId], true);
    setTimeout(() => {
      this.resizeTextArea();
    }, 10);

    return this.div;
  }

  private onKeyUp(e) {
    if (e.code == 'Tab'){
      /*
       * タブ押下時の挙動について
       * editor.js-master/src/components/modules/blockEvents.ts の tabPressedでclearSelectionを遅延実行することでTab押下時の挙動を修正した
       */
    }
    this.resizeTextArea();
  }

  private resizeTextArea(){
    const target = this.textInput;
    target.setAttribute('rows', '1');
    let lineHeight = Number(target.getAttribute('rows'));
    while (target.scrollHeight > target.offsetHeight){
      lineHeight++;
      target.setAttribute('rows', lineHeight.toString());
    }
  }

  private onKeyDown(e) {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    if ( e.key == 'Backspace' &&
        this.api.blocks.getBlocksCount() > 1 &&
        this.textInput.selectionStart == 0 )
    {
      const deleteTargetIndex = currentBlockIndex + 1;

      const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);
      const targetBlock = this.api.blocks.getBlockByIndex(deleteTargetIndex);

      // 削除対象とイベントの発声したブロックが異なる場合は何もしない
      if ( targetBlock.getElementsByTagName('textarea')[0] != this.textInput){
        return;
      }

      // セルの先頭でbackspaceを押したときの処理
      const currentTextArea = currentBlock.getElementsByTagName('textarea')[0];
      let tempPosition = currentTextArea.textLength;
      if(this.textInput.value && currentTextArea.value){
        currentTextArea.value += "\n" + this.textInput.value;
        tempPosition += 1;
      }
      setTimeout(() => {
        currentTextArea.selectionStart = tempPosition;
        currentTextArea.selectionEnd = tempPosition;
      }, 30);
      this.api.blocks.delete(deleteTargetIndex);
    }


    // delete キーでパラグラフを削除するとき
    if ( e.key == 'Delete' &&
        this.textInput.value.length == this.textInput.selectionStart &&
        currentBlockIndex < this.api.blocks.getBlocksCount() - 1)
    {
      const nextIndex = currentBlockIndex + 1;
      const nextBlock = this.api.blocks.getBlockByIndex(nextIndex);
      const tempPosition = this.textInput.selectionStart;
      this.textInput.value += nextBlock.getElementsByTagName('textarea')[0].value;
      setTimeout(() => {
        this.textInput.selectionStart = tempPosition;
        this.textInput.selectionEnd = tempPosition;
      }, 30);
      this.api.blocks.delete(nextIndex);
    }

    // Enter キーで改行するとき
    if ( e.key == 'Enter')
    {
      const newBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);
      if (newBlock.getElementsByTagName('textarea')[0] == this.textInput){
        // Enter押下時に新しいブロックが作られていなければ何もしない
        return;
      }

      let newText= this.textInput.value.substr(this.textInput.selectionStart);
      if( newText.indexOf('\n') === 0 ){
        newText = newText.substr(1);
      }
      newBlock.getElementsByTagName('textarea')[0].value = newText;

      let currentText = this.textInput.value.substr(0, this.textInput.selectionStart)
      if((currentText.lastIndexOf('\n') + 1 === currentText.length)&&(1<=currentText.length)){
        currentText = currentText.substr(0, currentText.length-1);
      }
      this.textInput.value = currentText;
      setTimeout(() => {
        this.textInput.selectionStart = 0;
        this.textInput.selectionEnd = 0;
      }, 30);
    }

    // Alt キーが押されたときにブロックの内容をクリップボードに貼り付ける
    if ( e.key == 'Alt' &&
         navigator.clipboard){
      navigator.clipboard.writeText(this.textInput.value);
    }

    // Tab　キーの後直ぐにEnterキーが押されたときにテキストが消滅するバグの対応
    if (e.code == 'Tab'){
      VoiceroidEditorPlugin.tempText = this.textInput.value;
      setTimeout(() => {
        VoiceroidEditorPlugin.tempText = '';
      }, 500);
    }

    this.resizeTextArea();

    /*
     * api.blocks.delete(index)の挙動について
     * editor.js-master/src/components/modules/api/blocks.ts の delete()がblockIndexを受け取っていなかったので修正した
     */
  }


  validate(savedData) {
    return true;
  }

  //保存時のデータを抽出
  save(data){
    return {
      id: this.id,
      text: this.textInput.value,
    };
  }

  renderSettings(){
    const wrapper = document.createElement('div');

    VoiceroidEditorPlugin.characters.forEach( tune => {
      const button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      const img = '<img width="30" height="30" style="margin: 2px;" src="' + tune.src + '" alt="画"></img>';
      button.innerHTML = img;
      wrapper.appendChild(button);

      button.addEventListener('click', () => {
        this.toggleTune(tune, false);
        button.classList.toggle('cdx-settings-button--active');
      });
    });

    return wrapper;
  }

  private toggleTune(tune, isNew:boolean) {
    this.id = tune.id;
    let imag: string;
    if(tune.isNull){
      this.img.height = 10;
      this.img.src = 'assets/images/null.png';
      this.img.alt = '';
    }
    else{
      this.img.height = 50;
      this.img.src = tune.src;
      this.img.alt = tune.name;
    }
    if(!this.textInput.value && VoiceroidEditorPlugin.tempText){
      this.textInput.value = VoiceroidEditorPlugin.tempText;
    }
    if(!isNew){
      setTimeout(() => {
        this.textInput.selectionStart = this.textInput.value.length;
        this.textInput.selectionEnd = this.textInput.value.length;
      }, 50);
    }
    this.api.toolbar.close();
    this.api.tooltip.hide();
  }

}
