import { LoginPage } from './../login/login';
import { Toast } from '@ionic-native/toast';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NotificationOpenPage } from './../notification-open/notification-open'
import * as moment from 'moment';
import { pluginWarn } from '@ionic-native/core';

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

  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;

  constructor(private toast: Toast, public localNotifications: LocalNotifications, public navCtrl: NavController, public navParams: NavParams,  public platform: Platform,  public alertCtrl: AlertController) {

    this.notifyTime = moment(new Date()).format();

    this.chosenHours = new Date().getHours();
    this.chosenMinutes = new Date().getMinutes();

    this.days = [
        {title: 'Monday', dayCode: 1, checked: false},
        {title: 'Tuesday', dayCode: 2, checked: false},
        {title: 'Wednesday', dayCode: 3, checked: false},
        {title: 'Thursday', dayCode: 4, checked: false},
        {title: 'Friday', dayCode: 5, checked: false},
        {title: 'Saturday', dayCode: 6, checked: false},
        {title: 'Sunday', dayCode: 0, checked: false}
    ];

  
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

  timeChange(time){
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

  addNotifications(){
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
    for(let day of this.days){
      if(day.checked){
        let firstNotificationTime = new Date();
        let dayDifference = day.dayCode - currentDay;

        if(dayDifference < 0){
            dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        firstNotificationTime.setHours(this.chosenHours + (24 * (dayDifference)));
        firstNotificationTime.setMinutes(this.chosenMinutes);
        firstNotificationTime.setSeconds(0);
        console.log("Fist notification time=",firstNotificationTime);

        let notification = {
            title: 'ALARM',
            text: 'Its time to get Up:)',
            trigger : {firstAt: firstNotificationTime, 
              every: 'minute',
              count: 1445}
        };
        this.notifications.push(notification);
      }
    } 

      
    this.toast.show(`Scheduling notification`, '5000', 'center').subscribe(toast => {
        console.log(toast);
    });

    // Cancel any existing notifications
    this.localNotifications.cancelAll().then(() => {

      // Schedule the new notifications
      this.localNotifications.schedule(this.notifications);
      this.notifications = [];

      this.toast.show(`Notification scheduled`, '5000', 'center').subscribe(toast => {
        console.log(toast);
      });

      //What to do when click on notification
      this.localNotifications.on('click').subscribe(() => {
        let alert = this.alertCtrl.create({
              title: 'Bonjour ! '
        });
        alert.present();
        this,this.navCtrl.push(NotificationOpenPage);
      });

    });
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/sounds/shame.mp3'
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
