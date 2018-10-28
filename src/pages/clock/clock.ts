import { AddSoundPage } from './../add-sound/add-sound';
import { NotificationOpenPage } from './../notification-open/notification-open';

import { Toast } from '@ionic-native/toast';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform} from 'ionic-angular';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from './../../providers/database/database';

import { HomePage } from '../home/home';
import { Brightness } from '@ionic-native/brightness';
import { BackgroundMode } from '@ionic-native/background-mode';


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

  sound_used;
  son: { name: string, src: string, userIs: string };
  soundList = [];
  public audioFile = new Audio();

  constructor(private toast: Toast,
    public localNotifications: LocalNotifications,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage,
    public dataBase: DatabaseProvider,
    private brightness: Brightness,
    private backgroundMode: BackgroundMode) {

    this.son = { name: "", src: "", userIs: "" };
    this.days = [
      { title: 'Monday', dayCode: 1, checked: false },
      { title: 'Tuesday', dayCode: 2, checked: false },
      { title: 'Wednesday', dayCode: 3, checked: false },
      { title: 'Thursday', dayCode: 4, checked: false },
      { title: 'Friday', dayCode: 5, checked: false },
      { title: 'Saturday', dayCode: 6, checked: false },
      { title: 'Sunday', dayCode: 0, checked: false }
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

        this.getAndDisplaySound(userIs);

        var today = new Date();
        this.notifyTime = moment(new Date(today.getFullYear(), today.getMonth(), today.getDate(), this.chosenHours, this.chosenMinutes, 0)).format();
        this.dbTOpagesDays(this.dayDB)
      })
        .catch(error => {
          console.log("Error from selectClockForUserInDB(): " + error.message);
        });
    });
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
    if (dayDB.includes("Monday")) {
      this.days[0].checked = true;
    }
    if (dayDB.includes("Tuesday")) {
      this.days[1].checked = true;
    }
    if (dayDB.includes("Wednesday")) {
      this.days[2].checked = true;
    }
    if (dayDB.includes("Thursday")) {
      this.days[3].checked = true;
    }
    if (dayDB.includes("Friday")) {
      this.days[4].checked = true;
    }
    if (dayDB.includes("Saturday")) {
      this.days[5].checked = true;
    }
    if (dayDB.includes("Sunday")) {
      this.days[6].checked = true;
    }
  }

  timeChange(time) {
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getClockValueAndCreateNewNotification() {
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
    this.dayDB = "";

   
    for (let sound of this.soundList) {
      if (sound.name == this.sound_used) {
        this.son.name = sound.name;
        this.son.src = sound.src;
      }
    }
    
    for (let day of this.days) {
      if (day.checked) {
        let firstNotificationTime = new Date(new Date().getTime());
        let dayDifference = day.dayCode - currentDay;

        this.dayDB += day.title + " ";
        if (dayDifference < 0) {
          dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        firstNotificationTime.setHours(this.chosenHours + (24 * (dayDifference)));
        firstNotificationTime.setMinutes(this.chosenMinutes);
        firstNotificationTime.setSeconds(0);

        firstNotificationTime = new Date(new Date().getTime() + 6000);

        let notification = {
          id: 1,
          title: this.nameAlarm,
          text: this.textAlarm,
          trigger: {
            firstAt: firstNotificationTime,
            every: ELocalNotificationTriggerUnit.WEEK,
            //Besoin de count 1000 sinon notifications sonne en boucle
            count: 5
          },
          smallIcon: 'res//assets/imgs/logo.png',
          sound: this.son.src,
          icon: 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/pumpkin_halloween.png',
        };
        this.notifications.push(notification);
      }
    }
  }

  scheduleLocalNotification() {
    // Cancel any existing notifications
    this.localNotifications.cancelAll().then(() => {

      console.log("Notification : ")
      console.log(this.notifications)

      this.localNotifications.schedule(this.notifications);
      console.log("Notification modified");
      this.localNotifications.on('trigger').subscribe(() => {
        this.backgroundMode.wakeUp();
    
        for (var brightnessValue = 0.0; brightnessValue < 1.0; brightnessValue += 0.05) {
          this.delay(10000);
          this.brightness.setBrightness(brightnessValue);
        }
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.push(NotificationOpenPage);
      });

      this.localNotifications.on('click').subscribe(() => {
        this.backgroundMode.wakeUp();
    
        for (var brightnessValue = 0.0; brightnessValue < 1.0; brightnessValue += 0.05) {
          this.delay(10000);
          this.brightness.setBrightness(brightnessValue);
        }
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.push(NotificationOpenPage);
      });
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
      this.toast.show('Alarm canceled', '5000', 'center').subscribe(
        toast => {
          console.log("Alarm canceled");
        }
      );

      this.audioFile.src = 'http://www.slspencer.com/Sounds/Halloween/Cave.wav';
      this.audioFile.load();
      this.audioFile.play();
    }
    )
  }

  getAndDisplaySound(userIs: string){
    this.dataBase.selectSoundFromDataBase(userIs).then( data => {
      let lengthDB = data.rows.length;
        for (var i = 0; i < lengthDB; i++) {
          if (this.son.name ==  data.rows.item(i).name) {
            this.soundList.push({ name:  data.rows.item(i).name, used: true, src:  data.rows.item(i).src })
          }
          else {
            this.soundList.push({ name:  data.rows.item(i).name, used: false, src:  data.rows.item(i).src })
          }
        }
    })
    .catch(error => {
      console.log("Error from selectSoundForUserInDB(): " + error.message);
    });
  }

  addSound(){
    this.navCtrl.push(AddSoundPage);
  }
  
}