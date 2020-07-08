import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChatClientHub } from './chat.clienthub';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [ChatClientHub],
  bootstrap: [AppComponent]
})
export class AppModule { }
