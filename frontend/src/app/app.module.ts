import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InferenceComponent } from './inference/inference.component';
import { HeaderComponent } from './header/header.component';
import { ImageChooserComponent } from './image-chooser/image-chooser.component';
import { FilesizePipe } from './filesize.pipe';

@NgModule({
  declarations: [
    AppComponent,
    InferenceComponent,
    HeaderComponent,
    ImageChooserComponent,
    FilesizePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
