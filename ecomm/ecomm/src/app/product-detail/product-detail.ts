import { Component,inject,signal,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {product } from '../interfaces/sellerAuth-interface';
import { Allproduct } from '../services/allproduct';
import { map, combineLatest, filter } from 'rxjs';
import { UserCart } from '../services/user-cart';
import { isString } from 'util';

@Component({
  selector: 'ec-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  productId: number=0;
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
  popUp4 = signal(false);
  ngOnInit(): void {
        
        // 1. Create an Observable that maps route params to the product ID (number)
        const productId$ = this.route.paramMap.pipe(
            map(param => {
                const idString = param.get('productId');
                return idString ? +idString : undefined;
            })
        );

        // 2. Combine the two streams: ID changes AND Product Data changes
        combineLatest([
            productId$,                   // Stream 1: The product ID (number)
            this.allProductServ.allProducts$ // Stream 2: The full product array
        ]).subscribe(([productId, productsData]) => {
            // This block runs ONLY when both productId and productsData have a value.
            if(productId && productsData){ 
            this.productId = productId;
            this.allProduct = productsData;
            }
            
            if(this.productId){
              this.getProduct(this.productId, this.allProduct);
            }    
        });
        if(this.productId){
          this.isProductAlreadyBought(this.productId);
        }
        

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
  let userData = localStorage.getItem('user');
    if(this.product){
            this.product.quantity = this.productQuantity;
            // now we have quantity in product object
            //console.log(this.product);
            // we are making this condition if user is not logged in 
            // else statment will handle if user is logged in 
      if(!userData){
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
          let parsedUserData = JSON.parse(userData)[0].id;
          //console.log(typeof(parsedUserData));
          let cartData:product = {
            ...this.product,
            productId:this.productId
            ,userId:parsedUserData
          }
          // now we will delete id property because json will give unique id automatically.
          // for this we made this property optional.
          delete cartData.id;
          this.userCartServ.addToCart(cartData);
              this.productAlreadyBought.set(true);
              this.popUp3.set(true);
              setTimeout(() => {
                this.popUp3.set(false);
              }, 1500);
      }
     
    }
  }
  isProductAlreadyBought(productid:number | null){
    // 1. Guard against null ID
    if (productid == null) {
        this.productAlreadyBought.set(false);
        return;
    }
    // check if product is already added in localStorage cart
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
    // check if product is already added in json data .
    let user = localStorage.getItem('user');
    if(user){
      let parsedUser = JSON.parse(user);
      let userId;
        if(Array.isArray(parsedUser)){
            userId = parsedUser[0].id;
        }
       
        //console.log('this is user id',userId)
        this.userCartServ.getCartList(userId).subscribe({
          next:(response)=>{
            if(response && response.body){
              const cartData = response.body;
              console.log('cart data received', cartData);

              const matchedProduct = cartData.find(
                (product:product)=>{
                  product.productId == productid || product.id == productid
              })
              console.log('matched product',matchedProduct);
              this.productAlreadyBought.set(!!matchedProduct);
            }
          },
          error: (error) => {
                console.error('Error fetching cart data:', error);
                this.productAlreadyBought.set(false);
          }
        })
    }
    else{
      this.productAlreadyBought.set(false);
    }
    
   
   
  }
   removeFromCart(productId:number | null){
    // there are two situations 
    // first if product is inside local Storage
    // Second if product is inside json server

    //first: without login products will be saved inside localStorage
    if(!localStorage.getItem('user')){
      if(this.productId){
             this.userCartServ.localRemoveFromCart(this.productId);
      }
  
    this.productAlreadyBought.set(false);
    this.popUp2.set(true);
    setTimeout(() => {
      this.popUp2.set(false)
    }, 1500);
    }
    // Second: when products are in json server
    else{
      console.log('this is product id',this.productId);
      let user = localStorage.getItem('user');
      let userId;
      if(user){
        let parsedUser = JSON.parse(user);
        userId = parsedUser[0].id;
      }
      console.log('this is user id ',userId);
      console.log('this is product is ', this.productId);
      console.log(typeof(userId));
      this.userCartServ.getCartList(userId);
      let cartData = this.userCartServ.cartData();
      console.log(cartData);
      let newcartData = cartData.filter((product)=>{
        console.log('this is cart product id',product.productId);
        return product.productId == this.productId;
      })
      let id = newcartData[0].id
      console.log(productId);
      if(productId && id){
      this.userCartServ.removeFromCart(id);
       this.productAlreadyBought.set(false);
        this.popUp2.set(true);
        setTimeout(() => {
          this.popUp2.set(false)
        }, 1500);
      }

    }
   
  }
}
