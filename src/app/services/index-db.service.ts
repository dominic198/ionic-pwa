import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase  } from 'idb';

interface MyDB extends DBSchema {
  'customer-sync-store': {
    key: string;
    value: Array<object>;
  } ,
  'customer-list-store': {
    key: string;
    value: object;
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
         db.createObjectStore('customer-sync-store');  
         db.createObjectStore('customer-list-store');         
       }
     })
  }


  addUser(obj:any) {    
    return this.db.put('customer-list-store',obj, obj._id);
  }

  deleteUser(key: string) {
    return this.db.delete('customer-list-store', key);
  }

  getAllUser(){
    return this.db.getAll('customer-list-store');
  }

  clearDb(){
    return this.db.clear('customer-list-store');
  }

  addSyncItem(datatoAdd:any, type:string){
     return this.db.get('customer-sync-store',type)
     .then((data) => {
       if(data == undefined){
         let arr = [];
         arr.push(datatoAdd);
        return this.db.put('customer-sync-store',arr,type);      
       }else{
         data.push(datatoAdd);
        return  this.db.put('customer-sync-store',data,type);
       }
     }).catch(console.error);    
  }
  
}
