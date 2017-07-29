import { NgModule } from '@angular/core';

import { AnyComponent } from './any.component';

@NgModule({
  declarations: [
    AnyComponent,
  ],
  exports: [
    AnyComponent,
  ],
})
export class AnyComponentModule { }
