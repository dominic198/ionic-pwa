import { Component, OnInit } from '@angular/core';
import { Person } from '../models/person';
import { Customer } from '../models/customer';
import { ApiService } from '../services/api.service';
import { IndexDBService } from '../services/index-db.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  people: Customer[] = [];
  person: Person = new Person();
  
  constructor(private apiService: ApiService, private indexDBService: IndexDBService) {}

  ngOnInit(): void {
    this.refreshPeople()
  }

  refreshPeople() {
    this.apiService.getPeople()
    .subscribe((data) => {
      this.people = data.result;
      localStorage.setItem('data',JSON.stringify(data.result));
    },(err) =>{
      let data = JSON.parse(localStorage.getItem('data'));      
      this.people = data;      
    });
  }

  addPeople(){
    let customer = new Customer();
    customer.name = this.person.name;
    this.people.push(customer);    
    this.apiService.addPerson(this.person)
    .subscribe((data) => {     
      this.person = new Person();
      this.refreshPeople();
    }, (err) => {     
      this.indexDBService.addUser(this.person.name)
      .then(() =>{      
        localStorage.setItem('data',JSON.stringify(this.people));
        this.backgroundSync();
      })
      .catch(console.log);      
    })
  }

  backgroundSync(){
    navigator.serviceWorker.ready.then((swRegistraton) => {
        swRegistraton.sync.register('post-data');
    })
    .catch(console.log);
  }

}
