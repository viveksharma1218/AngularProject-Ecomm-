import { Component,inject,signal,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../interfaces/sellerAuth-interface';
import { Allproduct } from '../services/allproduct';

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
  ngOnInit(): void {
      this.route.paramMap.subscribe((param)=>{
        const productId = param.get('productId');
        this.productId = productId ? +productId : null;
      })
      this.allProductServ.allProducts$.subscribe((data)=>{
        this.allProduct = data;
      })
      this.getProduct(this.productId,this.allProduct)
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
}
