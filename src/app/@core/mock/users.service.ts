import { of as observableOf,  Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserInfo } from '../data/file-info';

@Injectable()
export class UserService {

  private user: UserInfo = { displayName: 'ログイン', photoLink: 'assets/images/nick.png', emailAddress:'' };
  private currentUser: UserInfo;

  userChange = new Subject<UserInfo>();

  getUser(): Observable<UserInfo> {
    return observableOf(this.currentUser);
  }

  changeUser(user: UserInfo){
    this.currentUser = user;
    this.userChange.next(this.currentUser);
  }

  resetUser(){
    this.currentUser = this.user;
    this.userChange.next(this.currentUser);
  }

}
