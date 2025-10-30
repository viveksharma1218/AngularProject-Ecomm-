import { Component,inject,OnInit } from '@angular/core';
import { UserCart } from '../services/user-cart';
import { cartSummary, product } from '../interfaces/sellerAuth-interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'ec-cart-page',
  imports: [RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit{
  cartData:product[] | undefined =[];
  cartSummary :cartSummary= {
    price:0,
    discount:0,
    tax:0,
    delivery:0,
    total:0
  }

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
    let userId;
    
    // ... logic to get userId ...
    if (userData) {
      // ... parsedData logic ...
      let parsedUserData = JSON.parse(userData);
      if(Array.isArray(parsedUserData)){
        userId = parsedUserData[0].id;
      }
      // We subscribe directly here to update the component properties
      this.userCartServ.getCartList(userId).subscribe((result) => {
        // This subscription ensures the cartData signal has been updated.
        // Now, we retrieve the fresh data from the signal and perform calculations.
        let cartData = this.userCartServ.cartData();
        
        if (cartData) {
            // **CRITICAL:** Use a Signal for cartData in the component for better reactivity
            // For now, using direct assignment:
            this.cartData = cartData;
            
            let price = 0;
            cartData.forEach((product) => {
                if (product.quantity) {
                    price = price + (+product.price * product.quantity);
                }
            });
            
            // Update summary properties
            this.cartSummary.price = price;
            this.cartSummary.discount = 50;
            this.cartSummary.delivery = 100;
            this.cartSummary.tax = 50;
            this.cartSummary.total = price - (50 + 100 + 50);
        }
      });
    }
}
}
