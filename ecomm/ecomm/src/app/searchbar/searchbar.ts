import { Component,inject,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../interfaces/sellerAuth-interface';
import { SellerAddProduct } from '../services/seller-add-product';

@Component({
  selector: 'ec-searchbar',
  imports: [],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css'
})
export class Searchbar implements OnInit{
  filter:string | null = '';
private route = inject(ActivatedRoute);
constructor(){
}

ngOnInit(): void {
    this.filter = this.route.snapshot.paramMap.get('id');
    
    console.log(this.filter);


}


}
