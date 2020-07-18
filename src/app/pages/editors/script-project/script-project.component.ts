import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileInfo, GoogleFileInfo } from '../../../@core/data/file-info';
import { DownloadService } from '../../../service/download.service';
import { GoogleApiService } from '../../../service/google-api.service';
import { UserService } from '../../../@core/mock/users.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscriber, Subscription } from 'rxjs';
import { NbDialogService, NbToastrService, NbComponentStatus, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ScriptProjectService } from '../../../service/script-project.service';

@Component({
  selector: 'ngx-script-project',
  templateUrl: './script-project.component.html',
  styleUrls: ['./script-project.component.scss']
})
export class ScriptProjectComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  driveProjectList: GoogleFileInfo[] = [];


  isBusy: boolean = false;

  /**
   * ログインしているかどうか
   */
  userExists: boolean = false;
  /**
   * ドライブプロジェクトを扱っている
   */
  driveProject: boolean = true;
  /**
   * 自分のドライブプロジェクトを扱っている
   */
  myDriveProject: boolean = true;
  /**
   * 今読み込まれているプロジェクトの名前
   */
  projectName: string = '';
  /**
   * 公開されているかどうか
   */
  share: boolean = true;
  /**
   * プロジェクトの公開リンク
   */
  projectShareLink: string = '';

  queryId: string = ''
  downloadLink: string = '';


  querySubscription: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private download: DownloadService,
    private googleAPI: GoogleApiService,
    private dialogService: NbDialogService,
    private userService: UserService,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private projectService: ScriptProjectService,
    private router: Router) { }

  ngOnInit() {
    this.scriptSource = this.projectService.project.scripts;
    this.characterSource = this.projectService.project.characters;
    this.phraseSource = this.projectService.project.phraseDictionary;
    this.presetSource = this.projectService.project.voicePreset;
    this.settingSource = this.projectService.project.settings;
    this.linkSource = this.projectService.project.fileLinks;

    this.userService.userChange.pipe(takeUntil(this.destroy$)).subscribe((user: any) => {
      this.refreshState();
      if(this.queryId && this.userExists){
        this.openDriveProject(this.queryId);
        this.queryId = '';
        this.downloadLink = '';
      }
    });
    this.refreshState();

    this.querySubscription = this.activatedRoute.queryParams.subscribe(
      params => {
        if(params.id){
          this.queryId = params.id;
          this.downloadLink = 'https://drive.google.com/uc?id=' + this.queryId;
        }
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.querySubscription.unsubscribe;
  }

  refreshState(){
    this.isBusy = false;
    this.userExists = this.googleAPI.userExists();
    this.driveProject = this.googleAPI.projectExist();
    this.myDriveProject = this.googleAPI.isMyDriveProject();
    this.projectName = this.googleAPI.getProjectName();
    this.share = this.googleAPI.isShared();
    this.projectShareLink = this.googleAPI.shareLink();
  }


  /**
   * ファイルの読み込み
   * @param files
   */
  async onFileLoad(files:FileInfo[]){
    let count = 0;
    files.forEach(file => {
      if(file.extension == '.vois'){
        this.scriptSource.push(file);
        this.showToast('success',file.name ,'');
      }
      else if(file.extension == '.vcha'){
        this.characterSource = [file];
        this.showToast('success',file.name ,'');
      }
      else if(file.extension == '.pdic'){
        this.phraseSource = [file];
        this.showToast('success',file.name ,'');
      }
      else if(file.extension == '.vpc'){
        this.presetSource = [file];
        this.showToast('success',file.name ,'');
      }
      else if(file.extension == '.settings'){
        this.settingSource = [file];
        this.showToast('success',file.name ,'');
      }
      else{
        count += 1;
        if(files.length > 1){
          this.showToast('warning',file.name ,'拡張子が対応していません。');
        }
      }
    });
    if(files.length == 1 && count == 1){
      // 読み込んだファイル数が１つの時だけプロジェクトやその他ファイルを読み込む
      if(files[0].extension == '.voisproj'){
        this.loadProject(files[0])
      }
      else {
        if(!this.googleAPI.userExists()){
          alert('添付ファイルをアップロードするにはGoogleアカウントでログインしてください');
          return;
        }
        if (window.confirm('「' + files[0].name + '」をGoogle Drive にアップロードして公開しますか？')) {
          await this.googleAPI.makeNewLinkFile(files[0])
          this.linkSource.push(files[0]);
          this.showToast('success','アップロードされました' ,'');
        } else {
          return;
        }
      }
    }

    this.refreshTable();
  }

  /**
   * Googleドライブからファイルを読み込んでダイアログを表示
   * @param dialog
   */
  async openDriveProjects(dialog: TemplateRef<any>): Promise<void> {
    if(this.isBusy){return;}
    this.isBusy = true;
    this.driveProjectList = await this.googleAPI.getProjectList();
    this.dialogService.open(dialog);
    this.refreshState();
  }

  /**
   * ドライブプロジェクトの読み込み
   * @param file
   */
  async openDriveProject(id: string): Promise<void>{
    if(id){
      const file = await this.googleAPI.getProject(id);
      this.loadProject(file);
    }
    this.refreshTable();
    this.refreshState();
  }

  /**
   * プロジェクトを読み込む
   * @param file
   */
  loadProject(file: FileInfo): void{
    if(file && file.extension == '.voisproj'){
      let project: any;
      if(typeof(file.content) == 'string'){
        project = JSON.parse(file.content);
      }
      else{
        project = file.content;
      }
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
      this.showToast('success','プロジェクトを読み込みました。' ,'');
    }
  }


  refreshTable(){
    this.scriptSource = this.scriptSource.concat();
    //this.characterSource = [].concat(this.characterSource);
    //this.phraseSource = [].concat(this.phraseSource);
    //this.presetSource = [].concat(this.presetSource);
    //this.settingSource = [].concat(this.settingSource);
    this.linkSource = this.linkSource.concat();
    this.projectService.project.scripts = this.scriptSource;
    this.projectService.project.characters = this.characterSource;
    this.projectService.project.phraseDictionary = this.phraseSource;
    this.projectService.project.voicePreset = this.presetSource;
    this.projectService.project.settings = this.settingSource;
    this.projectService.project.fileLinks = this.linkSource;
  }


  clearProject(){
    if (window.confirm('調整データを全て削除します。よろしいですか？')) {
      this.scriptSource = [];
      this.characterSource = [];
      this.phraseSource = [];
      this.presetSource = [];
      this.settingSource = [];
      this.linkSource = [];
      this.projectService.clearProject();
      this.googleAPI.clearCurrentProject();
      this.refreshState();
      this.refreshTable();
      this.showToast('success','プロジェクトが削除されました' ,'');
    }
  }


  /**
   * ローカルファイルに保存
   */
  saveProject(){
    const json = JSON.stringify(this.projectService.project, undefined, 2);
    this.download.downloadText(json, 'プロジェクト', true, '.voisproj');
  }



  /**
   * ゴミ箱ボタンでファイルを削除
   * @param event
   * @param type
   */
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
      this.showToast('danger',event.data.name + ' が削除されました' ,'');
      this.refreshTable();
    }, 10);
  }


  /**
   * ドライブプロジェクトを新規で作成
   */
  async makeDriveProject(): Promise<void>{
    const name = prompt('プロジェクト名を入力してください', '');
    if(name){
      if(this.isBusy){return;}
      this.isBusy = true;
      const file = {
        name: name + '.voisproj',
        extension: '.voisproj',
        content: this.projectService.project
      } as FileInfo;
      await this.googleAPI.makeNewProject(file);
      this.showToast('primary','プロジェクトの作成が終わりました' ,'');
    }
    this.refreshState();
  }

  /**
   * ドライブプロジェクトを更新
   */
  async updateDriveProject(): Promise<void>{
    if (window.confirm('「' + this.projectName + '」を保存しますか？　googleドライブの内容が上書きされます。')) {
      if(this.isBusy){return;}
      this.isBusy = true;
      this.googleAPI.currentProject.content = this.projectService.project;
      await this.googleAPI.updateCurrentProject(this.googleAPI.currentProject);
      this.showToast('primary','プロジェクトの保存が終わりました' ,'');
    }
    this.refreshState();
  }

  async releaseDriveProject(): Promise<void>{
    if(this.isBusy){return;}
    this.isBusy = true;
    await this.googleAPI.makeReleasePermission();
    this.showToast('primary','プロジェクトの公開処理が終わりました' ,'');
    this.refreshState();
  }

  async unreleaseDriveProject(): Promise<void>{
    if(this.isBusy){return;}
    this.isBusy = true;
    await this.googleAPI.deleteReleasePermission();
    this.showToast('primary','プロジェクトの比公開処理が終わりました' ,'');
    this.refreshState();
  }



  copyShareLink(){
    if (navigator.clipboard){
      navigator.clipboard.writeText(this.projectShareLink).then(
        () => {
          this.showToast('primary','クリップボードに共有リンクがコピーされました','');
        },
        () => {/* 失敗 */},
      );

    }
  }



  private showToast(type: NbComponentStatus, title: string, body: string, ms:number = 1500) {

    const config = {
      status: type,
      destroyByClick: true,
      duration: ms,
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
        title: '・台本ファイル (.vois)',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      open: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2,value3) => {
          const number = value3.dataSet.data.indexOf(value2);
          const id = 'scriptOpen' + number;
          setTimeout(() => {
            const element = document.getElementById(id);
            if(element){
              element.addEventListener('click', (e) => {
                this.router.navigate(['pages/editors/voiceroid-editor', {number: number}]);
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            "<svg id='" + id  + "' class='myIconHover' style='cursor: pointer; width:32px; height:32px;' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><title>ionicons-v5-k</title><path d='M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><polyline points='336 64 448 64 448 176' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><line x1='224' y1='288' x2='440' y2='72' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/></svg>"
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
        title: '・キャラクター情報 (.vcha)',
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
        title: '・フレーズ辞書 (.pdic)',
        type: 'string',
        filter: false,
        sort: false,
        width: '100%',
      },
      open: {
        title: '',
        type: 'html',
        valuePrepareFunction: (value,value2) => {
          const id = 'pharaseOpen';
          setTimeout(() => {
            const element = document.getElementById(id);
            if(element){
              element.addEventListener('click', (e) => {
                this.router.navigate(['pages/charts/PhraseDictionary', {number: 0}]);
              });
            }
          }, 30);
          return this.sanitizer.bypassSecurityTrustHtml(
            "<svg id='" + id  + "' class='myIconHover' style='cursor: pointer; width:32px; height:32px;' xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><title>ionicons-v5-k</title><path d='M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><polyline points='336 64 448 64 448 176' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/><line x1='224' y1='288' x2='440' y2='72' style='fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'/></svg>"
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
        title: '・ボイスプリセット (.vpc)',
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
        title: '・設定ファイル (.settings)',
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
      edit: false,
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
        title: '・添付ファイル　.vshpファイルなどのファイルをリンクすることができます',
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
