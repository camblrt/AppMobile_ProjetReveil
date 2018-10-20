import { ClockListPage } from './../clock-list/clock-list';
import { Component, Input } from '@angular/core';
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
  current_user:string;
  private file = new Audio();
  constructor(public navCtrl: NavController,
              public databaseUser: DatabaseProvider,
              private storage: Storage) {

                this.storage.get('current_username')
                  .then((val) => {
                    this.current_user = val;
                    if(this.current_user == null){
                      this.navCtrl.push(RegisterPage);
                    }
                  });

                  // this.file.src = 'http://www.slspencer.com/Sounds/Halloween/MrChicken-Laugh.mp3';
                  // this.file.load();
                  // this.file.play();
                  
               }

  displayClockOfCurrentUser(){
    this.navCtrl.push(ClockListPage);
  }

  userList(){
    this.navCtrl.push(ListUsersPage);
  }

  ionViewWillEnter() {
    return this.storage.get('current_username')
    .then((val) => {
      this.current_user = val;
    });
  }
}
