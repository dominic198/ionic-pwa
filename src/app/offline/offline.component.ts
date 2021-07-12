import { Component, OnInit } from '@angular/core';
import { Person } from '../models/person';
import { Customer } from '../models/customer';
import { ApiService } from '../services/api.service';
import { IndexDBService } from '../services/index-db.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss'],
})
export class OfflineComponent implements OnInit {

  people: Customer[] = [];
  person: Person = new Person();
  customer: Customer = new Customer();
  constructor(private apiService: ApiService, private indexDBService: IndexDBService) {}

  ngOnInit(): void {
    this.refreshPeople();   
  }

  refreshPeople() {
    this.apiService.getPeople()
    .subscribe((data) => {
      this.people = data.result.reverse();
      //localStorage.setItem('data',JSON.stringify(data.result));
    },(err) =>{
      console.log('err')
      //let data = JSON.parse(localStorage.getItem('data'));      
      //this.people = data;      
    });
  }

  addPeople(){    
    this.customer.name = this.person.name;
    this.people.push(this.customer);    
    this.apiService.addPerson(this.person)
    .subscribe((data) => {     
      this.person = new Person();
      this.refreshPeople();
    }, (err) => {    
      //localStorage.setItem('data',JSON.stringify(this.people)); 
      this.indexDBService.addUser(this.person)
      .then(this.backgroundSync)
      .catch(() => {console.log('err occured')});      
    })
  }

  backgroundSync(){   
     navigator.serviceWorker.ready.then((swRegistraton) => {
        return swRegistraton.sync.register('post-data');  
        this.person = new Person();
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

}
