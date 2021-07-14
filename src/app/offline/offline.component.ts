import { Component, OnInit } from '@angular/core';
import { Person } from '../models/person';
import { Customer } from '../models/customer';
import { ApiService } from '../services/api.service';
import { IndexDBService } from '../services/index-db.service';
import { from } from 'rxjs';
import { ConnectionService } from 'ng-connection-service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss'],
})
export class OfflineComponent implements OnInit {

  people: any = [];
  person: Person = new Person();
  customer: Customer = new Customer();
  status = 'ONLINE';
  isConnected = true;

  constructor(public toastController: ToastController,public alertController: AlertController, private apiService: ApiService, private indexDBService: IndexDBService, private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        setTimeout(() => {  this.refreshPeople() },4000)
      }
      else {
        this.status = "OFFLINE";
      }     
      this.presentToast(this.status);    
    }); 
  }
  

  ngOnInit(): void {
    this.refreshPeople(); 
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentAlertConfirm(person:any, msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `<strong>${msg}</strong>!!!`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteCustomer(person);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertPrompt(person:any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Edit Customer',
      inputs: [
        {
          name: 'name',
          type: 'text',
          id: person._id,
          value: person.name,
          placeholder: 'customer name'
        }        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            let val = person;
            val.name = data.name;
            this.editSave(val);
          }
        }
      ]
    });

    await alert.present();
  }


  refreshPeople() {
    this.apiService.getPeople()
      .subscribe((data) => {
        this.people = data.result.reverse();
        this.indexDBService.clearDb();
        for (var i = 0; i < data.result.length; i++) {
          let val = data.result[i];
          val.synced = true;
          this.indexDBService.addUser(val);
        }
      }, (err) => {
        console.log('getting local data');
        setTimeout(() => {
          this.updateUI();
        }, 500);
      });
  }

  updateUI(){
    this.indexDBService.getAllUser()
    .then((data) => {     
      //console.log(data.sort((a:any,b:any) => b._id - a._id)); 
      let topArr = [];
      let arr = [];
      //let first = JSON.parse(data[0]);
      for(let i=0; i< data.length; i++){
        let val:any = data[i];
        if(val.synced == false){
          topArr.unshift(val);
        }else{
          arr.push(val);
        }       
      }
     this.people = topArr.concat(arr.reverse());
     //this.people.unshift(first);
    }).catch(console.error);
  }

  addPeople(){    
    this.customer.name = this.person.name;
    this.customer._id = Date.now().toString();
    this.customer.createdAt = Date.now().toString();
    this.customer.updatedAt = Date.now().toString();
    this.customer.synced = false;
    // this.people.push(this.customer);    
   
    if(navigator.serviceWorker && window.SyncManager){
      let promise = this.indexDBService.addUser(this.customer);
          const obs = from(promise);
          obs.subscribe((data) => {
            this.updateUI();
            this.backgroundSync('post-data');
            this.presentToast('data added to local db. will be synced with server when online');
            this.person = new Person();
          });      
     }else{
      this.apiService.addPerson(this.person)
      .subscribe((data) => {     
        this.person = new Person();
        this.refreshPeople();
      }, (err) => {    
        console.log(err)
      });
     }
  }

  backgroundSync(tag: string){  
    console.log('sync called') 
     navigator.serviceWorker.ready.then((swRegistraton) => {
        return swRegistraton.sync.register(tag);  
    })
    .catch(()=>{console.log('errr')});
  }

  doRefresh(event){      
    this.refreshPeople();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  delete(per:any){
    this.presentAlertConfirm(per, "Are you sure to Delete?");
  }

  deleteCustomer(per:any){
    if(navigator.serviceWorker && window.SyncManager){
      let synced = per.synced;
      if(synced){
        this.indexDBService.addSyncItem(per,'delete')
        .then(() => {
          this.indexDBService.deleteUser(per._id)
          .then(() => {
            console.log('deleted from local db!');
            this.updateUI();
            console.log('going to delete from server')
            this.backgroundSync('delete-data');          
          }).catch(console.error);
        }).catch(console.error);  
      }else{
        this.indexDBService.deleteUser(per._id)
        .then(() => {
          console.log('deleted from local db!');
          this.presentToast('deleted from local db!');
          this.updateUI();           
        }).catch(console.error);
      }
    }else{
      this.apiService.deletePerson(per._id)
      .subscribe(data => {
         console.log('deleted from server!')
      },err => {
        console.log('error in deleting', err)
      })
    }
  }

  edit(per:any){
    this.presentAlertPrompt(per);
  }

  editSave(per:any){
    if(navigator.serviceWorker && window.SyncManager){
      let synced = per.synced;
      if(synced){
        this.indexDBService.addSyncItem(per,'edit')
        .then(() => {
          this.indexDBService.addUser(per)
        .then(() => {
          console.log('updated customer name in localdb');
          this.updateUI();
          console.log('now updating in server');
          this.backgroundSync('edit-data');
        })
        .catch(console.error);
        })
        .catch(console.error);        
      }else{
        this.indexDBService.addUser(per)
        .then(() =>{
          console.log('updated customer name in localdb');
          this.presentToast('saved in local db!. Will be synced when online')
          this.updateUI();
        })
        .catch(console.error);
      }
    }else{
      this.apiService.editPerson(per).subscribe(data => {
        console.log('updated customer name in server!');
      })
    }
  }

}
