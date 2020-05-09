import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorsComponent } from './editors.component';
import { VoiceroidEditiorComponent } from './voiceroid-editor/voiceroid-editor.component'
import { SandboxComponent } from './sandbox/sandbox.component';

const routes: Routes = [{
  path: '',
  component: EditorsComponent,
  children: [{
    path: 'voiceroid-editor',
    component: VoiceroidEditiorComponent,
  },{
    path: 'sandbox',
    component: SandboxComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorsRoutingModule { }

export const routedComponents = [
  EditorsComponent,
  SandboxComponent,
];
