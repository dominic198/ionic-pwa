import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from 'ng-connection-service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
 

  constructor(private authService: AuthService, private router:Router){}
  
  ngOnInit(): void {}
  
  logout(){   
    this.authService.logout();
    this.authService.loggedin.subscribe(data => {
      console.log(data)
      if(!data){
        this.router.navigate(['/login']);
      }
    })
  }
  
}
