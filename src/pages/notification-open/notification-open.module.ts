import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationOpenPage } from './notification-open';

@NgModule({
  declarations: [
    NotificationOpenPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationOpenPage),
  ],
})
export class NotificationOpenPageModule {}
