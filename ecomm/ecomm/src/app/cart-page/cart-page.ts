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
      let userData = localStorage.getItem('user');
      let userId;
      if(userData){
        let parsedData = JSON.parse(userData);
        if(Array.isArray(parsedData)){
          userId = parsedData[0].id;
        }
        //console.log('this is user Id',userId);
        this.userCartServ.getCartList(userId);
        setTimeout(() => {
          let cartData = this.userCartServ.cartData();
          if(cartData){
            this.cartData  = cartData;
            let price = 0;
            cartData.forEach((product)=>{
               if(product.quantity){
                // + sign before product is converting it into number data type
                price = price + (+product.price * product.quantity);
                //console.log(price);
                this.cartSummary.price = price;
                this.cartSummary.discount = 50;
                this.cartSummary.delivery = 100;
                this.cartSummary.tax = 50;
                this.cartSummary.total = price-(50+100+50);
              }
            })
          }
        }, 500);

        
      }

  }
}
