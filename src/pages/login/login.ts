import { Component } from '@angular/core';
import { NavController, AlertController} from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import {ClockPage} from '../clock/clock';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  login: string;
  password: string;
  readonly APP_LOGIN: string = 'Camille';
  readonly APP_PASSWORD: string = 'cpe';

  usernameFromDB: string;
  passwordFromDB: string;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              private sqlite: SQLite,
              public databaseUser: DatabaseProvider) { }

  async connexion() {
    let alert = this.alertCtrl.create({
      title: 'Connexion refusée',
      subTitle: 'Le mot et de passe et/ou le login ne sont pas valides',
      buttons: ['OK']
    });
    
    this.databaseUser.checkUserExistsInDB(this.login).then(data => {
      var lengthDB;
      console.log("Data: " + data);
      lengthDB = data.rows.length;
      console.log("Length: " + lengthDB);
      for(var i=0; i<lengthDB; i++){
        this.usernameFromDB = data.rows.item(i).login;
        this.passwordFromDB = data.rows.item(i).password;
        console.log("User " + i + " : " + this.usernameFromDB + " and password is: " + this.passwordFromDB);
      } 
      console.log("user from DB: " + this.usernameFromDB);
      console.log("user from form: " + this.login);
      if (this.login == this.usernameFromDB && this.password == this.passwordFromDB) {
        console.log("User connected.");
        this.navCtrl.push(ClockPage);
        this.login = '';
        this.password = '';
      } else {
        alert.present();
        this.login = '';
        this.password = '';
      }
    })
    .catch(error => {
      console.log(error.message);
    });
  }
}
