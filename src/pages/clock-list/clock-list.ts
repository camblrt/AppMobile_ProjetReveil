import { DatabaseProvider } from './../../providers/database/database';
import { ClockPage } from './../clock/clock';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
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
  hours: string[];
  minutes: string[];
  son: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataBaseProviser: DatabaseProvider) {

    this.dataBaseProviser.createDBClock();

    this.names=[];
    this.days=[];
    this.hours=[];
    this.minutes=[];
    this.son=[];

    this.dataBaseProviser.selectClockFromDataBase();

    var dataClock = {nom:"", heure:"", minute:"",jour:"",son:""};
    var lengthDB = 0;
    
    this.dataBaseProviser.selectClockForUserInDB("Q").then( data => {
      this.names.push(data.nom);
      this.days.push(data.jour);
      this.hours.push(data.heure );
      this.minutes=[];
      this.son=[];
    })
     // TODO: crée une méthode pour récuperer toutes les alarmes liés à l'user et bind les valeurs des tableaux. 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClockListPage');
  }

  createNewClock(){
    this.navCtrl.push(ClockPage)
  }
}
