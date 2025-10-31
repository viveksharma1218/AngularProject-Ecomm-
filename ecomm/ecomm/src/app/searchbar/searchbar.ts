import { ChangeDetectorRef, Component,inject,OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { product } from '../interfaces/sellerAuth-interface';
import { SellerAddProduct } from '../services/seller-add-product';
import { combineLatest, tap,switchMap,filter,map } from 'rxjs';
import { Allproduct } from '../services/allproduct';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'ec-searchbar',
  imports: [],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css'
})
export class Searchbar implements OnInit{
  filter:string | null = '';
  allProduct : product[] | undefined = [];
  filterProducts : product[]= [];
private route = inject(ActivatedRoute);
private router = inject(Router)
private productServ = inject(SellerAddProduct);
private allProductServ = inject(Allproduct);
private cdr = inject(ChangeDetectorRef);
constructor(){}

  ngOnInit(): void {
    // we are creating two observable so when can track them together

    // Observable of Products
    const product$ = this.allProductServ.allProducts$.pipe(
      filter(data => data !== undefined && data !== null && data.length > 0),
      map(data => data as product[])
    )

    // 2. Observalbe for filter(id) So whenever route change we get new value
    const filter$ = this.route.paramMap.pipe(
      map(params => params.get('id')) 
    );

    // 3. Combine them: only execute filtering when BOTH products AND filter are available/changed
  combineLatest([product$,filter$])
  .subscribe(( [products,params]) => {
    this.allProduct = products;
    const currentFilter = params
    // Perform filtering logic
  if (currentFilter) {
      this.filterProducts = this.allProduct.filter((product) => {
        if(product.category == currentFilter){
        return product.category === currentFilter; // Using strict equality
        }
        const filterlowecase = currentFilter.toLowerCase();
        const searchableText = [product.name,product.category,product.color,
          product.description].join('').toLowerCase()
        return searchableText.includes(filterlowecase);
  });
  } else {
  // No filter applied, show all products
  this.filterProducts = this.allProduct;
  }
  console.log('Filtered products updated:', this.filterProducts);
  setTimeout(() => {
        this.cdr.detectChanges(); // Manually trigger change detection
      });
});
}    
  getProductDetail(id:number){
    this.router.navigate(['/detail',id])
  }


  }



