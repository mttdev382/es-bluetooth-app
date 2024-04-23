import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { BatteryLevelComponent } from './components/battery-level/battery-level.component';

@NgModule({
  declarations: [
    AppComponent,
    BatteryLevelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebBluetoothModule.forRoot({
      enableTracing: true // or false, this will enable logs in the browser's console
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
