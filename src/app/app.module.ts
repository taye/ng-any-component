import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent, BorderComponent } from './app.component';
import { AnyComponentModule } from '../module';

@NgModule({
  declarations: [
    AppComponent,
    BorderComponent,
  ],
  imports: [
    BrowserModule,
    AnyComponentModule,
  ],
  providers: [],
  entryComponents: [
    BorderComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
