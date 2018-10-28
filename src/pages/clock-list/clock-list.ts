import { ClockPage } from './../clock/clock';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


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
    private storage: Storage) {

    this.name = "No alarm";
    this.days = "No alarm";
    this.hours = 0;
    this.minutes = "00";
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
