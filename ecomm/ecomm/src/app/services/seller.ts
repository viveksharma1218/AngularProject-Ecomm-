import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SellerAuthInterface } from '../interfaces/sellerAuth-interface';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Seller {
  isSellerLoggedin =new BehaviorSubject<boolean>(false);
  router = inject(Router);

  constructor(private http:HttpClient){}
  
  signUp(data:SellerAuthInterface){
    //console.log('seller service called');
    //return this.http.post('http://localhost:3000/seller',data)
    // we want to check response of this request
    this.http.post('http://localhost:3000/seller',data,{observe:'response'}).subscribe(
      (result)=>{
        //console.log(result);
        this.isSellerLoggedin.next(true);
        localStorage.setItem('seller', JSON.stringify(result.body))
        this.router.navigate(['/seller-home']);
      }
    )
  }
  isSellerReg(){
    if(localStorage.getItem('seller')){
      this.isSellerLoggedin.next(true);
      this.router.navigate(['/seller-home']);
    }
  }
}
