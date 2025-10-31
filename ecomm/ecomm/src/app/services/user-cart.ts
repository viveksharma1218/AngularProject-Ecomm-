import { Injectable, signal, WritableSignal, PLATFORM_ID, inject,computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { orderData, product } from '../interfaces/sellerAuth-interface';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserCart {

  userId = signal(0);

  // these was error localStorage is not defined so we are using platformid and is platformBrowser
  // full explainaiton in googledoc angular
  private platformId = inject(PLATFORM_ID);
  

  
  // Public read-only signal for components to consume
  public  cartData = signal<product[]>([]);

  // number of products
  public readonly cartItemCount = computed(() => this.cartData().length);

  private http = inject(HttpClient);
  constructor() {
    this.getUserId();
    this.loadInitialCart();
  }

  // Loads initial data from localStorage (guarded for SSR)
  private loadInitialCart(): void {
    if (isPlatformBrowser(this.platformId)) { 
      //here we have two situation 
      // first: if user is not logged in than products can be found in localStorage
      // Second: if user is logged in than products can be found in json server.
      let user = localStorage.getItem('user');
      if(user){
          const cartItem = localStorage.getItem('localCart');
          //check if cartitem is not undefined
          if (cartItem) {
            try {
              const parsedData = JSON.parse(cartItem);
              // .length was not so we used this
              if (Array.isArray(parsedData)) {
                this.cartData.set(parsedData); 
              }
            } catch (e) {
              console.error("Error parsing local storage cart data:", e);
            }
          }
      }
      else{
        if(user){
              let parsedUser = JSON.parse(user);
              let userId = parsedUser[0].id;
              this.getCartList(userId)
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
      this.cartData.set(cart);
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
        this.cartData.set(newCartData);
      }
    }
  }
  addToCart(cartData: product) {
  return this.http.post('http://localhost:3000/cart', cartData, { observe: 'response' }).pipe(
    switchMap((response) => {
      if (response.status === 201) {
        let user = localStorage.getItem('user');
        if (user) {
          let parsedUser = JSON.parse(user);
          let userId = parsedUser[0].id;
          // Refresh cart list after adding
          return this.getCartList(userId);
        }
      }
      return of(response);
    })
  );
}
  getCartList(userId:string){
    
    return this.http.get<product[]>(`http://localhost:3000/cart?userId=${userId}`,
      {observe:'response'}).pipe(
        tap(
            (result)=>{
              if(result && result.body){
                this.cartData.set(result.body);
              }
              else {
                  this.cartData.set([]); // Set to empty array if no data
              }
            }
        ))
  }
  removeFromCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId, { observe: 'response' }).pipe(
        // The service needs switchMap to delete, then wait for the list to be fetched
        switchMap((response) => {
            if (response.status === 200 || response.status === 204) {
                let user = localStorage.getItem('user');
                if (user) {
                    let parsedUser = JSON.parse(user);
                    let userId = parsedUser[0].id;
                    // Return the Observable from getCartList. This Observable will emit the new cart data.
                    return this.getCartList(userId); 
                }
            }
            // If deletion fails or user is null, return an empty Observable (or throw error)
            return of(null); 
        })
    );
}
  orderNow(data:orderData){
    return this.http.post('http://localhost:3000/order',data,{observe:'response'})
  }
  // we will have order data of all users. here we are getting orders of one user
  getOrderData(){
    return this.http.get<orderData[]>(`http://localhost:3000/order?userId=${this.userId()}`,{observe:'response'});
  }

  getUserId(){
    let user =localStorage.getItem('user');
    if(user){
      let parsedUserData = JSON.parse(user);
      if(Array.isArray(parsedUserData)){
        let userid = parsedUserData[0].id;
        this.userId.set(userid);
      }
    }
  }

  deleteCartItems(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+cartId,{observe:'response'}).subscribe(
      (response)=>{
           if(response.status === 200 || response.status === 204){
            let user = localStorage.getItem('user');
            if(user){
              let parsedUser = JSON.parse(user);
              let userId = parsedUser[0].id;
              this.getCartList(userId)
            }
           }
      }
    )
  }

  cancelOrder(id:string){
        return this.http.delete('http://localhost:3000/order/'+id,{observe:'response'})
  }
}