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
    this.dbReady = this.createDBUser();
    console.log('Hello DatabaseUserProvider Provider');

    this.selectUserFromDataBase();
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

    
    return this.db.executeSql('select * from user', []);
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
    return this.db.executeSql('CREATE TABLE IF NOT EXISTS clock (rowid INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, heure TEXT, recurence TEXT, son TEXT, user TEXT)', [])
        .then(res => console.log(res))
        .catch(error => console.log(error));
  }

  async insertNewClockInDataBase(nom: String, heure: String, recurence: String, son: String, user: String){
    await this.dbReady;

    return this.db.executeSql('INSERT INTO user VALUES(?,?,?,?,?)',[nom, heure, recurence, son, user])
      .then(res => {
        console.log(res);
        this.toast.show('User registered', '5000', 'center');
      }).catch(error => {
        console.log(error.message);
      });
  }

  async selectClockFromDataBase(){
    await this.dbReady;

    var dataClockInDB = {nom: "", heure: "", recurence: "", son: "", user: ""};
    var lengthClockDB;
    this.db.executeSql('select * from clock', [])
      .then(data => {
        console.log("Data: " + data);
        lengthClockDB = data.rows.length;
        console.log("Length: " + lengthClockDB);
        for(var i=0; i<lengthClockDB; i++){
          dataClockInDB.nom = data.rows.item(i).nom;
          dataClockInDB.heure = data.rows.item(i).heure;
          dataClockInDB.recurence = data.rows.item(i).recurence;
          dataClockInDB.son = data.rows.item(i).son;
          dataClockInDB.user = data.rows.item(i).user;
          console.log("Nom " + i + " : " + dataClockInDB.nom + ", heure is: " + dataClockInDB.heure 
                    + ", recurence is: " + dataClockInDB.recurence + ", son is: " + dataClockInDB.son
                    + ", user is: " + dataClockInDB.user);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
    return dataClockInDB;
  }

  async selectClockForUserInDB(username: string){
    await this.dbReady;
    
    return this.db.executeSql('select * from clock where login=?', [username]);
  }

  updateClockForUserInDB(clockNom: string, heure: string, recurence: string, son: string, user: string) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('UPDATE clock SET nom=?,heure=?,recurence=?,son=? WHERE user=?',[clockNom,heure,recurence,son,user])
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