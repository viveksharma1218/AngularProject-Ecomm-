import { Injectable,inject } from '@angular/core';
import { logIn, SellerAuthInterface } from '../interfaces/sellerAuth-interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from 'stream';

@Injectable({
  providedIn: 'root'
})
export class User {
  router = inject(Router)
  http = inject(HttpClient)
  invalidUser:boolean = false;
  constructor(){}

  userSignUp(user:SellerAuthInterface){
    this.http.post('http://localhost:3000/users',user,{observe:'response'}).subscribe(
      (data)=>{
        if(data){
          localStorage.setItem('user',JSON.stringify(data.body));
          this.router.navigate(['/']);
        }
      }
    )
  }
  // if user try to access userAuth component through url after login or signup
  // this will redirect to home page
  isUser(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }

  userLogin(data:logIn){
    this.http.get<SellerAuthInterface[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,{observe:'response'}).subscribe(
      (data)=>{
        //.length is checking if we are getting some data of not
        // because with incorrect username and password we will get empty array
        if(data && data.body?.length){
          //console.log(data.body);
          localStorage.setItem('user',JSON.stringify(data.body));
          this.router.navigate(['/']);
          this.invalidUser = false;
        }
        else{
          this.invalidUser = true;
        }
      }
    )
  }
}
