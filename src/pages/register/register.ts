import { Component } from '@angular/core';
import {  IonicPage, NavController , AlertController} from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  login: string;
  password: string;
  passwordVerif: string;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public databaseUser: DatabaseProvider,
              private storage: Storage,
              private toast: Toast) { }

  register() {
    if(this.password == this.passwordVerif){
      this.databaseUser.insertNewUserInDataBase(this.login, this.password);
      this.storage.set('current_username', this.login);
      this.navCtrl.popToRoot();
    }
    else{
      this.toast.show('Les deux mots de passe doivent être identiques', '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    }
  }

  async getFromDB(){

    var dataUserInDB = [{login: "", password: ""}];
    var lengthDB;
    await this.databaseUser.selectUserFromDataBase().then(data => {
      console.log("Data: " + data);
      lengthDB = data.rows.length;
      console.log("Length: " + lengthDB);
      for(var i=0; i<lengthDB; i++){
        dataUserInDB[i].login = data.rows.item(i).login;
        dataUserInDB[i].password = data.rows.item(i).password;
        console.log("User " + i + " : " + dataUserInDB[i].login + " and password is: " + dataUserInDB[i].password);
      }
    })
    .catch(error => {
      console.log(error.message);
    });
  }

  ionViewDidLoad() {
    // this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}

