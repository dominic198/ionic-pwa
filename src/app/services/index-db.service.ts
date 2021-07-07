import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase  } from 'idb';

interface MyDB extends DBSchema {
  'user-store': {
    key: string;
    value: string;
  } 
}
@Injectable({
  providedIn: 'root'
})
export class IndexDBService { 
  
  private db: IDBPDatabase<MyDB>;

  constructor() {
    this.connectToDb();
  }

  async connectToDb(){
     this.db = await openDB<MyDB>('my-db',1,{
       upgrade(db){
         db.createObjectStore('user-store');
       }
     })
  }

  addUser(obj:any) {
    return this.db.put('user-store',JSON.stringify(obj), 'name');
  }

  deleteUser(key: string) {
    return this.db.delete('user-store', key);
  }
}
