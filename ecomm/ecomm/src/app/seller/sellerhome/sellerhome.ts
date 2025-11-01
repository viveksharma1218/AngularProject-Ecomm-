import { Component,OnInit,signal,inject } from '@angular/core';
import { SellerAddProduct } from '../../services/seller-add-product';
import { product } from '../../interfaces/sellerAuth-interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan,faEdit} from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { Allproduct } from '../../services/allproduct';
import { Homepagination } from '../../services/homepagination';

@Component({
  selector: 'ec-sellerhome',
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './sellerhome.html',
  styleUrl: './sellerhome.css'
})
export class Sellerhome implements OnInit{
  productList= signal<undefined | product[]>([]);
  deleteMessage = signal<boolean>(false);
  deleteId = signal(0);
  Icon = faTrashCan;
  editIcon = faEdit;
  allProductServ = inject(Allproduct);
  paginationServ = inject(Homepagination);
  sellerAddProductServ = inject(SellerAddProduct);
  constructor(private sellerProductServ:SellerAddProduct){}

  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(){
     this.sellerAddProductServ.productList().subscribe((data)=>{
        this.productList.set(data);
        data && this.paginationServ.setProduct(data);
      })
  }
  deleteProduct(id:number){
    this.deleteMessage.set(true);
    this.deleteId.set(id);
    console.log(id)
    console.log(this.deleteId())
  }
  continue(){
    this.sellerProductServ.deleteProduct(this.deleteId()).subscribe({
      next: () => {
            console.log(`Product deleted successfully (ID: ${this.deleteId()})`);

            this.deleteMessage.set(false);
            this.deleteId.set(0);
            this.loadProducts()

        },

        // Always handle errors
        error: (err) => {
            console.error('Error during product deletion:', err);
            // Optionally: show a user-friendly error message here
        }
    }
    )
   
  }
  cancal(){
    this.deleteMessage.set(false);
    this.deleteId.set(0);
    console.log(this.deleteId())
  }
  generateList(){
    this.sellerProductServ.productList().subscribe((data)=>{
        this.productList.set(data);
      })
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
