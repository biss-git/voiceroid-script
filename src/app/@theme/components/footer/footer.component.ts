import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b><a href="https://biss-git.github.io/Portfolio/" target="_blank">ビス</a></b> 2020
    </span>
    <div class="socials">
      <a href="https://github.com/biss-git" target="_blank" class="ion ion-social-github"></a>
      <a href="https://twitter.com/bisu_2525" target="_blank" class="ion ion-social-twitter"></a>
    </div>
  `,
})
export class FooterComponent {
}
