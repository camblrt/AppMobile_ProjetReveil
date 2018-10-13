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
  dbReady: Promise<any>; //pour attendre le create DB

  constructor(private sqlite: SQLite,
              private toast: Toast) {
    this.dbReady = this.createDBUser();
    console.log('Hello DatabaseUserProvider Provider');
  }

  async createDBUser(){
    this.db = await this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    });
    return this.db.executeSql('CREATE TABLE IF NOT EXISTS user (login TEXT PRIMARY KEY, password TEXT)', [])
        .then(res => console.log(res))
        .catch(error => console.log(error));
  }

  async insertNewUserInDataBase(username: String, password: String){
    await this.dbReady;

    return this.db.executeSql('INSERT INTO user VALUES(?,?)',[username, password])
      .then(res => {
        console.log(res);
        this.toast.show('User registered', '5000', 'center');
      }).catch(error => {
        console.log(error.message);
      });
  }

  async selectUserFromDataBase(){
    await this.dbReady;

    var dataUserInDB = {login: "", password: ""};
    var lengthDB;
    this.db.executeSql('select * from user', [])
      .then(data => {
        console.log("Data: " + data);
        lengthDB = data.rows.length;
        console.log("Length: " + lengthDB);
        for(var i=0; i<lengthDB; i++){
          dataUserInDB.login = data.rows.item(i).login;
          dataUserInDB.password = data.rows.item(i).password;
          console.log("User " + i + " : " + dataUserInDB.login + " and password is: " + dataUserInDB.password);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
    return dataUserInDB;
  }

  async checkUserExistsInDB(username: string){
    await this.dbReady;
    
    return this.db.executeSql('select * from user where login=?', [username]);
  }

  async createDBClock(){
    this.db = await this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    });
    return this.db.executeSql('CREATE TABLE IF NOT EXISTS clock (nom TEXT PRIMARY KEY, heure INT, minute INT, jour TEXT, son TEXT, user TEXT)', [])
        .then(res => console.log(res))
        .catch(error => console.log(error));
  }

  async insertNewClockInDataBase(nom: String, heure: Number, minute: Number, jour: String, son: String, user: String){
    await this.dbReady;

    return this.db.executeSql('INSERT INTO clock (nom, heure, minute, jour, son, user) VALUES(?,?,?,?,?,?)',[nom, heure, minute, jour, son, user])
      .then(res => {
        console.log(res);
        this.toast.show('User registered', '5000', 'center');
      }).catch(error => {
        console.log(error.message);
      });
  }

  async selectClockFromDataBase(){
    await this.dbReady;

    var dataClockInDB = {nom: "", heure: 0, minute: 0, jour: "", son: "", user: ""};
    var lengthClockDB;
    this.db.executeSql('select * from clock', [])
      .then(data => {
        console.log("Data: " + data);
        lengthClockDB = data.rows.length;
        console.log("Length: " + lengthClockDB);
        for(var i=0; i<lengthClockDB; i++){
          dataClockInDB.nom = data.rows.item(i).nom;
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
      this.db.executeSql('DELETE FROM clock WHERE user="Q"').then().catch();
    return dataClockInDB;
  }

  async selectClockForUserInDB(username: string){
    await this.dbReady;
    
    var dataClock = {nom:"", heure:"", minute:"",jour:"",son:""};
    var lengthDB = 0;
    
    this.db.executeSql('select * from clock where user=?', [username])
    .then(data => {
      lengthDB = data.rows.length;
      for(var i=0; i<lengthDB; i++){
        dataClock.nom = data.rows.item(i).nom;
        dataClock.heure = data.rows.item(i).heure;
        dataClock.minute = data.rows.item(i).minute;
        dataClock.jour = data.rows.item(i).jour;
        dataClock.son = data.rows.item(i).son;
        }
      })
    .catch(error => {
        console.log(error.message);
      });
    return dataClock
  }

  updateClockForUserInDB(clockNom: string, heure: Number, minute: Number, jour: string, son: string, user: string) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE clock SET nom=?,heure=?,minutes=?,jour=?,son=? WHERE user=?',[clockNom,heure,minute,jour,son,user])
        .then(res => {
          console.log(res);
          this.toast.show('Data updated', '5000', 'center');
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }
}