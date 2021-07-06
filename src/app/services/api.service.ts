import { Injectable } from "@angular/core";
import { Person } from '../models/person';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({providedIn:'root'})
export class ApiService {
   
    baseUrl: string = "http://localhost:3000/";

    constructor(private http: HttpClient){}

    getPeople():Observable<Person[]>{
       return this.http.get<Person[]>(this.baseUrl + 'people');
    }

    addPerson(person:Person):Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(person);
       console.log(body)
       return this.http.post(this.baseUrl + 'people', body,{'headers':headers})
    }
   
}