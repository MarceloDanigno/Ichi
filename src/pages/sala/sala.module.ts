import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalaPage } from './sala';

@NgModule({
  declarations: [
    SalaPage,
  ],
  imports: [
    IonicPageModule.forChild(SalaPage),
  ],
})
export class SalaPageModule {}
