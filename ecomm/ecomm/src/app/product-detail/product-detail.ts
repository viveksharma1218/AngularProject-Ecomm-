import { Component,inject,signal,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { orderData, product } from '../interfaces/sellerAuth-interface';
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
              console.log('this is product id ', productId);
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
  addToCart() {
  let userData = localStorage.getItem('user');
  if (!this.product) return;

  this.product.quantity = this.productQuantity;

  if (!userData) {
    // Local storage case
    this.userCartServ.localAddToCart(this.product);
    this.productAlreadyBought.set(true);
    this.popUp1.set(true);
    setTimeout(() => {
      this.popUp1.set(false);
    }, 1500);
  } else {
    // Server case - user is logged in
    let parsedUserData = JSON.parse(userData)[0].id;
    let cartData: product = {
      ...this.product,
      productId: this.productId,
      userId: parsedUserData
    };
    delete cartData.id;

    // Call addToCart and it will automatically refresh cart list
    this.userCartServ.addToCart(cartData).subscribe({
      next: (response) => {
        this.productAlreadyBought.set(true);
        this.popUp3.set(true);
        setTimeout(() => {
          this.popUp3.set(false);
        }, 1500);
        
        // Optional: Manually call getCartList if you want to ensure it's refreshed
        this.userCartServ.getCartList(parsedUserData).subscribe();
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
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

              let matchedProduct;
              if(Array.isArray(cartData)){
                cartData.forEach(
                  (product:product)=>{
                    if(product.productId == this.productId){
                      matchedProduct = product
                    }
                  }
                )
              }
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
  removeFromCart(productId: number | null) {
  if (!productId) {
    console.error('No product ID provided');
    return;
  }

  // First situation: product is inside localStorage (user not logged in)
  if (!localStorage.getItem('user')) {
    if (this.productId) {
      this.userCartServ.localRemoveFromCart(this.productId);
    }
    this.productAlreadyBought.set(false);
    this.popUp2.set(true);
    setTimeout(() => {
      this.popUp2.set(false);
    }, 1500);
    return;
  }

  // Second situation: when products are in json server
  let user = localStorage.getItem('user');
  if (!user) return;

  let parsedUser = JSON.parse(user);
  let userId = parsedUser[0].id;

  // First get the cart list to find the cart item ID
  this.userCartServ.getCartList(userId).subscribe({
    next: (data) => {
      let cartData = data.body;
      console.log('Cart data received:', cartData);
      
      if (cartData && Array.isArray(cartData)) {
        const cartItem = cartData.find((product: product) => 
          product.productId == this.productId
        );

        console.log('Found cart item:', cartItem);

        if (cartItem && cartItem.id) {
          // Call removeFromCart - it will automatically refresh cart list
          this.userCartServ.removeFromCart(cartItem.id).subscribe({
            next: (response) => {
              if (response && response.body) {
                console.log('Successfully removed from cart');
                this.productAlreadyBought.set(false);
                this.popUp2.set(true);
                setTimeout(() => {
                  this.popUp2.set(false);
                }, 1500);
                
                // Optional: Manually call getCartList to ensure refresh
                this.userCartServ.getCartList(userId).subscribe();
              } else {
                console.error('Failed to remove from cart');
              }
            },
            error: (error) => {
              console.error('Error removing from cart:', error);
            }
          });
        } else {
          console.error('Product not found in cart');
        }
      }
    },
    error: (error) => {
      console.error('Error fetching cart data:', error);
    }
  });
}
}
