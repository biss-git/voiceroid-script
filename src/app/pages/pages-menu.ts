import { NbMenuItem } from '@nebular/theme';
import { environment } from '../../environments/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: '台本編集',
    icon: 'text-outline',
    link: '/pages/editors/voiceroid-editor',
  },
  {
    title: 'フレーズ辞書',
    icon: 'pie-chart-outline',
    link: '/pages/charts/PhraseDictionary',
    home: true,
  },
  {
    title: 'サンドボックス',
    icon: 'pie-chart-outline',
    link: '/pages/editors/sandbox',
    home: true,
    hidden: environment.sandboxHidden,
  },

  /*
  {
    title: 'Miscellaneous',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
  */
];
