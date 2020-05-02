import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartsComponent } from './charts.component';
import { PhraseDictionaryComponent } from './phrase-dictionary/phrase-dictionary.component';

const routes: Routes = [{
  path: '',
  component: ChartsComponent,
  children: [{
    path: 'PhraseDictionary',
    component: PhraseDictionaryComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule { }

export const routedComponents = [
  ChartsComponent,
];
