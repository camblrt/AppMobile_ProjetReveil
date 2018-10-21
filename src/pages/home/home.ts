import { ClockListPage } from './../clock-list/clock-list';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { ListUsersPage } from '../list-users/list-users';
import { RegisterPage } from '../register/register';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  current_user: string;
  constructor(public navCtrl: NavController,
    public databaseUser: DatabaseProvider,
    private storage: Storage) {

    this.getCurrentUserFromStorage();

  }

  displayClockOfCurrentUser() {
    this.navCtrl.push(ClockListPage);
  }

  userList() {
    this.navCtrl.push(ListUsersPage);
  }

  ionViewWillEnter() {
    return this.getCurrentUserFromStorage();
  }

  getCurrentUserFromStorage() {
    this.storage.get('current_username')
      .then((current_user_storage) => {
        this.current_user = current_user_storage;
        if (this.current_user == null) {
          this.navCtrl.push(RegisterPage);
        }
      })
      .catch(error => {
        console.log("Error from getCurrentUserFromStorage() : " + error.message);
      });
  }
}


