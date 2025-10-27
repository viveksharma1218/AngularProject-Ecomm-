import { Injectable } from '@angular/core';
import { product } from '../interfaces/sellerAuth-interface';

@Injectable({
  providedIn: 'root'
})
export class UserCart {
  
  localAddToCart(data:product){

    let cartData= [];
    // check if localStorage already have data
    // we are checking this because when we use localStorage.setItem() if we already have that data new data
    // will replace the old one that we don't want
    let alreadyCart = localStorage.getItem('localCart');
    if(!alreadyCart){
      localStorage.setItem('localCart',JSON.stringify([data]));
    }
    else{
      //console.log('already have data');
      cartData = JSON.parse(alreadyCart);
      cartData.push(data);
      // now we have both old and new data and we will send this data to localStorage 
      localStorage.setItem('localCart',JSON.stringify(cartData));
    }
  }
}
