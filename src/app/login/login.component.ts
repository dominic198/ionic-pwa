import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  credentials = {
    username: "",
    password: ""
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  onUsernameChange(event){
     //console.log(event.detail)
     this.credentials.username = event.detail.value;
  }

  onPasswordChange(event){
    //console.log(event.detail)
    this.credentials.password = event.detail.value;
 }

  onClick(){   
     this.authService.login(this.credentials)
     .subscribe((data) => {
        if(data){
          this.router.navigate(['/home'])
        }
       
     })
  }

}
