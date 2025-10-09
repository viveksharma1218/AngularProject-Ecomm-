import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SellerAuthInterface } from '../interfaces/sellerAuth-interface';

@Injectable({
  providedIn: 'root'
})
export class Seller {

  constructor(private http:HttpClient){}
  
  signUp(data:SellerAuthInterface){
    //console.log('seller service called');
    return this.http.post('http://localhost:3000/seller',data)
  }
}
