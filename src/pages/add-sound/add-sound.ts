import { Component } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { Toast } from '@ionic-native/toast';
import { ClockPage } from '../clock/clock';
import { Storage } from '@ionic/storage';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddSoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-sound',
  templateUrl: 'add-sound.html',
})
export class AddSoundPage {
  name: string;
  source: string;

  constructor(public navCtrl: NavController,
    public databaseUser: DatabaseProvider,
    private storage: Storage,
    private toast: Toast,) {
  }

  register() {
    this.storage.get('current_username').then((userIs) => {
      this.databaseUser.insertNewSoundInDataBase(this.name, this.source, userIs);
      this.toast.show('Sound Added', '5000', 'center').subscribe(
        () => {
          console.log('Sound Added');
        });
      this.navCtrl.pop();
    });
  }

}
