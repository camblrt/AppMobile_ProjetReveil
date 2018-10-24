import { NotificationOpenPage } from './../notification-open/notification-open';

import { Toast } from '@ionic-native/toast';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, SelectPopover } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from './../../providers/database/database';
import { File } from '@ionic-native/file';

import { HomePage } from '../home/home';
import { Brightness } from '@ionic-native/brightness';
import { BackgroundMode } from '@ionic-native/background-mode';

import { Subscription } from 'rxjs/Subscription';



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
  textAlarm: string;
  notifications: any[] = [];
  days: any[];
  dayDB: string;
  chosenHours: number;
  chosenMinutes: number;
  notifyTime;

  son: { name: string, src: string };
  soundList = [];
  srcURL: string;
  appInBackground: boolean;
  public audioFile = new Audio();

  subcriber: Subscription = this.localNotifications.on('trigger').subscribe(() => {
    this.backgroundMode.wakeUp();

    for (var brightnessValue = 0.0; brightnessValue < 1.0; brightnessValue += 0.1) {
      this.delay(10000);
      this.brightness.setBrightness(brightnessValue);
    }
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(NotificationOpenPage);
  });

  constructor(private toast: Toast,
    public localNotifications: LocalNotifications,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertCtrl: AlertController,
    private storage: Storage,
    public dataBase: DatabaseProvider,
    private brightness: Brightness,
    private file: File,
    private backgroundMode: BackgroundMode) {

      // this.subcriber.unsubscribe();

    this.son = { name: "", src: "" };
    this.days = [
      { title: 'Lundi', dayCode: 1, checked: false },
      { title: 'Mardi', dayCode: 2, checked: false },
      { title: 'Mercredi', dayCode: 3, checked: false },
      { title: 'Jeudi', dayCode: 4, checked: false },
      { title: 'Vendredi', dayCode: 5, checked: false },
      { title: 'Samedi', dayCode: 6, checked: false },
      { title: 'Dimanche', dayCode: 0, checked: false }
    ];

    this.storage.get('current_username').then((userIs) => {
      this.dataBase.selectClockForUserInDB(userIs).then(data => {
        let lengthDB = data.rows.length;
        for (var i = 0; i < lengthDB; i++) {
          this.nameAlarm = data.rows.item(i).nom;
          this.textAlarm = data.rows.item(i).text;
          this.chosenHours = data.rows.item(i).heure;
          this.chosenMinutes = data.rows.item(i).minute;
          this.dayDB = data.rows.item(i).jour;
          this.son.name = data.rows.item(i).son;
        }

        this.getSoundJSON();

        var today = new Date();
        this.notifyTime = moment(new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.chosenHours, this.chosenMinutes, 0)).format();
        this.dbTOpagesDays(this.dayDB)
      })
        .catch(error => {
          console.log("Error from selectClockForUserInDB(): " + error.message);
        });
    });


  }

  getSoundJSON() {
    this.file.readAsText(this.file.applicationDirectory + "www/assets", "sons.json").then(data => {
      let jsonSon = JSON.parse(data)
      for (let sound of jsonSon) {
        if (this.son.name == sound.name) {
          this.soundList.push({ name: sound.name, used: true, src: sound.src })
        }
        else {
          this.soundList.push({ name: sound.name, used: false, src: sound.src })
        }
      }
      console.log(this.soundList);
    })
      .catch(err => {
        console.log(err);
      })
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        this.localNotifications.hasPermission().then(function (granted) {
          if (!granted) {
            this.localNotifications.registerPermission();
          }
        });
      }
    });
  }

  dbTOpagesDays(dayDB) {
    if (dayDB.includes("Lundi")) {
      this.days[0].checked = true;
    }
    if (dayDB.includes("Mardi")) {
      this.days[1].checked = true;
    }
    if (dayDB.includes("Mercredi")) {
      this.days[2].checked = true;
    }
    if (dayDB.includes("Jeudi")) {
      this.days[3].checked = true;
    }
    if (dayDB.includes("Vendredi")) {
      this.days[4].checked = true;
    }
    if (dayDB.includes("Samedi")) {
      this.days[5].checked = true;
    }
    if (dayDB.includes("Dimanche")) {
      this.days[6].checked = true;
    }
  }

  timeChange(time) {
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

  getClockValueAndCreateNewNotification() {
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
    this.dayDB = "";

    if (this.srcURL != null) {
      this.son.name = "Private URL";
      this.son.src = this.srcURL;
    }
    else {
      for (let sound of this.soundList) {
        if (sound.used) {
          this.son.name = sound.name;
          this.son.src = sound.src;
        }
      }
    }
    for (let day of this.days) {
      if (day.checked) {
        let firstNotificationTime = new Date();
        let dayDifference = day.dayCode - currentDay;

        this.dayDB += day.title + " ";
        if (dayDifference < 0) {
          dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        firstNotificationTime.setHours(this.chosenHours + (24 * (dayDifference)));
        firstNotificationTime.setMinutes(this.chosenMinutes);
        firstNotificationTime.setSeconds(0);

        //to test easily
        firstNotificationTime = new Date(new Date().getTime() + 6000);
        let notification = {
          id: 1,
          title: this.nameAlarm,
          text: this.textAlarm,
          trigger: {
            at: firstNotificationTime,
            //every: 'minute',
            //Besoin de count 1000 sinon notifications sonne en boucle
            //count: 10000
          },
          smallIcon: 'res//assets/imgs/logo.png',
          sound: this.son.src,
          icon: 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/pumpkin_halloween.png',
        };
        this.notifications.push(notification);
      }
    }
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  scheduleLocalNotification() {
    document.addEventListener("pause", this.onPause, false);
    document.addEventListener("resume", this.onResume, false);

    // Cancel any existing notifications
    this.localNotifications.cancelAll().then(() => {

      this.localNotifications.schedule(this.notifications);
      console.log("Modification de la notification");


      this.notifications = [];

    });


  }

  updateClockTableInDataBase() {
    this.storage.get('current_username').then((val) => {
      this.dataBase.updateClockForUserInDB(this.nameAlarm, this.textAlarm, this.chosenHours, this.chosenMinutes, this.dayDB, this.son.name, val)
        .then(() => {
          console.log("DB updated");
        })
        .catch(errorUpdateDB => {
          console.log("Error from updateClockForUserInDB(): " + errorUpdateDB.message);
        });
    });
  }



  createScheduleNotificationAndSaveClockValue() {

    this.getClockValueAndCreateNewNotification();

    this.storage.set('clock', [this.nameAlarm, this.chosenHours, this.chosenMinutes, this.dayDB]);
    this.navCtrl.pop();

    this.scheduleLocalNotification();

    this.updateClockTableInDataBase();

    return;
  }

  cancelAll() {
    this.localNotifications.cancelAll().then(() => {
      this.toast.show('Alarm cancelled', '5000', 'center').subscribe(
        toast => {
          console.log("Alarme annulé");
        }
      );

      this.audioFile.src = 'http://www.slspencer.com/Sounds/Halloween/Cave.wav';
      this.audioFile.load();
      this.audioFile.play();
    }
    )
  }

  onPause() {
    this.appInBackground = true;
    console.log("APP IN BACKGROUND");
  }

  onResume() {
    this.appInBackground = false;
    console.log("APP IN FOREGROUND");
  }
}
