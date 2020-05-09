import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  NbAccordionModule,
  NbCardModule,
  NbSelectModule,
  NbListModule,
  NbButtonModule,
  NbToggleModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ChartsRoutingModule, routedComponents } from './charts-routing.module';
import { PhraseDictionaryComponent } from './phrase-dictionary/phrase-dictionary.component';
import { PhraseGraphComponent } from './phrase-dictionary/phrase-graph/phrase-graph.component';

import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [
  PhraseDictionaryComponent,
  PhraseGraphComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    ChartsRoutingModule,
    NgxChartsModule,
    NbCardModule,
    NbAccordionModule,
    NbSelectModule,
    NbListModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbToggleModule,
    Ng2SmartTableModule,
    ],
  declarations: [
    ...routedComponents,
    ...components,
    PhraseDictionaryComponent,
    PhraseGraphComponent,
  ],

})
export class ChartsModule {}
