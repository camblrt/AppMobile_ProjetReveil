import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  
  names: string[];
  days: any[];
  hours: number[];
  minutes: number[];
  activated: boolean[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.names = ["Test1", "Test2"];
    this.days = ["Monday", "Monday thuesday"];
    this.hours = [1,2];
    this.minutes = [3,4];
    this.activated = [true,false];

    console.log(this.names)
     // TODO: crée une méthode pour récuperer toutes les alarmes liés à l'user et bind les valeurs des tableaux. 
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ClockListPage');
  }

}
