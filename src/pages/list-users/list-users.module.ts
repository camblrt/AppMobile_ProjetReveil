import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListUsersPage } from './list-users';

@NgModule({
  declarations: [
    ListUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(ListUsersPage),
  ],
})
export class ListUsersPageModule {}
