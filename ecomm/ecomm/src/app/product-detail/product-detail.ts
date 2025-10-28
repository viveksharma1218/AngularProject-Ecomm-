import { Component,inject,signal,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {cartData, product } from '../interfaces/sellerAuth-interface';
import { Allproduct } from '../services/allproduct';
import { map,combineLatest } from 'rxjs';
import { UserCart } from '../services/user-cart';
import { isString } from 'util';

@Component({
  selector: 'ec-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  productId: number | null=0;
  product !: product ;
  allProduct:product[] | undefined = [];
  route = inject(ActivatedRoute);
  allProductServ = inject(Allproduct);
  productQuantity:number = 1;
  userCartServ = inject(UserCart);
  productAlreadyBought = signal(false);
  popUp1 = signal(false);
  popUp2 = signal(false);
  popUp3 = signal(false);
ngOnInit(): void {
        
        // 1. Create an Observable that maps route params to the product ID (number)
        const productId$ = this.route.paramMap.pipe(
            map(param => {
                const idString = param.get('productId');
                return idString ? +idString : null;
            })
        );

        // 2. Combine the two streams: ID changes AND Product Data changes
        combineLatest([
            productId$,                   // Stream 1: The product ID (number)
            this.allProductServ.allProducts$ // Stream 2: The full product array
        ]).subscribe(([productId, productsData]) => {
            // This block runs ONLY when both productId and productsData have a value.
            
            this.productId = productId;
            this.allProduct = productsData;
            

                 this.getProduct(this.productId, this.allProduct);
            
        });
        this.isProductAlreadyBought(this.productId);
    }
  getProduct(id:number | null,products:product[] | undefined){
    products!.forEach((product)=>{
      if(product.id == id){
        this.product = product;
      }
    })
  }
  editQuantiry(val:string){
    if(this.productQuantity>1 && 
     val == 'sub'){
      this.productQuantity--;
     }
     else if (this.productQuantity < 20 && val == 'add'){
      this.productQuantity++;
     }
  }
  addToCart(){
    if(this.product){
      this.product.quantity = this.productQuantity;
      // now we have quantity in product object
      //console.log(this.product);
      // we are making this condition if user is not logged in 
      // else statment will handle if user is logged in 
      if(!localStorage.getItem('user')){
        this.userCartServ.localAddToCart(this.product);
        this.productAlreadyBought.set(true);
         this.popUp1.set(true);
      setTimeout(() => {
        this.popUp1.set(false);
      },1500);
      }
      else{
        //console.log('user is logged in ')
        // let's get user data first
        let userData = localStorage.getItem('user');
        if(userData){
          let parsedUserData = JSON.parse(userData)[0].id;
          //console.log(typeof(parsedUserData));
          let cartData:cartData = {
            ...this.product,
            productId:this.productId
            ,userId:parsedUserData
          }
          // now we will delete id property because json will give unique id automatically.
          // for this we made this property optional.
          delete cartData.id;
          this.userCartServ.addToCart(cartData).subscribe((result)=>{
            if(result){
              this.productAlreadyBought.set(true);
              this.popUp3.set(true);
              setTimeout(() => {
                this.popUp3.set(false);
              }, 1500);
            }
          })
        }
      }
     
    }
  }
  isProductAlreadyBought(productid:number | null){
    // 1. Guard against null ID
    if (productid == null) {
        this.productAlreadyBought.set(false);
        return;
    }
    let cartData = localStorage.getItem('localCart');
    if(cartData){
       let parsedData:product[] = JSON.parse(cartData);
       if(Array.isArray(parsedData)){
        const foundItem = parsedData.find((item) => {
                    return item.id == productid;
                });
        if(foundItem){
          //console.log(`this is product ${foundItem}`)
          this.productAlreadyBought.set(true);
        }
       }
    }
   
   
  }
   removeFromCart(productId:number | null){
    this.userCartServ.localRemoveFromCart(this.productId)
    this.productAlreadyBought.set(false);
    this.popUp2.set(true);
    setTimeout(() => {
      this.popUp2.set(false)
    }, 1500);
  }
}
