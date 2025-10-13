import { Component, OnInit,signal,inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerAddProduct } from '../../services/seller-add-product';
import { product } from '../../interfaces/sellerAuth-interface';

@Component({
  selector: 'ec-update',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './update.html',
  styleUrl: './update.css'
})
export class Update implements OnInit{
  productId  = signal('0');
  productData!: product | null;
  updateForm!:FormGroup;
  productUpdated = signal(false);
  router = inject(Router);
  
  constructor(
    private fb:FormBuilder,
    private currentRoute:ActivatedRoute,
    private productServ:SellerAddProduct
  ){}

   ngOnInit(): void {
    // non-null assertion = "Trust me, I know this will not be null at runtime."
    this.productId.set(this.currentRoute.snapshot.paramMap.get('id')!) ;
    this.updateForm = this.fb.group({
        id:[{value:'',disabled:true}],
        name:['',Validators.required],
        price:['',Validators.required],
        category:['',Validators.required],
        color:['',Validators.required],
        imageUrl:['',Validators.required],
        description:['',Validators.required],
    })
    this.productServ.getOneProduct(this.productId()).subscribe((data) => {
      this.productData = data;
      this.updateForm.setValue({
        id:data.id,
        name:data.name,
        price:data.price,
        category:data.category,
        color:data.color,
        imageUrl:data.imageUrl,
        description:data.description
      })
    })
  }
 
  updateProduct(){

    this.productServ.updateProduct(this.updateForm.getRawValue()).subscribe((data)=>{
      console.log(data);
    })
      this.productUpdated.set(true)
      setTimeout(() => {
        this.productUpdated.set(false)
        this.router.navigate(['seller-home']);
      },2000);
      
  }
}
