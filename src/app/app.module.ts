import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent, BorderComponent, BackgroundComponent } from './app.component';
import { AnyComponentModule } from '../module';

@NgModule({
  declarations: [
    AppComponent,
    BorderComponent,
    BackgroundComponent,
  ],
  imports: [
    BrowserModule,
    AnyComponentModule,
  ],
  providers: [],
  entryComponents: [
    BorderComponent,
    BackgroundComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
