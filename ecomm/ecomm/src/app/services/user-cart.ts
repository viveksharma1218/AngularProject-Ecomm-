import { Injectable, signal, WritableSignal, PLATFORM_ID, inject,computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { cartData, product } from '../interfaces/sellerAuth-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserCart {
  // these was error localStorage is not defined so we are using platformid and is platformBrowser
  // full explainaiton in googledoc angular
  private platformId = inject(PLATFORM_ID);
  
  // Writable signal for internal use
  private _cartData: WritableSignal<product[]> = signal([]);
  
  // Public read-only signal for components to consume
  public readonly cartData = this._cartData.asReadonly();

  // number of products
  public readonly cartItemCount = computed(() => this._cartData().length);

  private http = inject(HttpClient);
  constructor() {
    this.loadInitialCart();
  }

  // Loads initial data from localStorage (guarded for SSR)
  private loadInitialCart(): void {
    if (isPlatformBrowser(this.platformId)) { 
      const cartItem = localStorage.getItem('localCart');
      //check if cartitem is not undefined
      if (cartItem) {
        try {
          const parsedData = JSON.parse(cartItem);
          // .length was not so we used this
          if (Array.isArray(parsedData)) {
            this._cartData.set(parsedData); 
          }
        } catch (e) {
          console.error("Error parsing local storage cart data:", e);
        }
      }
    }
  }

  // 🔑 FIX: This method must update BOTH localStorage AND the Signal
  localAddToCart(data: product): void {
    if (isPlatformBrowser(this.platformId)) { 
      let cart: product[] = [];
      let alreadyCart = localStorage.getItem('localCart');
      // check if alreadyCart is not undefined
      if (alreadyCart) {
        try {
            cart = JSON.parse(alreadyCart);
        } catch (e) {
            console.error("Failed to parse existing cart data.");
            // Fallback to empty array if data is corrupt
            cart = []; 
        }
      }
      
      // Add the new item
      cart.push(data);
      
      // 1. Update localStorage
      localStorage.setItem('localCart', JSON.stringify(cart));
      
      // 2. 🔑 CRITICAL FIX: Update the Signal to notify all consumers
      this._cartData.set(cart);
      //console.log(`Signal updated. New cart size: ${cart.length}`);
    }
  }
  localRemoveFromCart(productId:number | null){
    if(!productId){
      return;
    }
    let cartData = localStorage.getItem('localCart');
    if(cartData){
      let parsedData:product[] = JSON.parse(cartData);
      if(Array.isArray(parsedData)){
        let newCartData = parsedData.filter((item:product)=>{
          item.id !== productId
        })
        localStorage.setItem('localCart',JSON.stringify(newCartData))
        this._cartData.set(newCartData);
      }
    }
  }
  addToCart(cartData:cartData){
    return this.http.post('http://localhost:3000/cart',cartData)
  }
}