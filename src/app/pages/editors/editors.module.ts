import { NgModule } from '@angular/core';
import { NbToggleModule, NbSelectModule, NbIconModule } from '@nebular/theme';
import {
  NbButtonModule,
  NbCardModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { EditorsRoutingModule, routedComponents } from './editors-routing.module';
import { VoiceroidEditiorComponent } from './voiceroid-editor/voiceroid-editor.component';
import { FormsModule } from '@angular/forms';
import { SandboxComponent } from './sandbox/sandbox.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ScriptProjectComponent } from './script-project/script-project.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    EditorsRoutingModule,
    NbButtonModule,
    NbToggleModule,
    NbIconModule,
    FormsModule,
    NbSelectModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...routedComponents,
    VoiceroidEditiorComponent,
    SandboxComponent,
    ScriptProjectComponent,
  ],
})
export class EditorsModule { }
