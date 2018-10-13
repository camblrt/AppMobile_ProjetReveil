import { ClockListPage } from './../clock-list/clock-list';

import { Toast } from '@ionic-native/toast';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from './../../providers/database/database';


/**
 * Generated class for the ClockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-clock',
  templateUrl: 'clock.html',
})
export class ClockPage {

  nameAlarm: string;
  notifications: any[];
  days: any[];
  dayDB: string;
  chosenHours: number;
  chosenMinutes: number;
  notifyTime;
  son: string;

  constructor(private toast: Toast, public localNotifications: LocalNotifications, 
    public navCtrl: NavController, public navParams: NavParams,  public platform: Platform,  
    public alertCtrl: AlertController,  private storage: Storage, public dataBase: DatabaseProvider) {

      this.days = [
        {title: 'Lundi', dayCode: 1, checked: false},
        {title: 'Mardi', dayCode: 2, checked: false},
        {title: 'Mercredi', dayCode: 3, checked: false},
        {title: 'Jeudi', dayCode: 4, checked: false},
        {title: 'Vendredi', dayCode: 5, checked: false},
        {title: 'Samedi', dayCode: 6, checked: false},
        {title: 'Dimanche', dayCode: 0, checked: false}];

     this.storage.get('current_username').then((userIs) => {
        this.dataBase.selectClockForUserInDB(userIs).then(data => {      
          let lengthDB = data.rows.length;
          for(var i=0; i<lengthDB; i++){
            this.nameAlarm = data.rows.item(i).nom;
            this.chosenHours = data.rows.item(i).heure;
            this.chosenMinutes = data.rows.item(i).minute;
            this.dayDB = data.rows.item(i).jour;
            this.son = data.rows.item(i).son;
            }
            this.dbTOpagesDays(this.dayDB)
          })
        .catch(error => {
            console.log(error.message);
          });
      }); 
  }

  ionViewDidLoad(){
    this.platform.ready().then(() => {
      if(this.platform.is("cordova")){
        this.localNotifications.hasPermission().then(function(granted) {
          if (!granted) {
            this.localNotifications.registerPermission();
          }
        });
      }
    }); 
  }

  dbTOpagesDays(dayDB){
    console.log(dayDB)
    if(dayDB.includes("Lundi")){
      this.days[0].checked = true;
    }
    if(dayDB.includes("Mardi")){
      this.days[1].checked = true;
    }
    if(dayDB.includes("Mercredi")){
      this.days[2].checked = true;
    }
    if(dayDB.includes("Jeudi")){
      this.days[3].checked = true;
    }
    if(dayDB.includes("Vendredi")){
      this.days[4].checked = true;
    }
  }

  timeChange(time){
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
    console.log("Heure : "+ this.chosenHours + " Minutes : " + this.chosenMinutes)
  }

  addNotifications(){
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
    for(let day of this.days){
      if(day.checked){
        let firstNotificationTime = new Date();
        let dayDifference = day.dayCode - currentDay;

        //this.dayDB += day.title + " " ;
        if(dayDifference < 0){
            dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        firstNotificationTime.setHours(this.chosenHours + (24 * (dayDifference)));
        firstNotificationTime.setMinutes(this.chosenMinutes);
        firstNotificationTime.setSeconds(0);

        //to test easyli
        firstNotificationTime = new Date(new Date().getTime() + 10000);
        console.log("Fist notification time=",firstNotificationTime);

        let notification = {
            title: "Brut",
            text: 'Its time to get Up:',
            trigger : {firstAt: firstNotificationTime, 
              every: 'minute',
              count: 1000}
        };
        console.log("Push notification : " + notification)
        //this.notifications.push(notification);
      }
    } 


    this.toast.show(`Scheduling notification`, '2000', 'center').subscribe(toast => {
      console.log(`Scheduling notification`);
    });

    // Cancel any existing notifications
    this.localNotifications.cancelAll().then(() => {

      this.storage.get('current_username').then((val) => {
        console.log("Jour :  " + this.dayDB + "  User =  " + val)
        this.dataBase.updateClockForUserInDB(this.nameAlarm, this.chosenHours, this.chosenMinutes, this.dayDB,"test son",val);
      })
      
      
      // Schedule the new notifications
      //this.localNotifications.schedule(this.notifications);
      
      this.notifications = [];

      this.toast.show(`Notification scheduled`, '5000', 'center').subscribe(toast => {
        console.log("Notification scheduled");
      });

      //What to do when click on notification
      this.localNotifications.on('click').subscribe(() => {
       this.navCtrl.push(ClockListPage);
      });

      this.navCtrl.pop();

    });
    return
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/sounds/chicken.mp3'
    } else {
      return 'file://assets/sounds/bell.mp3'
    }
  }
 
  cancelAll(){
      this.localNotifications.cancelAll();
      let alert = this.alertCtrl.create({
          title: 'Alarm cancelled',
          buttons: ['Ok']
      });
      alert.present();
  }

}
