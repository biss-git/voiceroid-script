import { NgModule } from '@angular/core';
import { NbMenuModule, NbIconModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    NbIconModule,
    NbCardModule,
  ],
  declarations: [
    PagesComponent,
    HomeComponent,
  ],
})
export class PagesModule {
}
