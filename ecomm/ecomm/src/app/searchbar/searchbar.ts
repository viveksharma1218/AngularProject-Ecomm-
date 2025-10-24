import { Component,inject,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../interfaces/sellerAuth-interface';
import { SellerAddProduct } from '../services/seller-add-product';
import { combineLatest, tap,switchMap } from 'rxjs';

@Component({
  selector: 'ec-searchbar',
  imports: [],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css'
})
export class Searchbar implements OnInit{
  filter:string | null = '';
  allProduct : product[] | undefined = [];
  filterProducts : product[] | undefined = [];
private route = inject(ActivatedRoute);
private productServ = inject(SellerAddProduct);
constructor(){}

  ngOnInit(): void {
  // Observable for all products
    const products$ = this.productServ.productList();

    // 2. Observalbe for filter(id) So whenever route change we get new value
    const filter$ = this.route.paramMap.pipe(
      tap(params => this.filter = params.get('id')) // Store the filter value
    );

    // 3. Combine them: only execute filtering when BOTH products AND filter are available/changed
    combineLatest([products$, filter$]).subscribe(([products, params]) => {
      this.allProduct = products;
      const currentFilter = params.get('id');

      // Perform filtering logic
      if (currentFilter) {
        this.filterProducts = this.allProduct?.filter((product) => {
            if(product.category == currentFilter){
               return product.category === currentFilter; // Using strict equality
            }
            const filterlowecase = currentFilter.toLowerCase();
            const searchableText = [product.name,product.category,product.color,product.description].join('').toLowerCase()
            return searchableText.includes(filterlowecase);
         
        });
      } else {
        // No filter applied, show all products
        this.filterProducts = this.allProduct;
      }

      console.log('Filtered products updated:', this.filterProducts?.length);
    });
  }

  // 🔑 We no longer need separate getAllProducts and getFilterData methods 
  // as the logic is now encapsulated in the ngOnInit Observable chain.
    



  }



