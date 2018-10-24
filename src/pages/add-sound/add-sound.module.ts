import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSoundPage } from './add-sound';

@NgModule({
  declarations: [
    AddSoundPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSoundPage),
  ],
})
export class AddSoundPageModule {}
