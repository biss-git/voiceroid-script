import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import { NbThemeService, NbToastrService, NbComponentStatus, NbGlobalPhysicalPosition, NbDialogService } from '@nebular/theme';
import { FileloadService } from '../../../service/fileload.service';
import { DownloadService } from '../../../service/download.service';
import { CharactorsService } from '../../../service/charactors.service';
import {API} from '@editorjs/editorjs';
import { DomSanitizer } from '@angular/platform-browser';
import { FileInfo } from '../../../@core/data/file-info';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScriptProjectService } from '../../../service/script-project.service';
import { Route } from '@angular/compiler/src/core';
import { ImageSourceDialogComponent } from './image-source-dialog/image-source-dialog.component';
import { Character } from '../../../model/character.model';
import { ProfitBarAnimationChartData } from '../../../@core/data/profit-bar-animation-chart';

@Component({
  selector: 'ngx-voiceroid-editor',
  templateUrl: './voiceroid-editor.component.html',
  styleUrls: ['./voiceroid-editor.component.scss'],
})
export class VoiceroidEditiorComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private theme: NbThemeService,
    private download: DownloadService,
    private charaService: CharactorsService,
    private sanitizer: DomSanitizer,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private projectService: ScriptProjectService) { }

  matrixParamsSubscription: Subscription;

  charaLoad = true;
  scriptLoad = true;
  isBusy = false;
  ngOnInit(): void {
    setTimeout(() => {
      if (this.charaLoad){
        this.characters = this.charaService.characters;
        VoiceroidEditorPlugin.characters = this.characters;
      }
      if (this.scriptLoad){
        if (this.charaService.tempData){
          this.config.data = this.charaService.tempData;
        }
        this.editor = new EditorJS(this.config);
      }
    }, 10);

    this.matrixParamsSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.has('number')){
        const characters = this.projectService.project.characters;
        this.charaLoad = false;
        this.scriptLoad = false;
        this.isBusy = true;
        if (characters){
          this.onFileLoad([characters]);
        }
        else{
          this.characters = this.charaService.characters;
        }
        VoiceroidEditorPlugin.characters = this.characters;
        const number = parseInt( params.get('number'), 10);
        const scripts = this.projectService.project.scripts;
        setTimeout(() => {
          if (scripts && number < scripts.length){
            this.onFileLoad([scripts[number]]);
          }
          else{
            if (this.charaService.tempData){
              this.config.data = this.charaService.tempData;
            }
            this.editor = new EditorJS(this.config);
          }
          const target = document.getElementById('scriptEditor');
          target.scrollIntoView();
          this.isBusy = false;
        }, 100);
      }
    });

  }

  id: string = 'editorjs';

  bgColor = '#eeeeee';
  textColor = '#222222';

  script = '';
  charaNameType = 'use';

  breakBar = false;
  breakChara = '/';
  breakType = 'block';

  noBreak: boolean = false;

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

  /**
   * 表の設定
   */
  settings = {
    //selectMode: 'multi',
    //mode: 'external',
    pager: {
      perPage: 50,
    },
    actions: {
      //add: false,
      edit: false,
      //delete: false,
      position: 'right',
      //select: true,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      show: {
        title: '表示',
        type: 'html',
        valuePrepareFunction: (value, value2) => {
          const index = this.characters.indexOf(value2);
          const id = 'showTableItem' + index;
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element){
              element.addEventListener('change', (e) => {
                this.characters[index].show = event.target['checked'];
              });
            }
          }, 30);
          const checked = value ? 'checked' : '';
          return this.sanitizer.bypassSecurityTrustHtml(
            //'<input id="' + id + '" type="checkbox" ' + checked + ' style="color: #f00">表示</input>'
            '<div class="sample3Area"><input id="' + id + '" class="sample3AreaChild" type="checkbox" ' + checked + '><label style="cursor: pointer;" for="' + id + '"><span></span></label></div>',
          );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
      id: {
        title: 'ID',
        type: 'html',
        valuePrepareFunction: (value) => {
          return this.sanitizer.bypassSecurityTrustHtml(
            '<h5>' + value + '</h5>',
          );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
      src: {
        title: '画像',
        type: 'html',
        valuePrepareFunction: (value, value2, value3) => {
          const number = value3.dataSet.data.indexOf(value2);
          const id = 'imageSource' + number;
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element){
              element.addEventListener('click', (e) => {
                this.editChara(this.charaService.characters[number]);
                // this.charaService.selectedChara = this.charaService.characters[number];
                // this.dialogService.open(ImageSourceDialogComponent)
                // .onClose.subscribe(
                //   (chara: Character) => {
                //     if (chara){
                //       this.charaService.selectedChara.src = chara.src;
                //       this.charaService.selectedChara.name = chara.name;
                //       this.refreshTable();
                //       this.refresh();
                //     }
                //   });
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<img id="' + id  + '" src="' + value2.src + '" style="cursor: pointer;" alt="画像" width="50px" height="50px"/>',
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
      name: {
        title: 'キャラクター名',
        type: 'string',
        filter: false,
        sort: false,
        width: '70%',
      },
      up: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value, value2) => {
          const index = this.characters.indexOf(value2);
          const id = 'upTableItem' + index;
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element){
              element.addEventListener('click', (e) => {
                if (index > 1){
                  const distNum = index - 1;
                  const temp = this.characters[distNum];
                  this.characters[distNum] = this.characters[index];
                  this.characters[index] = temp;
                  this.refreshTable();
                }
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<svg id="' + id + '" class="myIconHover" style="cursor: pointer; width:32px; height:32px; " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="arrow-upward"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M5.23 10.64a1 1 0 0 0 1.41.13L11 7.14V19a1 1 0 0 0 2 0V7.14l4.36 3.63a1 1 0 1 0 1.28-1.54l-6-5-.15-.09-.13-.07a1 1 0 0 0-.72 0l-.13.07-.15.09-6 5a1 1 0 0 0-.13 1.41z"/></g></g></svg>',
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
      down: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value, value2) => {
          const index = this.characters.indexOf(value2);
          const id = 'downTableItem' + index;
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element){
              element.addEventListener('click', (e) => {
              if (index > 0 && index < this.characters.length - 1){
                const distNum = index + 1;
                const temp = this.characters[distNum];
                this.characters[distNum] = this.characters[index];
                this.characters[index] = temp;
                this.refreshTable();
              }
            });
          }
        }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<svg id="' + id + '" class="myIconHover" style="cursor: pointer; width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="arrow-downward"><rect width="24" height="24" opacity="0"/><path d="M18.77 13.36a1 1 0 0 0-1.41-.13L13 16.86V5a1 1 0 0 0-2 0v11.86l-4.36-3.63a1 1 0 1 0-1.28 1.54l6 5 .15.09.13.07a1 1 0 0 0 .72 0l.13-.07.15-.09 6-5a1 1 0 0 0 .13-1.41z"/></g></g></svg>',
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
    },
  };

  editChara(selectedChara: Character, update: boolean = false){
    this.charaService.selectedChara = selectedChara;
    this.dialogService.open(ImageSourceDialogComponent)
    .onClose.subscribe(
      (chara: Character) => {
        if (chara){
          this.charaService.selectedChara.src = chara.src;
          this.charaService.selectedChara.name = chara.name;
          this.refreshTable();
          if(update){
            this.refresh();
          }
        }
      });
  }

  refreshTable(){
    this.charaService.characters = [].concat(this.characters);
    this.characters = this.charaService.characters;
  }

  reNumbering(){
    const changeTable: number[] = [];

    for (let i = 0; i < this.characters.length; i++){
      changeTable.push(this.characters[i].id);
      this.characters[i].id = i;
      this.characters[i].isNull = false;
    }
    this.characters[0].isNull = true;
    this.characters[0].src = 'assets/images/null.png';

    this.refreshTable();

    this.refresh(changeTable);
  }

  private themeSubscription: Subscription;

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      VoiceroidEditorPlugin.bgColor = config.variables.bg.toString();
      VoiceroidEditorPlugin.textColor = config.variables.fgText.toString();
      this.refresh();
      setTimeout(() => {
        this.bgColor = config.variables.bg.toString();
        this.textColor = config.variables.fgText.toString();
      }, 10);
    });
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.matrixParamsSubscription.unsubscribe();
    if (this.editor){
      /**
       * ページ切り替えが早すぎるとeditorが完成する前にsaveが呼ばれてエラーになる
       * 対策としてとりあえずtryで囲んだ
       */
      try{
        this.editor.save().then(
          data => {
            this.charaService.tempData = data as any;
          },
        );
      }
      catch{
      }
    }
  }

  clearEditor(){
    if (window.confirm('台本データを全て削除します。よろしいですか？')) {
      if (this.editor){
        this.editor.destroy();
        this.config.data = null;
        this.editor = new EditorJS(this.config);
        this.showToast('primary', '台本データを削除しました', '');;
      }
    }
  }

  // エディターを作りなおしてリフレッシュする、主に背景色、文字色、キャラクター情報を適用するため
  refresh(changeTable: number[] = null){
    if (this.editor){
      this.editor.save().then(
        data => {

          if (changeTable){
            const table: number [] = [];
            for (let i = 0; i < changeTable.length; i++){
              table.push(changeTable.indexOf(i));
            }
            data.blocks.forEach(block => {
              if (block.data['id'] < table.length){
                block.data['id'] = table[block.data['id']];
              }
            });
          }

          VoiceroidEditorPlugin.characters = this.characters;

          this.checkCharaBlocks(data.blocks as any);

          this.config.data = data;
          this.editor.destroy();
          this.editor = new EditorJS(this.config);
        },
      );
    }
  }

  checkCharaBlocks(blocks: VoisBlock[]){
    blocks.forEach( b => {
      const text = b.data.text;
      if (text.includes('＞')){
        const pos = text.indexOf('＞');
        const name = text.slice(0, pos);
        const index = this.characters.findIndex(c => c.name == name);
        if (index >= 0){
          b.data.id = this.characters[index].id;
          b.data.text = text.slice(pos + 1);
        }
      }
      if (b.data.id == 0 && b.data.name){
        this.characters.forEach(c => {
          const name = c.name.replace(' ', '_');
          if (b.data.name.includes(name) || b.data.name.includes(c.name)){
            b.data.id = c.id;
          }
        });
      }
    });
  }

  async onFileLoad(files: FileInfo[]){
    let data;

    if (files.length == 1){
      if (files[0].extension == '.vois'){
        data = JSON.parse(files[0].content);
        this.showToast('primary', files[0].name, '');
      }
      else if (files[0].extension == '.vcha'){
        this.charaService.characters = JSON.parse(files[0].content);
        this.characters = this.charaService.characters;
        this.refresh();
        /*
        if (!this.isBusy){
          setTimeout(() => {
            const target = document.getElementById('characterList');
            target.scrollIntoView();
          }, 1000);
        }
        */
        this.showToast('primary', files[0].name, '');
        return;
      }
      else if (files[0].extension == '.vpc'){
        this.charaService.characters = this.loadVPC(files[0].content);
        this.characters = this.charaService.characters;
        this.refresh();
        /*
        if (!this.isBusy){
          setTimeout(() => {
            const target = document.getElementById('characterList');
            target.scrollIntoView();
          }, 1000);
        }
        */
        this.showToast('primary', files[0].name, '');
        return;
      }
      else if (files[0].extension == '.txt'){
        const blocks = this.TabTextToBlocks(files[0].content);
        this.checkCharaBlocks(blocks);
        data = await this.addBlocks(blocks);
        this.showToast('primary', files[0].name, '');
      }
      else{
        this.showToast('warning', files[0].name, '未対応の拡張子');
        return;
      }
    }
    else{
      files = files.sort((a, b) => a.name.localeCompare(b.name)).filter( f => (f.extension == '.txt'));
      const blocks = this.TextFilesToBlocks(files);
      this.checkCharaBlocks(blocks);
      data = await this.addBlocks(blocks);
      this.showToast('primary', files.length + ' ファイル読み込まれました', '');
    }

    this.config.data = data;
    if (this.editor){
      this.editor.destroy();
    }
    this.editor = new EditorJS(this.config);
  }


  /**
   * ボイスプリセットからキャラクター情報を構成する
   * @param text
   */
  loadVPC(text: string): Character[]{
    const characters: Character[] = [
      {
        id: 0,
        name: '',
        src: this.charaService.sources[0],
        isNull: true,
        show: true,
      }
    ];
    const lines = text.split('\n');
    let newChara: Character = null;
    lines.forEach(line => {
      if(line.includes('<VoicePreset>')){
        newChara = {
          id: characters.length,
          name: '',
          src: this.charaService.sources[0],
          isNull: false,
          show: true,
        }
      }
      else if(newChara){
        if(line.includes('<PresetName>')){
          const regex: string = 'me>.+</P';
          const match = line.match(regex);
          if(match.length>0){
            newChara.name = match[0].slice(3,-3);
          }
        }
        else if(line.includes('<VoiceName>')){
          if(line.includes('aoi')){
            newChara.src = this.charaService.sources[1];
          }
          else if(line.includes('akane')){
            newChara.src = this.charaService.sources[2];
          }
          else if(line.includes('yukari')){
            newChara.src = this.charaService.sources[3];
          }
          else if(line.includes('akari')){
            newChara.src = this.charaService.sources[4];
          }
          else if(line.includes('tami')){
            newChara.src = this.charaService.sources[5];
          }
          else if(line.includes('tsuina')){
            newChara.src = this.charaService.sources[6];
          }
          else if(line.includes('seika')){
            newChara.src = this.charaService.sources[7];
          }
          else if(line.includes('kiri')){
            newChara.src = this.charaService.sources[8];
          }
          else if(line.includes('zunko')){
            newChara.src = this.charaService.sources[9];
          }
          else if(line.includes('tuku')){
            newChara.src = this.charaService.sources[10];
          }
          else if(line.includes('itako')){
            newChara.src = this.charaService.sources[11];
          }
          else if(line.includes('sora')){
            newChara.src = this.charaService.sources[12];
          }
        }
        else if(line.includes('</VoicePreset>')){
          characters.push(newChara)
          newChara = null;
        }
      }
    });
    return characters;
  }

  // タブ付き文字をeditor に対応した形式に直す
  private TabTextToBlocks(text: string): VoisBlock[]{
    const blocks: VoisBlock[] = [];
    const lines = text.split(/\r\n|\r|\n/);
    lines.forEach((line) => {
      let id = 0;
      if ( line.indexOf('\t') === 0 ){
        const tabs = line.match(/\t+/);
        id = tabs[0].length;
        line = line.replace(/\t+/, '');
      }
      blocks.push({
        'type': 'paragraph',
        'data': {
          'id': id,
          'text': line,
          'name': '',
        },
      } as VoisBlock);
    });
    return blocks;
  }

  private TextFilesToBlocks(files: FileInfo[]): VoisBlock[]{
    const blocks = [];
    files.forEach((f) => {
      const id = 0;
      blocks.push({
        'type': 'paragraph',
        'data': {
          'id': id,
          'text': f.content as string,
          'name': f.name,
        },
      } as VoisBlock);
    });
    return blocks;
  }

  private async addBlocks(blocks: VoisBlock[]): Promise<{blocks: VoisBlock[]}>{
    const newData = {blocks: []};

    await this.editor.save().then(
      data => {
        newData.blocks = data.blocks;
      },
    );

    blocks.forEach( b => {
      newData.blocks.push(b);
    });

    return newData;
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

        this.download.downloadText(script, '台本', true, '.txt', true);
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
      if (c.name){
        c.show = true;
      }
    });
    this.refreshTable();
  }
  private hideAllCharacters(){
    this.characters.forEach( (c) => {
      if (c.name){
        c.show = false;
      }
    });
    this.refreshTable();
  }

  // キャラクターを追加
  onCreateConfirm(event): void {
    if (!event.newData.id || event.newData.id == 0){
      event.newData.id = this.characters.length;
    }
    event.newData.show = true;
    event.confirm.resolve(event.newData);
    event.newData.src = 'assets/images/null.png';
    setTimeout(() => {
      this.characters = event.source.data;
      const temp = this.characters.shift();
      this.characters.splice(1, 0, temp);
      this.refreshTable();
    }, 100);
  }

  // キャラクターを編集
  onEditConfirm(event): void {
    if (event.newData.id == 0){
      event.newData.src = 'assets/images/null.png';
    }
    event.confirm.resolve(event.newData);
  }

  // キャラクターを削除
  onDeleteConfirm(event): void {
    if (event.data.id == 0){
      window.alert('このキャラクターは削除できません。');
      event.confirm.reject(event.data);
      return;
    }

    if (window.confirm('「' + event.data.name + '」のキャラクター情報を削除しますか？')) {
      event.confirm.resolve(event.data);
    } else {
      event.confirm.reject(event.data);
    }
    setTimeout(() => {
      this.characters = event.source.data;
      this.refreshTable();
    }, 10);
  }

  // キャラクター情報を保存
  onSaveChara(){
    const json = JSON.stringify(this.characters, undefined, 2);
    this.download.downloadText(json, 'キャラクター情報', true, '.vcha');
  }


  // ボイスロイド２用のスクリプト生成
  generateScript(): void{
    this.editor.save().then(
      data => {
        let script = '';
        let currentShow = true;
        let name = null;
        data.blocks.forEach((block) => {

          // 表示・非表示の判定
          const id = block.data['id'];
          const chara = this.characters.find(c => c.id == id);
          if (id == null || chara == null){
            // id が不明な場合は何もしない
            return;
          }
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
            if (this.charaNameType == 'use' && name){
              line = name + '＞';
            }
          }
          if (this.charaNameType == 'all' && (name || chara.name)){
            if (chara.name){
              name = chara.name;
            }
            line = name + '＞';
          }
          line += block.data['text'];

          // 区切り文字を付ける
          if (this.breakBar){
            if (this.breakType == 'enter'){
              line = line.replace(/\n/g, '/\n') + '/';
            }
            else if (this.breakType == 'block'){
              line = line + '/';
            }
          }

          script += line + '\n';
        });

        if (script.slice(-2) == '/\n'){
          script = script.slice(0, -2);
        }

        if(this.noBreak){
          script = script.replace(/\n/g, '');
        }

        this.script = script;
      },
    );
  }

  // ボイスロイド２用スクリプトをクリップボードにコピー
  copyScript(){
    if (navigator.clipboard){
      navigator.clipboard.writeText(this.script).then(
        () => {
          this.showToast('primary', 'クリップボードに共有リンクがコピーされました', '');
        },
        () => {/* 失敗 */},
      );
    }
  }

  clearScript(){
    this.script = '';
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {

    const config = {
      status: type,
      destroyByClick: true,
      duration: 2000,
      hasIcon: false,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: true,
    };
    const titleContent = title ? `. ${title}` : '';

    this.toastrService.show(
      body,
      title,
      config);
  }

}












//プラグインを構成するクラス
class VoiceroidEditorPlugin {

  static bgColor = '#ffff00';
  static textColor = '#0000ff';

  static characters: Character[] = [
    { id: 0, show: true, name: '', src: '', isNull: true},
  ];


  private id: number = 0;

  private div: HTMLDivElement;
  private img: HTMLImageElement;
  private textInput: HTMLTextAreaElement;

  private initId: number = 0;
  private initText: string = '';
  static tempText: string = '';

  private api: API;
  private name: string = '';


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
      for (let i = 0; i < VoiceroidEditorPlugin.characters.length; i++){
        if (VoiceroidEditorPlugin.characters[i].id == data.id){
          this.initId = i;
          break;
        }
      }
    }
    if (data.name){
      this.name = data.name;
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
    this.textInput.title = this.name;

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
      if (this.textInput.value && currentTextArea.value){
        currentTextArea.value += '\n' + this.textInput.value;
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

      let newText = this.textInput.value.substr(this.textInput.selectionStart);
      if ( newText.indexOf('\n') === 0 ){
        newText = newText.substr(1);
      }
      newBlock.getElementsByTagName('textarea')[0].value = newText;

      let currentText = this.textInput.value.substr(0, this.textInput.selectionStart);
      if ((currentText.lastIndexOf('\n') + 1 === currentText.length) && (1 <= currentText.length)){
        currentText = currentText.substr(0, currentText.length - 1);
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

    // F2 で名称変更
    if (e.key === 'F2'){
      const result = window.prompt('ブロックのファイル名を入力', this.name);
      if (result){
        this.name = result;
        this.textInput.title = this.name;
      }
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
      name: this.name,
    };
  }

  renderSettings(){
    const wrapper = document.createElement('div');

    VoiceroidEditorPlugin.characters.forEach( tune => {
      const button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      const src = tune.src != '' ? tune.src : 'assets/images/null.png';
      const img = '<img width="30" height="30" style="margin: 2px;" src="' + src + '" alt="画"></img>';
      button.innerHTML = img;
      wrapper.appendChild(button);

      button.addEventListener('click', () => {
        this.toggleTune(tune, false);
        button.classList.toggle('cdx-settings-button--active');
      });
    });

    return wrapper;
  }

  private toggleTune(tune: Character, isNew: boolean) {
    this.id = tune.id;
    let src = '';
    if (tune.isNull){
      this.img.height = 10;
      src = 'assets/images/null.png';
      this.img.alt = '';
    }
    else{
      this.img.height = 50;
      src =  VoiceroidEditorPlugin.characters.find(c => c.id == tune.id).src;
      this.img.title = VoiceroidEditorPlugin.characters[this.id].name;
      this.img.alt = tune.name;
    }
    this.img.src = src != '' ? src : 'assets/images/null.png';
    if (!this.textInput.value && VoiceroidEditorPlugin.tempText){
      this.textInput.value = VoiceroidEditorPlugin.tempText;
    }
    if (!isNew){
      setTimeout(() => {
        this.textInput.selectionStart = this.textInput.value.length;
        this.textInput.selectionEnd = this.textInput.value.length;
      }, 50);
    }
    if(tune.show){
      this.div.style.display = 'flex';
    }
    else{
      this.div.style.display = 'none';
    }
    this.api.toolbar.close();
    this.api.tooltip.hide();
  }

}


export class VoisBlock{
  type: string;
  data: {
    id: number,
    text: string,
    name: string,
  };
}
