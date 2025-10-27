import { Component,inject,signal,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../interfaces/sellerAuth-interface';
import { Allproduct } from '../services/allproduct';
import { map,combineLatest } from 'rxjs';
import { UserCart } from '../services/user-cart';

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
      if(localStorage.getItem('user')){
        this.userCartServ.localAddToCart(this.product);
      }
    }
  }
}
