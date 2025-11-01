import { Component,inject,OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import { JsonPipe } from '@angular/common';
import { UserCart } from '../services/user-cart';
import { orderData, product } from '../interfaces/sellerAuth-interface';
import { faTurkishLiraSign } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'ec-checkout',
  imports: [ReactiveFormsModule,
            FormsModule,
            MatInputModule,
            MatInput,
            MatFormFieldModule,
            MatExpansionModule,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  cartData!:product[] ;
  totalPrice = signal(0);
  checkoutForm!:FormGroup;
  fb  =  inject(FormBuilder)
  userCartServ = inject (UserCart);
  route = inject(Router);
  popup = signal(false);

  constructor(){}

  ngOnInit(): void {
      this.checkoutForm = this.fb.group({
        email : ['',Validators.required],
        phone:[,Validators.required],
        name:['',Validators.required],
        address:this.fb.group({
          line1:['',Validators.required],
          city:['',Validators.required],
          state:['',Validators.required],
          pincode:[,Validators.required]
        })
      })
     this.getInitialDetails();

  }

  getInitialDetails(){
     // get total price or amount
       let userData = localStorage.getItem('user');
       if(userData){
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
          this.cartData = cartData;
          if(cartData){
            let price = 0;
            cartData.forEach((product)=>{
               if(product.quantity){
                // + sign before product is converting it into number data type
                price = price + (+product.price * product.quantity);
                //console.log(price);
                this.totalPrice.set(price-(50+100+50));
              }
            })
          }
        }, 500);

        
      }
       }
       else{
        let localCartData = localStorage.getItem('localCart');
        if(localCartData){
          let ParsedData = JSON.parse(localCartData);
          this.cartData = ParsedData;
          let price = 0;
            this.cartData.forEach((product)=>{
               if(product.quantity){
                // + sign before product is converting it into number data type
                price = price + (+product.price * product.quantity);
                //console.log(price);
                this.totalPrice.set(price-(50+100+50));
              }
            })
        }
       }
  }
  // we are using this data type only once so i put whole object inside parenthesis
  orderNow(data:{email : string,phone:number,name:string,line1:'',city:'',state:'',pincode:number}){
    console.log(data);
    let user= localStorage.getItem('user');
    let userId;
    if(user){
      let parsedUserData = JSON.parse(user);
      if(Array.isArray(parsedUserData)){
        userId = parsedUserData[0].id;
      }
      let orderData: orderData= {
        ...data,
        userId:userId,
        price:this.totalPrice()
      }
      //with placing order we are removing items from cart one by one because json 
      // server cannot delete many items at one time
      // products will be removed from cart and will go to order
      if(Array.isArray(this.cartData)){
          this.cartData.forEach((data)=>{
            setTimeout(() => {
              data.id && this.userCartServ.deleteCartItems(data.id)
            }, 700);
          })
      }

      this.userCartServ.orderNow(orderData).subscribe(
        (response)=>{
          console.log(response);
          this.popup.set(true);
          setTimeout(() => {
            this.popup.set(false);
            this.route.navigate(['']);
          }, 2000);
          
        }
      );

    }
  }

 
}
