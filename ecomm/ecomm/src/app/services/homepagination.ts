import { Injectable, signal } from '@angular/core';
import { product } from '../interfaces/sellerAuth-interface';

@Injectable({
  providedIn: 'root'
})
export class Homepagination {
  private allProducts=signal<product[] | undefined>([]);
 currentPage = signal<number>(1);
  private pageSize = signal<number>(50);

  currentProducts = signal<product[]>([]);
  totalPages  = signal<number>(0);

  setProduct(product:product[] | undefined){
    this.allProducts.set(product);
    this.totalPages.set(Math.ceil(product!.length/this.pageSize()));
    this.updateCurrentProducts();
  }
  setPage(page:number){
    this.currentPage.set(page);
    this.updateCurrentProducts();
  }

  private updateCurrentProducts(){
    const startIndex = ( (this.currentPage() - 1 ) * this.pageSize() );
    const endIndex = (startIndex + this.pageSize());
    this.currentProducts.set(this.allProducts()!.slice(startIndex,endIndex));  
  }

  nextPage(){
    if(this.currentPage() < this.totalPages()){
      this.setPage(this.currentPage()+1);
    }
    else{this.setPage(1);}
  }
  previousPage(){
    if(  this.currentPage() > 1 && 
         this.currentPage() < (this.totalPages()+1) ){
          this.setPage(this.currentPage()-1);
    }
    else{this.setPage(this.totalPages());}
  }
}
