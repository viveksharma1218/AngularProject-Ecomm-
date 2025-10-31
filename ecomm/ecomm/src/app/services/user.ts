import { Injectable,inject,signal } from '@angular/core';
import { logIn, product, SellerAuthInterface } from '../interfaces/sellerAuth-interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from 'stream';
import { UserCart } from './user-cart';

@Injectable({
  providedIn: 'root'
})
export class User {
  userId = signal('')
  router = inject(Router)
  http = inject(HttpClient)
  invalidUser:boolean = false;
  userCartServ = inject(UserCart)
  constructor(){}

  userSignUp(user:SellerAuthInterface){
    this.http.post('http://localhost:3000/users',user,{observe:'response'}).subscribe(
      (data)=>{
        if(data){
          // we are using data.body because it will have auto generated id
          // that will be used when we will create cartData that have userId property
          localStorage.setItem('user',JSON.stringify([data.body]));
          this.invalidUser = false;
          setTimeout(() => {
              this.localCartToJson(); 
          }, 500);
        
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
          setTimeout(() => {
          this.localCartToJson();
          }, 500);

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
        let parsedLocalData:product ;
        let parsedUser:any;
        let userId:any;
        if(localData && user){
          parsedLocalData = JSON.parse(localData);
          parsedUser = JSON.parse(user);
          
  
          if(Array.isArray(parsedLocalData) && Array.isArray(parsedUser)){
            userId = parsedUser[0].id;
            parsedLocalData.forEach((product:product,index)=>{
              let cartData:product = {
                ...product,
                userId:userId,
                productId:product.id
                
              }
              delete cartData.id;
              // for each product we are making request 
              // if there are 5 products than we are making 5 requests 
              // so we made delay for each request
              setTimeout(() => {
                this.userCartServ.addToCart(cartData).subscribe(
                  (data)=>{console.log(data)}
                );
              }, 500);
            
              
            })
          }
            if(parsedLocalData){
                localStorage.removeItem('localCart');
              }
  
        }
        setTimeout(() => {
          this.userCartServ.getCartList(userId);
        }, 2000);
        
      }
}
