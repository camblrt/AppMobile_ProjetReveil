import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClockListPage } from './clock-list';

@NgModule({
  declarations: [
    ClockListPage,
  ],
  imports: [
    IonicPageModule.forChild(ClockListPage),
  ],
})
export class ClockListPageModule {}
