import { Component,OnInit,inject,signal} from '@angular/core';
import { product,productWithPic } from '../interfaces/sellerAuth-interface';
import { SellerAddProduct } from '../services/seller-add-product';
import { Allproduct } from '../services/allproduct';
import { Router } from '@angular/router';
import { Homepagination } from '../services/homepagination';
import { filter } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'ec-home',
  imports: [JsonPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
  AllProducts= signal<product[] | undefined>([]);
  popularProducts:product[] = [];
  productPics:string[] = [
    '3.jpg','3.jpg','3.jpg','3.jpg','3.jpg','3.jpg','3.jpg','3.jpg','3.jpg','3.jpg',];
  productWithPic:productWithPic[] = [];
  private AllproductServ = inject(Allproduct)
  private route = inject(Router);
  paginationServ = inject(Homepagination);
  constructor(private productServ:SellerAddProduct,){

  }

  ngOnInit(): void {
      this.getProduct();
    this.setupProductSubscription();
      //this.getAllProduct();
      //this.combineProduct(); 
     
  }
  getProduct(){
    this.productServ.popularProducts().subscribe((data)=>{
      this.popularProducts = data;
    })
  }
   private setupProductSubscription(): void {
    this.AllproductServ.allProducts$.pipe(
      filter(data => data !== undefined && data !== null && data.length > 0)
    ).subscribe(data => {
      console.log('Filtered data:', data);
      this.AllProducts.set(data);
      data && this.paginationServ.setProduct(data);
    });
  }
  // getAllProduct(){
  //   this.productServ.productList().subscribe((data)=>{
       //this.AllProducts = data;
  //     this.AllproductServ.products = data;

  //   })
  // }
  // combineProduct(){
  //   let combinedList :productWithPic[] = [];
  //   const length = Math.min(this.popularProducts.length, this.productPics.length);
  //   for(let i=0; i<length; i++){
  //     combinedList.push({
  //       product:this.popularProducts[i],
  //       picPath:this.productPics[i]
  //   })
  //   }
  //   this.productWithPic = combinedList;
  // }
  getproductDetail(id:number){
    this.route.navigate(['detail',id])
  }

  nextPage(){
    this.paginationServ.nextPage();
  }
  prevPage(){
    this.paginationServ.previousPage();
  }
  goToPage(page:number){
    this.paginationServ.setPage(page)
  }
   getPageNumbers(): number[] {
    const totalPages = this.paginationServ.totalPages();
    const currentPage = this.paginationServ.currentPage();    const pages: number[] = [];
    
    // Show max 5 page numbers at a time
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
