import { NgModule } from '@angular/core';
import { NbToggleModule } from '@nebular/theme';
import {
  NbButtonModule,
  NbCardModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { EditorsRoutingModule, routedComponents } from './editors-routing.module';
import { VoiceroidEditiorComponent } from './voiceroid-editor/voiceroid-editor.component';
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
    VoiceroidEditiorComponent,
  ],
})
export class EditorsModule { }
