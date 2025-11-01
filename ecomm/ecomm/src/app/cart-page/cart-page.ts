import { Component,inject,OnInit,signal } from '@angular/core';
import { UserCart } from '../services/user-cart';
import { cartSummary, product } from '../interfaces/sellerAuth-interface';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'ec-cart-page',
  imports: [RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit{
  popup = signal(false);
  cartData=signal<product[]>([]);
  cartSummary :cartSummary= {
    price:0,
    discount:0,
    tax:0,
    delivery:0,
    total:0
  }
  router = inject(Router);
  userCartServ = inject(UserCart)
  constructor(){}

  ngOnInit(): void {
    this.loadDetails();
  }
  removeFromCart(id: number) {
    // 1. Guard for safety
    if (!id) return;
    
    // 2. Call service, which handles delete AND refreshing the list
    this.userCartServ.removeFromCart(id).subscribe({
        next: () => {
            // 3. ONLY after the delete AND the list refresh is complete,
            //    we call loadDetails to re-run the calculation logic.
            this.loadDetails();
        },
        error: (err) => {
            console.error('Error during cart removal:', err);
        }
    });
}


  loadDetails() {
    let userData = localStorage.getItem('user');
    if(userData){
          let userId;
        
        // ... logic to get userId ...
        if (userData) {
          // ... parsedData logic ...
          let parsedUserData = JSON.parse(userData);
          if(Array.isArray(parsedUserData)){
            userId = parsedUserData[0].id;
          }
          // We subscribe directly here to update the component properties
          this.userCartServ.getCartList(userId).subscribe({
            next: (result)=>{
              let cartData = result.body || [];
              this.cartData.set(cartData);
              this.calculateCartSummary(cartData);
              this.checkEmptyCart(cartData);
            },
            error:(error)=>{
              this.handleLocalStorageCart();
            }
          });
        }
    }
    else{
      this.handleLocalStorageCart()
    }
   

}

// Helper method to calculate cart summary
private calculateCartSummary(cartData: product[]) {
  let price = 0;
  
  cartData.forEach((product) => {
    if (product.quantity) {
      price = price + (+product.price * product.quantity);
    }
  });
  
  this.cartSummary.price = price;
  this.cartSummary.discount = 50;
  this.cartSummary.delivery = 100;
  this.cartSummary.tax = 50;
  this.cartSummary.total = price - (50 + 100 + 50);
}

// Helper method to check empty cart
private checkEmptyCart(cartData: product[]) {
  if (!cartData || cartData.length === 0) {
    this.popup.set(true);
    setTimeout(() => {
      this.popup.set(false);
      this.router.navigate(['']);
    }, 1500);
  }
}

// Method to handle localStorage cart (if user is not logged in)
private handleLocalStorageCart() {
  const localCart = localStorage.getItem('localCart');
  if (localCart) {
    try {
      const cartData: product[] = JSON.parse(localCart);
      this.cartData.set(cartData);
      this.calculateCartSummary(cartData);
      this.checkEmptyCart(cartData);
    } catch (error) {
      console.error('Error parsing local cart:', error);
      this.cartData.set([]);
      this.calculateCartSummary([]);
    }
  } else {
    this.cartData.set([]);
    this.calculateCartSummary([]);
    this.checkEmptyCart([]);
  }
}
}
