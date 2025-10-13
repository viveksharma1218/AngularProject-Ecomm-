import { Component,inject,OnInit,signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { SellerAddProduct } from '../../services/seller-add-product';
import { Router } from '@angular/router';

@Component({
  selector: 'ec-add-product',
  imports: [FormsModule, MatFormFieldModule, MatInputModule,ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {
  formSubmit=signal(true);
  fb:FormBuilder = inject(FormBuilder);
  sellerAddProductForm!:FormGroup;
  router = inject(Router);
  constructor(private addProductServ:SellerAddProduct){}

  ngOnInit(): void {
      this.sellerAddProductForm = this.fb.group({
        name:['',Validators.required],
        price:['',Validators.required],
        category:['',Validators.required],
        color:['',Validators.required],
        imageUrl:['',Validators.required],
        description:['',Validators.required],
      })
  }
  addProduct(){
    //console.log(this.sellerAddProductForm.value);
    this.addProductServ.AddProduct(this.sellerAddProductForm.value).subscribe((data)=>{
      console.log(data);
      this.formSubmit.set(false)
      setTimeout(() => {
        this.formSubmit.set(true)
        this.router.navigate(['seller-home']);
      },2000);
      
    })
  }
}
