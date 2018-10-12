import { ClockListPage } from './../clock-list/clock-list';
import { ClockPage } from './../clock/clock';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from '../login/login'
import {RegisterPage} from '../register/register'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseUserProvider } from '../../providers/database-user/database-user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public navCtrl: NavController,
              private sqlite: SQLite,
              public databaseUser: DatabaseUserProvider) {}

  connexion(){
    this.navCtrl.push(ClockListPage);
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }
}
