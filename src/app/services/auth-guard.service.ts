import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { take, tap } from "rxjs/operators";
import { AuthService } from './auth.service';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {        
        return this.authService.loggedin
        .pipe(
            tap (auth => !auth ?  this.router.navigate(["/login"]) : true),
            take(1)
        );      
    }
    
}