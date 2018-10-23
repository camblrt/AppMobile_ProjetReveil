import { DatabaseProvider } from './../../providers/database/database';
import { ClockPage } from './../clock/clock';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  minutes: string;
  son: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataBaseProviser: DatabaseProvider,
    private storage: Storage) {

    this.name = "Pas d'alarmes";
    this.days = "Pas d'alarmes";
    this.hours = 0;
    this.minutes = "00";
  }



  getFromDB() {
    this.dataBaseProviser.selectClockFromDataBase();
  }
  modifyClock() {
    this.navCtrl.push(ClockPage)
  }

  ionViewWillEnter() {
    return this.storage.get('clock')
      .then((val) => {
        if (val == null) {
          this.navCtrl.push(ClockPage);
        }
        else {
          this.name = val[0];
          this.hours = val[1];
          if (val[2] < 10) {
            this.minutes = "0" + val[2];
          }
          else {
            this.minutes = val[2];
          }

          this.days = val[3];

        }
      });
  }
}
