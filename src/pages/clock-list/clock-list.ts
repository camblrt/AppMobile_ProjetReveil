import { DatabaseProvider } from './../../providers/database/database';
import { ClockPage } from './../clock/clock';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ClockListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clock-list',
  templateUrl: 'clock-list.html',
})
export class ClockListPage {
  
  name: string;
  days: string;
  hours: number;
  minutes: number;
  son: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public dataBaseProviser: DatabaseProvider,
              private storage: Storage) {

    this.dataBaseProviser.createDBClock();

    this.name="Pas d'alarmes";
    this.days="Pas d'alarmes";
    this.hours=0;
    this.minutes=0;
    this.son="Pas d'alarmes";
    
    this.storage.get('current_username').then((val) => {
    this.dataBaseProviser.selectClockForUserInDB(val).then(data => {      
      let lengthDB = data.rows.length;
      for(var i=0; i<lengthDB; i++){
        this.name = data.rows.item(i).nom;
        this.hours = data.rows.item(i).heure;
        this.minutes = data.rows.item(i).minute;
        this.days = data.rows.item(i).jour;
        this.son = data.rows.item(i).son;
        }
      })
    .catch(error => {
        console.log(error.message);
      });
  });
}
  getFromDB(){
    this.dataBaseProviser.selectClockFromDataBase();
  }
  modifyClock(){
    this.navCtrl.push(ClockPage)
  }
}
