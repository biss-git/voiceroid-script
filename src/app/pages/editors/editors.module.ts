import { NgModule } from '@angular/core';
import { NbToggleModule, NbSelectModule, NbIconModule, NbTooltipModule, NbDialogModule, NbAccordionModule } from '@nebular/theme';
import {
  NbButtonModule,
  NbCardModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { EditorsRoutingModule, routedComponents } from './editors-routing.module';
import { VoiceroidEditiorComponent } from './voiceroid-editor/voiceroid-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxComponent } from './sandbox/sandbox.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ScriptProjectComponent } from './script-project/script-project.component';
import { ImageSourceDialogComponent } from './voiceroid-editor/image-source-dialog/image-source-dialog.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    EditorsRoutingModule,
    NbDialogModule.forChild(),
    NbButtonModule,
    NbToggleModule,
    NbIconModule,
    NbAccordionModule,
    FormsModule,
    NbSelectModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ...routedComponents,
    VoiceroidEditiorComponent,
    SandboxComponent,
    ScriptProjectComponent,
    ImageSourceDialogComponent,
    HomeComponent,
  ],
  entryComponents: [
    ImageSourceDialogComponent,
  ],
})
export class EditorsModule { }
