import { NgModule } from '@angular/core';
import { NbToggleModule } from '@nebular/theme';
import {
  NbButtonModule,
  NbCardModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { EditorsRoutingModule, routedComponents } from './editors-routing.module';
import { EditorjsComponent } from './editorjs/editorjs.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    EditorsRoutingModule,
    NbButtonModule,
    NbToggleModule,
    FormsModule,
  ],
  declarations: [
    ...routedComponents,
    EditorjsComponent,
  ],
})
export class EditorsModule { }
