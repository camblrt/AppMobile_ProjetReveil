import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { HttpClient  } from '@angular/common/http'; 
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-notification-open',
  templateUrl: 'notification-open.html',
})
export class NotificationOpenPage {
  
    temperature: number;
    meteo: any;
    icone_meteo: any;
    zipcode: any;
    name: any;
    url: any;
    ShowResult: boolean;
  
  
    constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
      public alertCtrl: AlertController, public http: HttpClient, private geolocation: Geolocation) {
    }
  
    
  
      ionViewDidLoad() {
        this.platform.ready().then(()=>{
          this.geolocation.getCurrentPosition().then((resp) => {
            this.url = "http://api.openweathermap.org/data/2.5/weather?lat=" 
            + resp.coords.latitude + "&lon=" 
            + resp.coords.longitude + "&appid=68a40fffe840bac1f3463b4c9a130473&units=metric&lang=fr";
            
            let alert = this.alertCtrl.create({
              title: 'API error',
              buttons: ['OK']
            });
            this.ShowResult = false;
        
            this.http.get(this.url).subscribe((data : any) => {
              this.temperature = data.main.temp;
              this.meteo = data.weather[0].main;
              this.icone_meteo = 'http://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/' + data.weather[0].icon + '.png';
              console.log("this.temperature: " + data.main.temp + " - this.meteo: " + this.meteo);
              this.name = data.name;
              this.ShowResult = true;
              console.log(this.temperature);
            },
              (err) => {
                  console.log(err);
                alert.present();
              }
            );
          }).catch((error) => {
            console.log('Error getting location', error);
          });
        });
      }
}