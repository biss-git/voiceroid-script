import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorsComponent } from './editors.component';
import { EditorjsComponent } from './editorjs/editorjs.component';

const routes: Routes = [{
  path: '',
  component: EditorsComponent,
  children: [{
    path: 'editorjs',
    component: EditorjsComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorsRoutingModule { }

export const routedComponents = [
  EditorsComponent,
];
