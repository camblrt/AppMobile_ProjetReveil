import { Component } from '@angular/core';
import {  IonicPage, NavController , AlertController} from 'ionic-angular';
import { DatabaseUserProvider } from '../../providers/database-user/database-user';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  login: string;
  password: string;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public databaseUser: DatabaseUserProvider,
              private sqlite: SQLite,
              private toast: Toast) { }

  register() {
    this.databaseUser.insertNewUserInDataBase(this.login, this.password);
    this.navCtrl.popToRoot();
  }

  async getFromDB(){
    await this.databaseUser.selectUserFromDataBase();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
}

