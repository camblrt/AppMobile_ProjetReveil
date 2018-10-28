import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { RegisterPage } from '../register/register';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-list-users',
  templateUrl: 'list-users.html',
})
export class ListUsersPage {
  dataUsernameInDB = [];
  userNumber: Number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public databaseUser: DatabaseProvider,
    private storage: Storage) {

    this.getAllUsersFromDataBase();


  }

  getAllUsersFromDataBase() {
    var lengthDB;
    this.databaseUser.selectUserFromDataBase().then(data => {
      lengthDB = data.rows.length;
      for (var i = 0; i < lengthDB; i++) {
        this.dataUsernameInDB[i] = data.rows.item(i).login;
        this.userNumber = i;
      }
    })
      .catch(error => {
        console.log("Error from getAllUsersFromDataBase() : " + error.message);
      });
  }


  userSelected(user: string) {
    this.storage.set('current_username', user);
    this.databaseUser.selectClockForUserInDB(user).then(data => {
      let lengthDB = data.rows.length;
      for (var i = 0; i < lengthDB; i++) {
        let nameAlarm = data.rows.item(i).nom;
        let chosenHours = data.rows.item(i).heure;
        let chosenMinutes = data.rows.item(i).minute;
        let dayDB = data.rows.item(i).jour;
        this.storage.set('clock', [nameAlarm, chosenHours, chosenMinutes, dayDB]);
      }
    });
    this.navCtrl.setRoot(HomePage);
  }

  registerNewUser() {
    this.navCtrl.push(RegisterPage);
  }

}
