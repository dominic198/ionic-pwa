import { Injectable } from "@angular/core";
import { Person } from '../models/person';
import { Customer } from '../models/customer';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators'
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({providedIn:'root'})
export class ApiService {
   
    baseUrl: string = "https://dev-taramsys-poc.herokuapp.com/";

    constructor(private http: HttpClient){}

    getPeople():Observable<any>{
       return this.http.get<any>(this.baseUrl + 'customer');
    }

    addPerson(person:Person):Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(person);
       return this.http.post(this.baseUrl + 'addcustomer', body,{'headers':headers});
    }

    deletePerson(id:string):Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify({"id":id});
        return this.http.post(this.baseUrl+ 'customer/delete', body,{'headers':headers});
    }

    editPerson(person:any):Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify({"id":person._id,"name":person.name});
        return this.http.patch(this.baseUrl+ 'customer/update', body,{'headers':headers});
    }
   
}