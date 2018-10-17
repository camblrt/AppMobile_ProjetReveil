import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

/*
  Generated class for the DatabaseUserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  db: SQLiteObject;
  dbReady: Promise<any>;

  constructor(private sqlite: SQLite,
    private toast: Toast) {
    this.dbReady = this.createDatabase();
    console.log('Hello DatabaseUserProvider Provider');

    this.selectUserFromDataBase();
  }

  async createDatabase() {
    this.db = await this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    });
    this.db.executeSql('CREATE TABLE IF NOT EXISTS user (login TEXT PRIMARY KEY, password TEXT)', [])
      .then(res => console.log(res))
      .catch(error => console.log(error));
    this.db.executeSql('CREATE TABLE IF NOT EXISTS clock (nom TEXT, text TEXT, heure INT, minute INT, jour TEXT, son TEXT, user TEXT PRIMARY KEY)', [])
      .then(res => console.log(res))
      .catch(error => console.log(error));
    return;
  }

  async insertNewUserInDataBase(username: String, password: String) {
    await this.dbReady;

    return this.db.executeSql('INSERT INTO user VALUES(?,?)', [username, password])
      .then(res => {
        console.log("New user" + res);
        this.toast.show('User registered', '5000', 'center');
        this.insertNewClockInDataBase("Nouvelle Alarme", "Il est l'heure!", 0, 0, "Lundi Jeudi", "Nouveau Son", username);
      }).catch(error => {
        console.log(error.message);
      });
  }

  async selectUserFromDataBase() {
    await this.dbReady;

    return this.db.executeSql('select * from user', []);
  }

  async checkUserExistsInDB(username: string) {
    await this.dbReady;

    return this.db.executeSql('select * from user where login=?', [username]);
  }

  async insertNewClockInDataBase(nom: String, text: String, heure: Number, minute: Number, jour: String, son: String, user: String) {
    await this.dbReady;

    return this.db.executeSql('INSERT INTO clock (nom, text, heure, minute, jour, son, user) VALUES(?,?,?,?,?,?,?)', [nom, text, heure, minute, jour, son, user])
      .then(res => {
        console.log("New clock" + res);
        this.toast.show('Clock registered', '5000', 'center');
      }).catch(error => {
        console.log(error.message);
      });
  }

  //debug methode
  async selectClockFromDataBase() {
    await this.dbReady;

    var dataClockInDB = { nom: "", text: "", heure: 0, minute: 0, jour: "", son: "", user: "" };
    var lengthClockDB;
    this.db.executeSql('select * from clock', [])
      .then(data => {
        lengthClockDB = data.rows.length;
        for (var i = 0; i < lengthClockDB; i++) {
          dataClockInDB.nom = data.rows.item(i).nom;
          dataClockInDB.text = data.row.item(i).text;
          dataClockInDB.heure = data.rows.item(i).heure;
          dataClockInDB.minute = data.rows.item(i).minute;
          dataClockInDB.jour = data.rows.item(i).jour;
          dataClockInDB.son = data.rows.item(i).son;
          dataClockInDB.user = data.rows.item(i).user;
          console.log("Nom " + i + " : " + dataClockInDB.nom + ", heure is: " + dataClockInDB.heure
            + ", jour is: " + dataClockInDB.jour + ", son is: " + dataClockInDB.son
            + ", user is: " + dataClockInDB.user);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
    return
  }

  async selectClockForUserInDB(username: string) {
    await this.dbReady;
    return this.db.executeSql('select * from clock where user=?', [username]);
  }

  async updateClockForUserInDB(clockNom: string, clockText: string, heure: Number, minute: Number, jour: string, son: string, user: string) {
    await this.dbReady;

    return this.db.executeSql('UPDATE clock SET nom=?, text=?, heure=?,minute=?,jour=?,son=? WHERE user=?', [clockNom, clockText, heure, minute, jour, son, user])
  }
}