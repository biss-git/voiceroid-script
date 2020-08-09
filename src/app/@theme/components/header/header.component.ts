import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '../../../@core/mock/users.service';
import { GoogleApiService } from '../../../service/google-api.service';
import { UserInfo } from '../../../@core/data/file-info';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: UserInfo;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [
    //{ title: 'プロフィール' },
    { title: 'ログイン' },
    { title: 'ログアウト' },
  ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private googleAPI: GoogleApiService) {
  }

  private userSubscription: Subscription;  // フレーズデータの変更を受け取るやつ

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: UserInfo) => {
        this.user = user;
      });

    this.userSubscription = this.userService.userChange.subscribe((user: any) => {
      this.user = user;
      if (this.googleAPI.userExists()){
        this.userMenu = [
          { title: 'ログアウト' },
        ];
      }else{
        this.userMenu = [
          { title: 'ログイン' },
        ];
      }
    });

    this.menuService.onItemClick()
    .pipe(
      map(({ item: { title } }) => title),
    )
    .subscribe(title => {
      if (title == 'ログイン'){
        this.googleAPI.signIn();
      }
      else if (title == 'ログアウト'){
        this.googleAPI.signOut();
      }
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSubscription.unsubscribe();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
