import { NgModule } from '@angular/core';

import { AnyComponent } from './any.component';
import { AnyContentDirective } from './any-content.directive';

@NgModule({
  declarations: [
    AnyComponent,
    AnyContentDirective,
  ],
  exports: [
    AnyComponent,
    AnyContentDirective,
  ],
})
export class AnyComponentModule { }
