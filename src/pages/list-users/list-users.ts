import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { RegisterPage } from '../register/register';
import { ClockPage } from '../clock/clock';
import { Storage } from '@ionic/storage';



/**
 * Generated class for the ListUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-users',
  templateUrl: 'list-users.html',
})
export class ListUsersPage {
  dataUsernameInDB = [];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public databaseUser: DatabaseProvider,
              private storage: Storage) { 

                var lengthDB;
                this.databaseUser.selectUserFromDataBase().then(data => {
                  lengthDB = data.rows.length;
                  for(var i=0; i<lengthDB; i++){
                    this.dataUsernameInDB[i]= data.rows.item(i).login;
                    console.log("User " + i + " : " + this.dataUsernameInDB[i]);
                  }
                })
                .catch(error => {
                  console.log(error.message);
                });

              }
  


  itemSelected(user: string) {
    this.storage.set('current_username', user);
    this.navCtrl.push(ClockPage);
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListUsersPage');
  }

}
