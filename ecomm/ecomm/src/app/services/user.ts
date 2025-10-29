import { Injectable,inject } from '@angular/core';
import { logIn, product, SellerAuthInterface,cartData } from '../interfaces/sellerAuth-interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from 'stream';
import { UserCart } from './user-cart';

@Injectable({
  providedIn: 'root'
})
export class User {
  router = inject(Router)
  http = inject(HttpClient)
  invalidUser:boolean = false;
  userCartServ = inject(UserCart)
  constructor(){}

  userSignUp(user:SellerAuthInterface){
    this.http.post('http://localhost:3000/users',user,{observe:'response'}).subscribe(
      (data)=>{
        if(data){
          localStorage.setItem('user',JSON.stringify(data.body));
           this.localCartToJson();
          this.router.navigate(['']);
        }
      }
    );
   
  }
  // if user try to access userAuth component through url after login or signup
  // this will redirect to home page
  isUser(){
    if(localStorage.getItem('user')){
      this.router.navigate(['']);
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
          this.localCartToJson()
        }
        else{
          this.invalidUser = true;
        }
      }
    )
  }

  localCartToJson(){
        //console.log('localCartToJson called');
        let localData = localStorage.getItem('localCart');
        let user = localStorage.getItem('user');
        if(localData && user){
          let parsedLocalData:product = JSON.parse(localData);
          let parsedUser = JSON.parse(user);
          let userId = parsedUser.id;
  
          if(Array.isArray(parsedLocalData)){
            parsedLocalData.forEach((product:product,index)=>{
              let cartData:cartData = {
                ...product,
                productId:product.id,
                userId:userId,
              }
              delete cartData.id;
              // for each product we are making request 
              // if there are 5 products than we are making 5 requests 
              // so we made delay for each request
              setTimeout(() => {
                this.userCartServ.addToCart(cartData).subscribe((data)=>{
                  console.log(data);
                });
              }, 500);
            
              
            })
          }
            if(parsedLocalData){
                localStorage.removeItem('localCart');
              }
  
        }
      }
}
