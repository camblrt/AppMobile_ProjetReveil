import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

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
  actualites: any;

  latitude: number;
  longitude: number;
  country: any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public platform: Platform,
              public alertCtrl: AlertController, 
              public http: HttpClient, 
              private geolocation: Geolocation, 
              private nativeGeocoder: NativeGeocoder) {
  }

  getWeatherFromPosition() {

    this.url = "http://api.openweathermap.org/data/2.5/weather?lat="
      + this.latitude + "&lon="
      + this.longitude + "&appid=68a40fffe840bac1f3463b4c9a130473&lang=fr&units=metric";

    this.http.get(this.url).subscribe((data: any) => {
      this.temperature = data.main.temp;
      this.meteo = data.weather[0].description;
      this.icone_meteo = 'http://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/' + data.weather[0].icon + '.png';
      console.log("this.temperature: " + data.main.temp + " - this.meteo: " + this.meteo);
      this.name = data.name;
      this.ShowResult = true;

      this.getCountryFromPosition();
    },
      (error) => {
        
        let alert = this.alertCtrl.create({
          title: "No internet connection",
          buttons: ['OK']
        });
        console.log("Error from getWeatherFromPosition(): " + error.message);
        alert.present();
      }
    );
  }

  getCountryFromPosition() {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.country = result[0].countryCode;
        this.getActualitesFromCountry();
      })
      .catch((error: any) => console.log("Error from getCountryFromPosition()" + error.message));
  }

  getActualitesFromCountry() {

    var url_actu = 'https://newsapi.org/v2/top-headlines?country=' + this.country + '&pageSize=10&apiKey=f2856d42fda4472182331feb376d0e50';

    this.http.get(url_actu).subscribe((actu: any) => {
      this.actualites = actu.articles;
    },
      (error) => {
        console.log("Error from getActualitesFromCountry(): " + error.message);
      }
    )
  }

  ionViewDidLoad() {

    this.ShowResult = false;

    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then((resp) => {

        console.log("Geoloc: " + resp.coords.latitude + ", " + resp.coords.longitude);

        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;

        this.getWeatherFromPosition();


      })
        .catch((error) => {
          console.log('Error from getCurrentPosition(): ', error.message);
          let alert = this.alertCtrl.create({
            title: "Can't access to your position",
            buttons: ['OK']
          });
          alert.present();
        });
    })
      .catch((error) => {
        console.log('Error from platform.ready(): ', error.message);
      });
  }

  actuSelected(actu){
    window.open(actu.url, '_self');
  }
}