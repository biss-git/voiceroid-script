import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileInfo } from '../../../@core/data/file-info';
import { ScriptProjectService } from '../../../service/script-project.service';
import { DownloadService } from '../../../service/download.service';
import { GoogleApiService } from '../../../service/google-api.service';

@Component({
  selector: 'ngx-script-project',
  templateUrl: './script-project.component.html',
  styleUrls: ['./script-project.component.scss']
})
export class ScriptProjectComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer,
              private projectService: ScriptProjectService,
              private download: DownloadService,
              private googleAPI: GoogleApiService,) { }

  ngOnInit() {
    this.scriptSource = this.projectService.project.scripts;
    this.characterSource = this.projectService.project.characters;
    this.phraseSource = this.projectService.project.phraseDictionary;
    this.presetSource = this.projectService.project.voicePreset;
    this.settingSource = this.projectService.project.settings;
    this.linkSource = this.projectService.project.fileLinks;
  }


  share:boolean = true;

  async onFileLoad(files:FileInfo[]){
    let count = 0;
    files.forEach(file => {
      if(file.extension == '.vois'){
        this.scriptSource.push(file);
      }
      else if(file.extension == '.vcha'){
        this.characterSource = [file];
      }
      else if(file.extension == '.pdic'){
        this.phraseSource = [file];
      }
      else if(file.extension == '.vpc'){
        this.presetSource = [file];
      }
      else if(file.extension == '.settings'){
        this.settingSource = [file];
      }
      else{
        count += 1;
      }
    });
    if(files.length == 1 && count == 1){
      // 読み込んだファイル数が１つの時だけプロジェクトやその他ファイルを読み込む
      if(files[0].extension == '.voisproj'){
        const project = JSON.parse(files[0].content);
        if(project.scripts){
          this.scriptSource = project.scripts;
        }
        if(project.characters){
          this.characterSource = project.characters;
        }
        if(project.phraseDictionary){
          this.phraseSource = project.phraseDictionary;
        }
        if(project.voicePreset){
          this.presetSource = project.voicePreset;
        }
        if(project.settings){
          this.settingSource = project.settings;
        }
        if(project.fileLinks){
          this.linkSource = project.fileLinks;
        }
      }
      else {
        if(!this.googleAPI.userExists()){
          window.alert('添付ファイルをアップロードするにはGoogleアカウントでログインしてください');
          return;
        }
        if (window.confirm('「' + files[0].name + '」をGoogle Drive にアップロードして公開しますか？')) {
          console.log(files[0]);
          await this.googleAPI.makeNewLinkFile(files[0])
          this.linkSource.push(files[0]);
        } else {
          return;
        }
      }
    }

    this.refreshTable();
  }


  refreshTable(){
    this.scriptSource = [].concat(this.scriptSource);
    //this.characterSource = [].concat(this.characterSource);
    //this.phraseSource = [].concat(this.phraseSource);
    //this.presetSource = [].concat(this.presetSource);
    //this.settingSource = [].concat(this.settingSource);
    this.linkSource = [].concat(this.linkSource);
    this.projectService.project.scripts = this.scriptSource;
    this.projectService.project.characters = this.characterSource;
    this.projectService.project.phraseDictionary = this.phraseSource;
    this.projectService.project.voicePreset = this.presetSource;
    this.projectService.project.settings = this.settingSource;
    this.projectService.project.fileLinks = this.linkSource;
  }


  saveProject(){
    const json = JSON.stringify(this.projectService.project, undefined, 2);
    this.download.downloadText(json, 'プロジェクト', true, '.voisproj');
  }



  // ファイルを削除
  onDeleteConfirm(event, type:string): void {
    if (window.confirm('「' + event.data.name + '」を削除しますか？')) {
      event.confirm.resolve(event.data);
    } else {
      event.confirm.reject(event.data);
    }
    setTimeout(() => {
      switch(type){
        case 'script':
          this.scriptSource = event.source.data;
          break;
        case 'character':
          this.characterSource = event.source.data;
          break;
        case 'phrase':
          this.phraseSource = event.source.data;
          break;
        case 'preset':
          this.presetSource = event.source.data;
          break;
        case 'setting':
          this.settingSource = event.source.data;
          break;
        case 'link':
          this.linkSource = event.source.data;
          break;
      }
      this.refreshTable();
    }, 10);
  }


  scriptSource : FileInfo[] = []
  characterSource : FileInfo[] = []
  phraseSource : FileInfo[] = []
  presetSource : FileInfo[] = []
  settingSource : FileInfo[] = []
  linkSource : FileInfo[] = []


  scriptSettings = {
    pager: {
      perPage: 5,
    },
    actions:{
      add: false,
      edit:false,
      position:'right',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: '台本ファイル (.vois)',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      open: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          return this.sanitizer.bypassSecurityTrustHtml(
            "<svg class='myIconHover' style='cursor: pointer; width:32px; height:32px;' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><title>ionicons-v5-k</title><path d='M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><polyline points='336 64 448 64 448 176' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><line x1='224' y1='288' x2='440' y2='72' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/></svg>"
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
      download: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          const id = 'scriptDownload';
          setTimeout(() => {
            const element = document.getElementById(id);
            if(element){
              element.addEventListener('click', (e) => {
                this.download.downloadText( this.projectService.project.scripts[0].content,
                  this.projectService.project.scripts[0].name, false, '');
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<svg id="' + id  + '" class="myIconHover" style="cursor: pointer; width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="download"><rect width="24" height="24" opacity="0"/><rect x="4" y="18" width="16" height="2" rx="1" ry="1"/><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"/><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"/><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"/><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/></g></g></svg>'
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
    },
  };


  characterSettings = {
    pager: {
      perPage: 5,
    },
    actions:{
      add: false,
      edit:false,
      position:'right',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'キャラクター情報 (.vcha)',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      download: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          const id = 'charactorDownload';
          setTimeout(() => {
            const element = document.getElementById(id);
            if(element){
              element.addEventListener('click', (e) => {
                this.download.downloadFile( this.projectService.project.characters[0]);
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<svg id="' + id + '" class="myIconHover" style="cursor: pointer; width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="download"><rect width="24" height="24" opacity="0"/><rect x="4" y="18" width="16" height="2" rx="1" ry="1"/><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"/><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"/><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"/><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/></g></g></svg>'
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
    },
  };


  phraseSettings = {
    pager: {
      perPage: 5,
    },
    actions:{
      add: false,
      edit:false,
      position:'right',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'フレーズ辞書 (.pdic)',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      open: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          return this.sanitizer.bypassSecurityTrustHtml(
            "<svg class='myIconHover' style='cursor: pointer; width:32px; height:32px;' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><title>ionicons-v5-k</title><path d='M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><polyline points='336 64 448 64 448 176' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><line x1='224' y1='288' x2='440' y2='72' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/></svg>"
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
      download: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          const id = 'phraseDownload';
          setTimeout(() => {
            const element = document.getElementById(id);
            if(element){
              element.addEventListener('click', (e) => {
                this.download.downloadFile(this.projectService.project.phraseDictionary[0]);
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<svg id="' + id  + '" class="myIconHover" style="cursor: pointer; width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="download"><rect width="24" height="24" opacity="0"/><rect x="4" y="18" width="16" height="2" rx="1" ry="1"/><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"/><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"/><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"/><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/></g></g></svg>'
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
    },
  };


  presetSettings = {
    pager: {
      perPage: 5,
    },
    actions:{
      add: false,
      edit:false,
      position:'right',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'ボイスプリセット (.vpc)',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      download: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          const id = 'presetDownload';
          setTimeout(() => {
            const element = document.getElementById(id);
            if(element){
              element.addEventListener('click', (e) => {
                this.download.downloadText( this.projectService.project.voicePreset[0].content,
                  this.projectService.project.voicePreset[0].name, false, '');
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<svg id="' + id  + '" class="myIconHover" style="cursor: pointer; width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="download"><rect width="24" height="24" opacity="0"/><rect x="4" y="18" width="16" height="2" rx="1" ry="1"/><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"/><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"/><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"/><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/></g></g></svg>'
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
    },
  };


  settingSettings = {
    pager: {
      perPage: 5,
    },
    actions:{
      add: false,
      edit:false,
      position:'right',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: '設定ファイル (.settings)',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      download: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          const id = 'settingDownload';
          setTimeout(() => {
            const element = document.getElementById(id);
            if(element){
              element.addEventListener('click', (e) => {
                this.download.downloadText( this.projectService.project.settings[0].content,
                  this.projectService.project.settings[0].name, false, '');
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            '<svg id="' + id  + '" class="myIconHover" style="cursor: pointer; width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="download"><rect width="24" height="24" opacity="0"/><rect x="4" y="18" width="16" height="2" rx="1" ry="1"/><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"/><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"/><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"/><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/></g></g></svg>'
            );
        },
        filter: false,
        sort: false,
        editable: false,
        width: '50px',
      },
    },
  };


  linkSettings = {
    pager: {
      perPage: 5,
    },
    actions:{
      add: false,
      position:'right',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: '添付ファイル　.vshpファイルなどのファイルをリンクすることができます',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      content: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value, value2, value3) => {
          return this.sanitizer.bypassSecurityTrustHtml(
            '<a href="' + value + '"><svg class="myIconHover" style="cursor: pointer; width:32px; height:32px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="download"><rect width="24" height="24" opacity="0"/><rect x="4" y="18" width="16" height="2" rx="1" ry="1"/><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"/><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"/><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"/><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"/></g></g></svg></a>'
            );
        },
        filter: false,
        sort: false,
        //editable: false,
        width: '50px',
      },
    },
  };





}
