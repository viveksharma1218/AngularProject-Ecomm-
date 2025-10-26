import { Injectable,inject } from '@angular/core';
import { SellerAuthInterface } from '../interfaces/sellerAuth-interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class User {
  router = inject(Router)
  http = inject(HttpClient)
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
}
