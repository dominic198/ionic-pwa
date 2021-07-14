import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable({providedIn:'root'})
export class AuthService {
     loggedin = new BehaviorSubject(false);
     
     login(credentials:any): Observable<boolean>{
        if(credentials.username == 'demo' && credentials.password == 'demo'){
            this.loggedin.next(true);
            localStorage.setItem('loggedin','true');
            return of(true);            
        }else{
            return of(false);
        }
     }

     logout(){
         this.loggedin.next(false);
         localStorage.removeItem('loggedin')
     }
}