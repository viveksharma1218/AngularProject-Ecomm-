import { Injectable } from '@angular/core';
import { AddProduct } from '../seller/add-product/add-product';
import { product } from '../interfaces/sellerAuth-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerAddProduct {
  
  constructor(private http:HttpClient){}
  AddProduct(data:product){
    return this.http.post('http://localhost:3000/products',data);
  }
}
