
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import {LocalNotifications} from "@ionic-native/local-notifications"
import { HttpClientModule } from "@angular/common/http"
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { Media } from '@ionic-native/media';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { File } from '@ionic-native/file';
import { Brightness } from '@ionic-native/brightness';
// import { HTTP } from '@ionic-native/http';
import { BackgroundMode } from '@ionic-native/background-mode';

import { AddSoundPage } from './../pages/add-sound/add-sound';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { ClockPage } from '../pages/clock/clock';
import { DatabaseProvider } from '../providers/database/database';
import { NotificationOpenPage } from '../pages/notification-open/notification-open'
import { ClockListPage } from '../pages/clock-list/clock-list';
import { ListUsersPage } from '../pages/list-users/list-users';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    ClockPage,
    NotificationOpenPage,
    ClockListPage,
    ListUsersPage,
    AddSoundPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ClockPage,
    RegisterPage,
    NotificationOpenPage,
    ClockListPage,
    ListUsersPage,
    AddSoundPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SQLite,
    Toast,
    Vibration,
    Geolocation,
    Media,
    NativeGeocoder,
    File,
    Brightness,
    // HTTP,
    BackgroundMode
  ]
})
export class AppModule {}
