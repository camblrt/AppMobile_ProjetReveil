// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';


/*
  Generated class for the DatabaseUserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseUserProvider {
  db: SQLiteObject;
  dbReady: Promise<any>; //pour attendre le create DB

  constructor(
    // public http: HttpClient, 
              private sqlite: SQLite,
              private toast: Toast) {
    this.dbReady = this.createNewDB();
    console.log('Hello DatabaseUserProvider Provider');
  }

  async createNewDB(){
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

}
