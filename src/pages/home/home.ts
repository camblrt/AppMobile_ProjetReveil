import { ClockListPage } from './../clock-list/clock-list';
import { ClockPage } from './../clock/clock';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LoginPage} from '../login/login'
import {RegisterPage} from '../register/register'
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public navCtrl: NavController,
              private sqlite: SQLite,
              public databaseUser: DatabaseProvider) {}

  connexion(){
    this.navCtrl.push(ClockPage);
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }
}
