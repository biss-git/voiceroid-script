import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../@core/mock/users.service';
import { environment } from '../../environments/environment';
import { FileInfo, GoogleFileInfo, PermissionInfo, UserInfo } from '../@core/data/file-info';
import { Subject } from 'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {

  constructor(private http: HttpClient,
              private userService: UserService) {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: environment.googleAPIclientID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.file',
      }).then( () => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen((s) => this.updateSigninStatus(s));

        // Handle the initial sign-in state.
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      }, (error) => {
        console.log(error);
      });
    });
  }

  private token: GoogleApiOAuth2TokenObject;
  private rootId: string = '';
  private projectsId: string = '';
  private linkFilesId: string = '';

  user: UserInfo = {displayName: '', emailAddress: '', photoLink: '' } as UserInfo;
  currentProject: GoogleFileInfo = undefined;

  projectExist(): boolean{
    if (this.currentProject && this.currentProject.id != ''){
      return true;
    }
    return false;
  }

  isMyDriveProject(): boolean{
    return this.currentProject.ownedByMe;
    /*
    let isMine = false;
    if (this.currentProject && this.currentProject.permissions && this.user && this.user.me){
      this.currentProject.permissions.forEach( p => {
        if (p.id == this.user.permissionId){
          isMine = true;
        }
      });
    }
    return isMine;
    */
  }

  getProjectName(): string{
    if (this.currentProject){
      return this.currentProject.name;
    }
    return '';
  }

  isShared(): boolean{
    let isShare = false;
    if (this.currentProject && this.currentProject.permissions){
      this.currentProject.permissions.forEach( p => {
        if (p.type == 'anyone'){
          isShare = true;
        }
      });
    }
    return isShare;
  }

  shareLink(): string{
    if (this.isShared()){
      return environment.ownAddress + 'pages/editors/script-project?id=' + this.currentProject.id;
    }
    return '';
  }

  clearCurrentProject(): void{
    this.currentProject = undefined;
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  updateSigninStatus(isSignedIn: boolean): void {
    if (isSignedIn) {
      this.token = gapi.client.getToken();
      this.getUserInfo();
      this.checkRootFolder();
    } else {
      this.token = null;
      this.userService.resetUser();
    }
  }

  // ユーザー情報の取得
  private async getUserInfo(): Promise<void> {
    const params = {
      fields: 'user',
    };
    const url = 'https://www.googleapis.com/drive/v3/about';
    await this.http.get(url, {'headers': this.getHeader(), params}).toPromise().then((data) => {
      this.user = data['user'];
      this.userService.changeUser(this.user);
    })
    .catch(error => console.log('ユーザー情報の取得に失敗しました'));
  }

  // httpヘッダ
  private getHeader(): HttpHeaders{
    return new HttpHeaders({
      Authorization: 'Bearer ' + (this.token ? this.token.access_token : ''),
    });
  }

  // ログイン
  signIn(){
    gapi.auth2.getAuthInstance().signIn();
  }

   // ログアウト
  signOut(){
    gapi.auth2.getAuthInstance().signOut();
  }

  userExists(): boolean{
    return this.token != null;
  }

  // Voiceroid Script フォルダの検索 / 作成
  async checkRootFolder(): Promise<void>{
    if (!this.userExists){return; }
    const params = {
      q: 'name = \'Voiceroid Script\' and mimeType = \'application/vnd.google-apps.folder\' and trashed = false and \'me\' in owners',
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    await this.http.get(url , {'headers': this.getHeader(), params}).toPromise().then(async (data) => {
      const files = data['files'];
      if ( files && files.length > 0){
        this.rootId = files[0].id;
      }
      else{
        this.rootId = '';
        await this.makeRootFolder();
      }
      if (this.rootId == ''){
      }
    })
    .catch(error => console.log('Voiceroid Script フォルダの検索に失敗しました'));
  }

  // Voiceroid Script フォルダの作成
  private async makeRootFolder(): Promise<void>{
    if (!this.userExists){return; }
    const body = {
      description: 'Main Folder for Voiceroid Script',
      mimeType: 'application/vnd.google-apps.folder',
      name: 'Voiceroid Script',
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    this.http.post(url , body, {'headers': this.getHeader()}).toPromise().then((data) => {
      this.rootId = data['id'];
    })
    .catch(error => console.log('Voiceroid Script フォルダの作成に失敗しました'));
  }

  // Projectsフォルダの検索 / 作成
  async checkProjectsFolder(): Promise<void>{
    if (!this.userExists){return; }
    if (this.rootId == ''){
      await this.checkRootFolder();
    }
    const params = {
      q: 'name = \'Projects\' and mimeType = \'application/vnd.google-apps.folder\' and trashed = false and \'' + this.rootId + '\' in parents',
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    await this.http.get(url , {'headers': this.getHeader(), params}).toPromise().then(async(data) => {
      const files = data['files'];
      if ( files && files.length > 0){
        this.projectsId = files[0].id;
      }
      else{
        this.projectsId = '';
        await this.makeProjectsFolder();
      }
    })
    .catch(error => console.log('Projects フォルダの検索に失敗しました'));
  }

  // Projectsフォルダの作成
  private async makeProjectsFolder(): Promise<void>{
    if (!this.userExists){return; }
    if (this.rootId == ''){
      await this.checkRootFolder();
    }
    const body = {
      description: 'Projects Folder for Voiceroid Script',
      mimeType: 'application/vnd.google-apps.folder',
      name: 'Projects',
      parents: [this.rootId],
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    await this.http.post(url , body, {'headers': this.getHeader()}).toPromise().then((data) => {
      this.projectsId = data['id'];
    })
    .catch(error => console.log('Projects フォルダの作成に失敗しました'));
  }

  // プロジェクトの作成
  async makeNewProject(file: FileInfo): Promise<void>{
    if (!this.userExists){return; }
    if (this.projectsId == ''){
      await this.checkProjectsFolder();
    }
    const body = {
      description: 'Project File of Voiceroid Script',
      mimeType: 'application/json',
      name: file.name,
      parents: [this.projectsId],
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    await this.http.post(url , body, {'headers': this.getHeader()}).toPromise().then(async (data) => {
      await this.updateCurrentProject(file, data['id']);
    })
    .catch(error => alert('プロジェクトの作成に失敗しました'));
  }

  // 現在のプロジェクトを更新
  async updateCurrentProject(file: FileInfo, id: string = ''): Promise<void>{
    if (!this.userExists){return; }
    if (id == ''){id = this.currentProject.id; }
    if (id == ''){return; }
    const params = {
      uploadType: 'media',
    };
    const url = 'https://www.googleapis.com/upload/drive/v3/files/' + id;
    await this.http.patch(url , file.content, {'headers': this.getHeader(), params}).toPromise().then((data) => {
      const newFile: GoogleFileInfo = {
        id: id,
        name: file.name,
        extension: file.extension,
        content: file.content,
        ownedByMe: true,
        permissions: undefined,
      };
      this.currentProject = newFile;
    })
    .catch(error => alert('プロジェクトの更新に失敗しました'));
    await this.getPermission();
  }

  // プロジェクトの一覧を取得
  async getProjectList(): Promise<GoogleFileInfo[]>{
    if (!this.userExists){return; }
    if (this.projectsId == ''){
      await this.checkProjectsFolder();
    }
    const newProjectList: GoogleFileInfo[] = [];
    const params = {
      q: 'name contains \'.voisproj\' and mimeType = \'application/json\' and trashed = false and \'' + this.projectsId + '\' in parents',
      pageSize: '1000',
      fields: 'files(name, id, modifiedTime, shared)',
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    await this.http.get(url , {'headers': this.getHeader(), params}).toPromise().then((data) => {
      const files = data['files'];
      if ( files && files.length > 0){
        files.forEach(f => {
          newProjectList.push({
            id: f.id,
            name: f.name,
            extension: '.voisproj',
            content: '',
            ownedByMe: true,
            permissions: undefined,
            modifiedTime: f.modifiedTime.slice(0, 10),
            shared: f.shared ? '公開' : '非公開',
          });
        });
      }
    })
    .catch(error => alert('プロジェクト一覧の取得に失敗しました'));
    return newProjectList;
  }

  // プロジェクトを取得
  async getProject(id: string): Promise<GoogleFileInfo>{
    if (!this.userExists){return; }
    const newProject: GoogleFileInfo = {id: id, name: '', extension: '', content: '', ownedByMe: undefined, permissions: undefined};
    const params = {
      fields: 'kind, name, mimeType, description, ownedByMe',
    };
    const url = 'https://www.googleapis.com/drive/v3/files/' + id;
    await this.http.get(url , {'headers': this.getHeader(), params}).toPromise().then(async(data) => {
      if (data['mimeType'] != 'application/json'){return; }
      newProject.name = data['name'];
      newProject.ownedByMe = data['ownedByMe'];
      newProject.extension = '.voisproj'; // 要確認
      const responseType = 'json';  // 普通はjson
      const params = {
        alt: 'media',
      };
      const url = 'https://www.googleapis.com/drive/v3/files/' + id;
      await this.http.get(url , {'headers': this.getHeader(), responseType, params}).toPromise().then((data) => {
        newProject.content = data;
      })
      .catch(error => alert('プロジェクトデータの取得に失敗しました'));
    })
    .catch(error => alert('プロジェクト情報の取得に失敗しました'));
    this.currentProject = newProject;
    await this.getPermission();
    return newProject;
  }

  // 現在のプロジェクトの権限リストを取得
  async getPermission(): Promise<void>{
    if (!this.userExists){return; }
    if (this.currentProject == null || this.currentProject.id == '' || this.currentProject.ownedByMe != true){return; }
    const params = {
      fields: 'permissions',
    };
    const url = 'https://www.googleapis.com/drive/v3/files/' + this.currentProject.id + '/permissions';
    await this.http.get(url , {'headers': this.getHeader(), params}).toPromise().then((data) => {
      const dataList = data['permissions'];
      const permissions: PermissionInfo[] = [];
      dataList.forEach(permission => {
        permissions.push({
          id: permission.id,  // anyoneWithLink
          type: permission.type,  // anyone
          role: permission.role,  // reader
          //targetId: this.currentProject.id,
        });
      });
      this.currentProject.permissions = permissions;
    })
    .catch(error => alert('公開情報の取得に失敗しました' + error));
  }

  // プロジェクトの公開
  async makeReleasePermission(): Promise<void>{
    if (!this.userExists){return; }
    if (!this.currentProject || this.currentProject.id == ''){return; }
    if (this.currentProject.permissions == null){
      await this.getPermission();
    }
    this.currentProject.permissions.forEach( p => {
      if (p.type == 'anyone'){return; }
    });
    const body = {
      role: 'reader',
      type: 'anyone',
    };
    const url = 'https://www.googleapis.com/drive/v3/files/' + this.currentProject.id + '/permissions';
    await this.http.post(url, body, {'headers': this.getHeader()}).toPromise().then((data) => {
    })
    .catch(error => alert('プロジェクトの公開に失敗しました'));
    await this.getPermission();
  }

  // プロジェクトの非公開
  async deleteReleasePermission(): Promise<void>{
    if (!this.userExists){return; }
    if (!this.currentProject || this.currentProject.id == ''){return; }
    if (this.currentProject.permissions == null){
      await this.getPermission();
    }
    for (let i = 0; i < this.currentProject.permissions.length; i++){
      const p = this.currentProject.permissions[i];
      if (p.type == 'anyone'){
        const url = 'https://www.googleapis.com/drive/v3/files/' + this.currentProject.id + '/permissions/' + p.id;
        await this.http.delete(url, {'headers': this.getHeader()}).toPromise().then((data) => {
        })
        .catch(error => alert('プロジェクトの非公開に失敗しました'));
      }
    }
    await this.getPermission();
  }



  // Link Filesフォルダの検索 / 作成
  async checkLinkFilesFolder(): Promise<void>{
    if (!this.userExists){return; }
    if (this.rootId == ''){
      await this.checkRootFolder();
    }
    const params = {
      q: 'name = \'Link Files\' and mimeType = \'application/vnd.google-apps.folder\' and trashed = false and \'' + this.rootId + '\' in parents',
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    await this.http.get(url , {'headers': this.getHeader(), params}).toPromise().then(async (data) => {
      const files = data['files'];
      if ( files && files.length > 0){
        this.linkFilesId = files[0].id;
      }
      else{
        this.linkFilesId = '';
        await this.makeLinkFilesFolder();
      }
    })
    .catch(error => console.log('Link Files フォルダの検索に失敗しました'));
  }

  // Link Filesフォルダの作成
  private async makeLinkFilesFolder(): Promise<void>{
    if (!this.userExists){return; }
    if (this.rootId == ''){
      await this.checkRootFolder();
    }
    const body = {
      description: 'Link Files Folder for Voiceroid Script',
      mimeType: 'application/vnd.google-apps.folder',
      name: 'Link Files',
      parents: [this.rootId],
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    await this.http.post(url , body, {'headers': this.getHeader()}).toPromise().then((data) => {
      this.linkFilesId = data['id'];
    })
    .catch(error => console.log('Link Files フォルダの作成に失敗しました'));
  }


  // ファイルの作成
  async makeNewLinkFile(file: FileInfo): Promise<void>{
    if (!this.userExists){return; }
    if (this.linkFilesId == ''){
      await this.checkLinkFilesFolder();
    }
    const body = {
      description: 'Link File of Voiceroid Script',
      //mimeType: "text/plain",
      name: file.name,
      parents: [this.linkFilesId],
    };
    const url = 'https://www.googleapis.com/drive/v3/files';
    return await this.http.post(url , body, {'headers': this.getHeader()}).toPromise().then(async (data) => {
      await this.updateLinkFiles(file, data['id']);
      await this.makeLinkFilesPermission(data['id']);
      file.content = 'https://drive.google.com/uc?id=' + data['id'];
    })
    .catch(error => alert('ファイルのアップロードに失敗しました'));
  }

  // 現在のファイルを更新
  private async updateLinkFiles(file: FileInfo, id: string): Promise<void>{
    if (!this.userExists){return; }
    const params = {
      uploadType: 'media',
    };
    const url = 'https://www.googleapis.com/upload/drive/v3/files/' + id;
    await this.http.patch(url , file.content, {'headers': this.getHeader(), params}).toPromise().then((data) => {
    })
    .catch(error => alert('ファイルの更新に失敗しました'));
  }

  // ファイルの公開
  private async makeLinkFilesPermission(id: string): Promise<void>{
    if (!this.userExists){return; }
    const body = {
      role: 'reader',
      type: 'anyone',
    };
    const url = 'https://www.googleapis.com/drive/v3/files/' + id + '/permissions';
    await this.http.post(url, body, {'headers': this.getHeader()}).toPromise().then((data) => {
    })
    .catch(error => alert('ファイルの公開に失敗しました'));
  }


}
