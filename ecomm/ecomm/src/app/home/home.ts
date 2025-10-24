import { Component,OnInit,inject,signal} from '@angular/core';
import { product,productWithPic } from '../interfaces/sellerAuth-interface';
import { SellerAddProduct } from '../services/seller-add-product';
import { Allproduct } from '../services/allproduct';

@Component({
  selector: 'ec-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
  AllProducts= signal<undefined | product[]>([]);
  popularProducts!:product[];
  productPics:string[] = [
    '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg'
  ]
  productWithPic:productWithPic[] = [];
  private AllproductServ = inject(Allproduct)
  constructor(private productServ:SellerAddProduct,){
     this.AllproductServ.allProducts$.subscribe(data => {
      this.AllProducts.set(data);
    }); 
  }

  ngOnInit(): void {
      this.getProduct();
      //this.getAllProduct();
      this.combineProduct(); 
     
  }
  getProduct(){
    this.productServ.popularProducts().subscribe((data)=>{
      this.popularProducts = data;
    })
  }
  // getAllProduct(){
  //   this.productServ.productList().subscribe((data)=>{
       //this.AllProducts = data;
  //     this.AllproductServ.products = data;

  //   })
  // }
  combineProduct(){
    let combinedList :productWithPic[] = [];
    const length = Math.min(this.popularProducts.length, this.productPics.length);
    for(let i=0; i<length; i++){
      combinedList.push({
        product:this.popularProducts[i],
        picPath:this.productPics[i]
    })
    }
    this.productWithPic = combinedList;
  }
}
